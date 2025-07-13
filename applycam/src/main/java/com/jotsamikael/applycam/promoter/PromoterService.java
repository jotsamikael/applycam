package com.jotsamikael.applycam.promoter;

import com.jotsamikael.applycam.auth.RegistrationResponse;
import com.jotsamikael.applycam.centerStatus.TrainingCenterHistoryRepository;
import com.jotsamikael.applycam.centerStatus.TrainingCenterStatusHistory;
import com.jotsamikael.applycam.common.ContentStatus;
import com.jotsamikael.applycam.common.FileStorageService;
import com.jotsamikael.applycam.common.PageResponse;
import com.jotsamikael.applycam.email.EmailService;
import com.jotsamikael.applycam.email.EmailTemplateName;
import com.jotsamikael.applycam.exception.OperationNotPermittedException;
import com.jotsamikael.applycam.role.Role;
import com.jotsamikael.applycam.role.RoleRepository;
import com.jotsamikael.applycam.staff.*;
import com.jotsamikael.applycam.trainingCenter.CreateTainingCenterRequest;
import com.jotsamikael.applycam.trainingCenter.TrainingCenter;
import com.jotsamikael.applycam.trainingCenter.TrainingCenterRepository;
import com.jotsamikael.applycam.user.Token;
import com.jotsamikael.applycam.user.TokenRepository;
import com.jotsamikael.applycam.user.User;
import com.jotsamikael.applycam.user.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PromoterService {
    private final PromoterRepository repository;
    private final TrainingCenterRepository trainingCenterRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final PromoterMapper mapper;
    private final TokenRepository tokenRepository;
    private final FileStorageService fileStorageService;
    private final TrainingCenterHistoryRepository trainingCenterStatusHistoryRepository;

    @Value("${application.mailing.frontend.activation-url}")
    String activationUrl;

    /**
     * Créer un promoteur avec centre de formation
     */
    @Transactional
    public void createPromoter(
            Authentication connectedUser,
            @Valid CreatePromoterAndCenterRequest request
    ) throws MessagingException {
        try {
            log.info("Création d'un nouveau promoteur avec centre de formation");
            
            Role userRole = roleRepository.findByName("PROMOTER")
                .orElseThrow(() -> new IllegalStateException("ROLE PROMOTER was not initialisé"));

            // Vérifications préalables
            validateUniqueness(request);
            validatePassword(request.getPassword(), request.getConfirmPassword());
            validateCardValidityDate(request.getCniValidUntil());
            validateAgreementDate(request.getApprovalEnd(), request.getApprovalStart());
            calculateYearsOfExistence(request.getCreationDate());

            // Construction des entités
            Promoter promoter = buildPromoter(request, userRole);
            TrainingCenter trainingCenter = buildTrainingCenter(request, promoter);
            TrainingCenterStatusHistory trainingCenterStatusHistory = buildTrainingCenterStatusHistory(trainingCenter, "Promoteur créé");

            // Relation bidirectionnelle
            promoter.getTrainingCenterList().add(trainingCenter);

            // Sauvegarde en base
            repository.save(promoter);
            trainingCenter.setCreatedBy(promoter.getIdUser());
            trainingCenterRepository.save(trainingCenter);
            trainingCenterStatusHistoryRepository.save(trainingCenterStatusHistory);

            log.info("Promoteur et centre de formation créés avec succès pour: {}", request.getEmail());
        } catch (Exception e) {
            log.error("Erreur lors de la création du promoteur: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la création du promoteur: " + e.getMessage());
        }
    }

    /**
     * Upload des fichiers du promoteur
     */
    @Transactional
    public void uploadPromoterFile(MultipartFile cniFile, MultipartFile approvalFile, MultipartFile promoterPhoto,
            MultipartFile engagementLetter, MultipartFile locationPlan, MultipartFile internalRegulation,
            String approvalNumber, String email, String centerEmail) throws MessagingException {
        try {
            log.info("Upload des fichiers pour le promoteur: {}", email);
            
            // Vérification du promoteur
            Promoter promoter = validateAndGetPromoter(email);
            
            // Vérification du numéro d'agrément
            if (trainingCenterRepository.existsByAgreementNumber(approvalNumber)) {
                throw new DataIntegrityViolationException("Le numéro d'agrément est déjà utilisé");
            }
            
            // Mise à jour du centre de formation
            TrainingCenter trainingCenter = validateAndGetTrainingCenter(centerEmail);
            trainingCenter.setAgreementNumber(approvalNumber);
            trainingCenterRepository.save(trainingCenter);
            
            // Upload des fichiers
            uploadFileIfPresent(trainingCenter, promoter, cniFile, "CNI");
            uploadFileIfPresent(trainingCenter, promoter, approvalFile, "AGREEMENT");
            uploadFileIfPresent(trainingCenter, promoter, promoterPhoto, "PHOTO");
            uploadFileIfPresent(trainingCenter, promoter, engagementLetter, "SIGNATURE");
            uploadFileIfPresent(trainingCenter, promoter, locationPlan, "LOCALISATION");
            uploadFileIfPresent(trainingCenter, promoter, internalRegulation, "REGULATION");
            
            // Sauvegarde
            trainingCenterRepository.save(trainingCenter);
            repository.save(promoter);
            
            // Envoi d'email
            emailService.sendWaitingForValidationEmail(promoter, trainingCenter);
            
            log.info("Fichiers uploadés avec succès pour le promoteur: {}", email);
        } catch (Exception e) {
            log.error("Erreur lors de l'upload des fichiers: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de l'upload des fichiers: " + e.getMessage());
        }
    }

    /**
     * Ré-upload des fichiers du promoteur
     */
    @Transactional
    public void reUploadPromoterFile(MultipartFile cniFile, MultipartFile approvalFile, MultipartFile promoterPhoto,
            MultipartFile engagementLetter, MultipartFile locationPlan, MultipartFile internalRegulation,
            String approvalNumber, String email, String centerEmail) throws MessagingException {
        try {
            log.info("Ré-upload des fichiers pour le promoteur: {}", email);
            
            Promoter promoter = validateAndGetPromoter(email);
            
            if (trainingCenterRepository.existsByAgreementNumber(approvalNumber)) {
                throw new DataIntegrityViolationException("Le numéro d'agrément est déjà utilisé");
            }
            
            TrainingCenter trainingCenter = validateAndGetTrainingCenter(centerEmail);
            trainingCenter.setAgreementNumber(approvalNumber);
            trainingCenterRepository.save(trainingCenter);
            
            // Upload des fichiers
            uploadFileIfPresent(trainingCenter, promoter, cniFile, "CNI");
            uploadFileIfPresent(trainingCenter, promoter, approvalFile, "AGREEMENT");
            uploadFileIfPresent(trainingCenter, promoter, promoterPhoto, "PHOTO");
            uploadFileIfPresent(trainingCenter, promoter, engagementLetter, "SIGNATURE");
            uploadFileIfPresent(trainingCenter, promoter, locationPlan, "LOCALISATION");
            uploadFileIfPresent(trainingCenter, promoter, internalRegulation, "REGULATION");
            
            trainingCenterRepository.save(trainingCenter);
            repository.save(promoter);
            
            log.info("Fichiers ré-uploadés avec succès pour le promoteur: {}", email);
        } catch (Exception e) {
            log.error("Erreur lors du ré-upload des fichiers: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors du ré-upload des fichiers: " + e.getMessage());
        }
    }

    /**
     * Récupérer tous les promoteurs avec pagination
     */
    public PageResponse<PromoterResponse> getAllPromoter(int offset, int pageSize, String field, boolean order) {
        try {
            log.info("Récupération des promoteurs - offset: {}, pageSize: {}", offset, pageSize);
            
            Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();
            Page<Promoter> list = repository.getAllPromoters(PageRequest.of(offset, pageSize, sort));

            List<PromoterResponse> responses = list.stream()
                .map(mapper::toPromoterResponse)
                .toList();
                
            return new PageResponse<>(
                responses,
                list.getNumber(),
                list.getSize(),
                list.getTotalElements(),
                list.getTotalPages(),
                list.isFirst(),
                list.isLast()
            );
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des promoteurs: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la récupération des promoteurs");
        }
    }

    /**
     * Trouver un promoteur par email
     */
    public PromoterResponse findPromoterByEmail(String email) {
        try {
            log.info("Recherche du promoteur par email: {}", email);
            
            if (email == null || email.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'email est requis");
            }
            
            Promoter promoter = repository.findByEmail(email.trim())
                .orElseThrow(() -> new EntityNotFoundException("Aucun promoteur trouvé avec l'email: " + email));
                
            return mapper.toPromoterResponse(promoter);
        } catch (EntityNotFoundException e) {
            log.warn("Promoteur non trouvé: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Erreur lors de la recherche du promoteur: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la recherche du promoteur");
        }
    }

    /**
     * Mettre à jour le profil d'un promoteur
     */
    @Transactional
    public String updateProfile(String email, CreatePromoterRequest request, Authentication connectedUser) {
        try {
            log.info("Mise à jour du profil du promoteur: {}", email);
            
            User user = validateAndGetUser(connectedUser);
            Promoter promoter = validateAndGetPromoter(email);
            
            if (!promoter.isActived()) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                    "Ce promoteur ne peut pas être mis à jour car il a été supprimé");
            }

            // Mise à jour des informations
            updatePromoterInfo(promoter, request);
            
            // Audit
            promoter.setLastModifiedDate(LocalDateTime.now());
            promoter.setLastModifiedBy(user.getIdUser());

            repository.save(promoter);
            
            log.info("Profil du promoteur mis à jour avec succès: {}", email);
            return email;
        } catch (Exception e) {
            log.error("Erreur lors de la mise à jour du profil: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la mise à jour du profil: " + e.getMessage());
        }
    }

    /**
     * Réinitialiser le mot de passe d'un promoteur
     */
    @Transactional
    public String resetPassword(String email, Authentication connectedUser) throws MessagingException {
        try {
            log.info("Réinitialisation du mot de passe pour le promoteur: {}", email);
            
            User user = validateAndGetUser(connectedUser);
            Promoter promoter = validateAndGetPromoter(email);
            
            // Génération du nouveau mot de passe
            String activationCode = generateActivationCode(8);
            promoter.setPassword(passwordEncoder.encode(activationCode));
            
            // Audit
            promoter.setLastModifiedBy(user.getIdUser());
            promoter.setLastModifiedDate(LocalDateTime.now());
            
            repository.save(promoter);
            
            // Envoi de l'email
            sendResetPasswordEmail(email, activationCode);
            
            log.info("Mot de passe réinitialisé avec succès pour: {}", email);
            return email;
        } catch (MessagingException e) {
            log.error("Erreur lors de l'envoi de l'email de réinitialisation: {}", e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            log.error("Erreur lors de la réinitialisation du mot de passe: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la réinitialisation: " + e.getMessage());
        }
    }

    /**
     * Désactiver/réactiver un promoteur
     */
    @Transactional
    public void togglePromoter(String email, Authentication connectedUser) {
        try {
            log.info("Changement de statut du promoteur: {}", email);
            
            User user = validateAndGetUser(connectedUser);
            Promoter promoter = validateAndGetPromoter(email);
            
            if (promoter.isActived()) {
                // Désactivation
                promoter.setEnabled(false);
                promoter.setActived(false);
                promoter.setArchived(true);
                log.info("Promoteur désactivé: {}", email);
            } else {
                // Réactivation
                promoter.setEnabled(true);
                promoter.setActived(true);
                promoter.setArchived(false);
                log.info("Promoteur réactivé: {}", email);
            }
            
            // Audit
            promoter.setLastModifiedBy(user.getIdUser());
            promoter.setLastModifiedDate(LocalDateTime.now());
            
            repository.save(promoter);
        } catch (Exception e) {
            log.error("Erreur lors du changement de statut du promoteur: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors du changement de statut: " + e.getMessage());
        }
    }

    /**
     * Valider un promoteur
     */
    @Transactional
    public String validatePromoter(String email, Authentication connectedUser) {
        try {
            log.info("Validation du promoteur: {}", email);
            
            User user = validateAndGetUser(connectedUser);
            Promoter promoter = validateAndGetPromoter(email);
            
            promoter.setEnabled(true);
            userRepository.save(promoter);
            
            // Envoi d'email de validation
            emailService.sendPromoterValidationEmail(
                promoter.getEmail(),
                promoter.fullName(),
                "promoter_validation",
                "Vous avez été validé avec succès"
            );
            
            log.info("Promoteur validé avec succès: {}", email);
            return "VALIDATED";
        } catch (MessagingException e) {
            log.error("Erreur lors de l'envoi de l'email de validation: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de l'envoi de l'email de validation");
        } catch (Exception e) {
            log.error("Erreur lors de la validation du promoteur: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la validation: " + e.getMessage());
        }
    }

    /**
     * Supprimer définitivement un promoteur
     */
    @Transactional
    public void deletePromoterPermanently(String email, Authentication connectedUser) {
        try {
            log.info("Suppression définitive du promoteur: {}", email);
            
            User user = validateAndGetUser(connectedUser);
            Promoter promoter = validateAndGetPromoter(email);
            
            // Vérification des droits (seul le STAFF peut supprimer définitivement)
            boolean isStaff = user.getRoles().stream()
                .anyMatch(role -> "STAFF".equals(role.getName()));
            
            if (!isStaff) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                    "Seuls les membres du staff peuvent supprimer définitivement un promoteur");
            }
            
            // Suppression définitive
            repository.delete(promoter);
            log.info("Promoteur supprimé définitivement: {}", email);
        } catch (Exception e) {
            log.error("Erreur lors de la suppression définitive: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la suppression: " + e.getMessage());
        }
    }

    /**
     * Désactiver un promoteur (soft delete)
     */
    @Transactional
    public void deactivatePromoter(String email, Authentication connectedUser) {
        try {
            log.info("Désactivation du promoteur: {}", email);
            
            User user = validateAndGetUser(connectedUser);
            Promoter promoter = validateAndGetPromoter(email);
            
            // Vérification des droits
            boolean isStaff = user.getRoles().stream()
                .anyMatch(role -> "STAFF".equals(role.getName()));
            
            if (!isStaff && !promoter.getEmail().equals(user.getEmail())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                    "Vous ne pouvez pas désactiver ce promoteur");
            }
            
            // Désactivation
            promoter.setEnabled(false);
            promoter.setActived(false);
            promoter.setArchived(true);
            promoter.setLastModifiedBy(user.getIdUser());
            promoter.setLastModifiedDate(LocalDateTime.now());
            
            repository.save(promoter);
            log.info("Promoteur désactivé avec succès: {}", email);
        } catch (Exception e) {
            log.error("Erreur lors de la désactivation: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la désactivation: " + e.getMessage());
        }
    }

    /**
     * Réactiver un promoteur
     */
    @Transactional
    public void reactivatePromoter(String email, Authentication connectedUser) {
        try {
            log.info("Réactivation du promoteur: {}", email);
            
            User user = validateAndGetUser(connectedUser);
            Promoter promoter = validateAndGetPromoter(email);
            
            // Vérification des droits (seul le STAFF peut réactiver)
            boolean isStaff = user.getRoles().stream()
                .anyMatch(role -> "STAFF".equals(role.getName()));
            
            if (!isStaff) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                    "Seuls les membres du staff peuvent réactiver un promoteur");
            }
            
            // Réactivation
            promoter.setEnabled(true);
            promoter.setActived(true);
            promoter.setArchived(false);
            promoter.setLastModifiedBy(user.getIdUser());
            promoter.setLastModifiedDate(LocalDateTime.now());
            
            repository.save(promoter);
            log.info("Promoteur réactivé avec succès: {}", email);
        } catch (Exception e) {
            log.error("Erreur lors de la réactivation: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la réactivation: " + e.getMessage());
        }
    }

    /**
     * Récupérer un promoteur par ID
     */
    public PromoterResponse getPromoterById(Long promoterId) {
        try {
            log.info("Récupération du promoteur ID: {}", promoterId);
            
            Promoter promoter = repository.findById(promoterId)
                .orElseThrow(() -> new EntityNotFoundException("Promoteur non trouvé avec l'ID: " + promoterId));
                
            return mapper.toPromoterResponse(promoter);
        } catch (EntityNotFoundException e) {
            log.warn("Promoteur non trouvé: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Erreur lors de la récupération du promoteur: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la récupération du promoteur");
        }
    }

    // ==================== MÉTHODES PRIVÉES D'AIDE ====================
    
    private User validateAndGetUser(Authentication connectedUser) {
        if (connectedUser == null || connectedUser.getPrincipal() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur non authentifié");
        }
        return (User) connectedUser.getPrincipal();
    }
    
    private Promoter validateAndGetPromoter(String email) {
        return repository.findByEmail(email)
            .orElseThrow(() -> new EntityNotFoundException("Promoteur non trouvé pour l'email: " + email));
    }
    
    private TrainingCenter validateAndGetTrainingCenter(String centerEmail) {
        return trainingCenterRepository.findByCenterEmail(centerEmail)
            .orElseThrow(() -> new EntityNotFoundException("Centre de formation non trouvé pour l'email: " + centerEmail));
    }
    
    private void validateUniqueness(CreatePromoterAndCenterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DataIntegrityViolationException("Email déjà utilisé");
        }
        if (userRepository.existsByPhoneNumber(request.getPhone())) {
            throw new DataIntegrityViolationException("Numéro de téléphone déjà utilisé");
        }
        if (userRepository.existsByNationalIdNumber(request.getCniNumber())) {
            throw new DataIntegrityViolationException("Numéro de carte nationale déjà utilisé");
        }
    }

    private void validatePassword(String password, String confirmPassword) {
        if (!password.equals(confirmPassword)) {
            throw new IllegalArgumentException("Le mot de passe et la confirmation ne correspondent pas");
        }
    }

    private void validateCardValidityDate(LocalDate validUntil) {
        LocalDate currentDate = LocalDate.now();
        if (validUntil == null || !validUntil.isAfter(currentDate)) {
            throw new IllegalArgumentException("Votre carte d'identité n'est pas valide");
        }
    }
    
    private void validateAgreementDate(LocalDate validEnd, LocalDate validStart) {
        LocalDate currentDate = LocalDate.now();
        if (validEnd == null || validStart == null || !validEnd.isAfter(currentDate)) {
            throw new IllegalArgumentException("La date d'agrément n'est pas valide");
        }
    }

    private Promoter buildPromoter(CreatePromoterAndCenterRequest req, Role userRole) {
        return Promoter.builder()
            .firstname(req.getFirstName())
            .lastname(req.getLastName())
            .email(req.getEmail())
            .nationality(req.getNationality())
            .SchoolLevel(req.getProfession())
            .dateOfBirth(LocalDate.parse(req.getBirthDate()))
            .phoneNumber(req.getPhone())
            .nationalIdNumber(req.getCniNumber())
            .address(req.getResidenceCity())
            .sex(req.getGender())
            .createdDate(LocalDateTime.now())
            .roles(List.of(userRole))
            .enabled(false)
            .accountLocked(false)
            .password(passwordEncoder.encode(req.getPassword()))
            .trainingCenterList(new ArrayList<>())
            .build();
    }

    private TrainingCenter buildTrainingCenter(CreatePromoterAndCenterRequest req, Promoter promoter) {
        return TrainingCenter.builder()
            .fullName(req.getCenterName())
            .acronym(req.getCenterAcronym())
            .centerType(req.getCenterType())
            .centerPhone(req.getCenterPhone())
            .centerEmail(req.getCenterEmail())
            .website(req.getWebsite())
            .division(req.getDepartement())
            .region(req.getRegion())
            .city(req.getCity())
            .fullAddress(req.getFullAddress())
            .startDateOfAgreement(req.getApprovalStart())
            .endDateOfAgreement(req.getApprovalEnd())
            .isCenterPresentCandidateForCqp(req.getIsCenterPresentCandidateForCqp())
            .isCenterPresentCandidateForDqp(req.getIsCenterPresentCandidateForDqp())
            .centerAge(calculateYearsOfExistence(req.getCreationDate()))
            .promoter(promoter)
            .createdDate(LocalDateTime.now())
            .build();
    }
    
    private TrainingCenterStatusHistory buildTrainingCenterStatusHistory(TrainingCenter trainingCenter, String comment) {
        return TrainingCenterStatusHistory.builder()
            .trainingCenter(trainingCenter)
            .comment(comment)
            .status(ContentStatus.DRAFT)
            .createdDate(LocalDateTime.now())
            .createdBy(0)
            .build();
    }
    
    private void uploadFileIfPresent(TrainingCenter trainingCenter, Promoter promoter, MultipartFile file, String fileType) {
        if (file != null && !file.isEmpty()) {
            try {
                String url = fileStorageService.saveFile(file, promoter.getIdUser(), fileType);
                updateFileUrl(trainingCenter, promoter, fileType, url);
            } catch (Exception e) {
                log.error("Erreur lors de l'upload du fichier {}: {}", fileType, e.getMessage(), e);
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                    "Erreur lors de l'upload du fichier " + fileType);
            }
        } else {
            throw new IllegalArgumentException("Fichier manquant");
        }
    }
    
    private void updateFileUrl(TrainingCenter trainingCenter, Promoter promoter, String fileType, String url) {
        switch (fileType) {
            case "CNI" -> promoter.setNationalIdCardUrl(url);
            case "AGREEMENT" -> trainingCenter.setAgreementFileUrl(url);
            case "PHOTO" -> promoter.setPhotoUrl(url);
            case "SIGNATURE" -> trainingCenter.setSignatureLetterUrl(url);
            case "LOCALISATION" -> trainingCenter.setLocalisationFileUrl(url);
            case "REGULATION" -> trainingCenter.setInternalRegulationFileUrl(url);
            default -> throw new IllegalArgumentException("Type de fichier non géré: " + fileType);
        }
    }
    
    private void updatePromoterInfo(Promoter promoter, CreatePromoterRequest request) {
        promoter.setFirstname(request.getFirstname());
        promoter.setLastname(request.getLastname());
        promoter.setDateOfBirth(LocalDate.parse(request.getDateOfBirth()));
        promoter.setPhoneNumber(request.getPhoneNumber());
        promoter.setNationalIdNumber(request.getNationalIdNumber());
        promoter.setAddress(request.getAddress());
    }
    
    public int calculateYearsOfExistence(LocalDate createdDate) {
        LocalDate today = LocalDate.now();
        if (createdDate != null && !createdDate.isAfter(today)) {
            return Period.between(createdDate, today).getYears();
        } else {
            throw new IllegalArgumentException("La date de création est invalide.");
        }
    }

    private String generateActivationCode(int length) {
        String characters = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();
        SecureRandom secureRandom = new SecureRandom();
        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(characters.length());
            codeBuilder.append(characters.charAt(randomIndex));
        }
        return codeBuilder.toString();
    }

    private void sendResetPasswordEmail(String email, String newPassword) throws MessagingException {
        emailService.sendEmail(
            email,
            email,
            EmailTemplateName.ACTIVATE_ACCOUNT,
            newPassword,
            null,
            "Activation de compte"
        );
    }
}




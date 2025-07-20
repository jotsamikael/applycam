package com.jotsamikael.applycam.candidate;
import com.jotsamikael.applycam.common.ContentStatus;
import com.jotsamikael.applycam.common.PageResponse;
import com.jotsamikael.applycam.promoter.Promoter;
import com.jotsamikael.applycam.promoter.PromoterRepository;
import com.jotsamikael.applycam.user.User;
import com.jotsamikael.applycam.trainingCenter.TrainingCenter;
import com.jotsamikael.applycam.trainingCenter.TrainingCenterMapper;
import com.jotsamikael.applycam.trainingCenter.TrainingCenterResponse;
import com.jotsamikael.applycam.candidate.CreateCandidateByCenterRequest;
import com.jotsamikael.applycam.hasSchooled.HasSchooled;
import com.jotsamikael.applycam.hasSchooled.HasSchooledRepository;
import com.jotsamikael.applycam.trainingCenter.TrainingCenterRepository;
import com.jotsamikael.applycam.role.RoleRepository;
import com.jotsamikael.applycam.role.Role;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.Map;
import java.security.SecureRandom;
import jakarta.mail.MessagingException;
import com.jotsamikael.applycam.email.EmailService;
import com.jotsamikael.applycam.email.EmailTemplateName;
import com.jotsamikael.applycam.user.Token;
import com.jotsamikael.applycam.user.TokenRepository;
import org.springframework.beans.factory.annotation.Value;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final CandidateMapper mapper;
    private final PromoterRepository promoterRepository;
    private final TrainingCenterMapper trainingCenterMapper;
    private final HasSchooledRepository hasSchooledRepository;
    private final TrainingCenterRepository trainingCenterRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final TokenRepository tokenRepository;

    @Value("${application.mailing.frontend.activation-url:https://ton-frontend.com/activate-account}")
    private String activationUrl;

    /**
     * Récupérer tous les candidats avec pagination
     */
    public PageResponse<CandidateResponse> getAllCandidates(int offset, int pageSize, String field, boolean order) {
        try {
            log.info("Récupération des candidats - offset: {}, pageSize: {}", offset, pageSize);
            
        Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();
            Page<Candidate> list = candidateRepository.getAllCandidate(PageRequest.of(offset, pageSize, sort));

            List<CandidateResponse> responses = list.stream()
                .map(mapper::toCandidateResponse)
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
            log.error("Erreur lors de la récupération des candidats: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la récupération des candidats");
        }
    }

    /**
     * Trouver un candidat par email
     */
    public CandidateResponse findCandidateByEmail(String email) {
        try {
            log.info("Recherche du candidat par email: {}", email);
            
            if (email == null || email.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'email est requis");
            }
            
            Candidate candidate = candidateRepository.findByEmail(email.trim())
                .orElseThrow(() -> new EntityNotFoundException("Aucun candidat trouvé avec l'email: " + email));
                
        return mapper.toCandidateResponse(candidate);
        } catch (EntityNotFoundException e) {
            log.warn("Candidat non trouvé: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Erreur lors de la recherche du candidat: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la recherche du candidat");
        }
    }

    /**
     * Mettre à jour le profil d'un candidat
     */
    @Transactional
    public String updateProfile(String email, CandidateRequest request, Authentication connectedUser) {
        try {
            log.info("Mise à jour du profil du candidat: {}", email);
            
            User user = validateAndGetUser(connectedUser);
            Candidate candidate = validateAndGetCandidate(email);
            
            // Vérification que le candidat peut être mis à jour
            if (!candidate.isActived()) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                    "Ce candidat ne peut pas être mis à jour car il a été supprimé");
            }

            // Mise à jour des informations du candidat
            updateCandidateInfo(candidate, request);
            
            // Audit
        candidate.setLastModifiedDate(LocalDateTime.now());
        candidate.setLastModifiedBy(user.getIdUser());

        candidateRepository.save(candidate);

            log.info("Profil du candidat mis à jour avec succès: {}", email);
        return email;
        } catch (Exception e) {
            log.error("Erreur lors de la mise à jour du profil: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la mise à jour du profil: " + e.getMessage());
        }
    }
    
    /**
     * Récupérer les candidats d'un promoteur connecté
     */
    public PageResponse<CandidateResponse> getCandidatesOfConnectedPromoter(
            Authentication connectedUser, int year, int offset, int pageSize, String field, boolean order) {
        try {
            log.info("Récupération des candidats du promoteur connecté pour l'année: {}", year);
            
            User user = validateAndGetUser(connectedUser);
            Promoter promoter = validateAndGetPromoter(user.getEmail());
            
            // Validation de l'année
        int currentYear = Year.now().getValue();
        if (year <= 1900 || year > 2100) {
                log.warn("Année invalide ({}) utilisée, utilisation de l'année courante: {}", year, currentYear);
            year = currentYear;
        }

            Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();
            Page<Candidate> candidates = candidateRepository.findAllBypromoterId(
                user.getIdUser(), year, PageRequest.of(offset, pageSize, sort));

        List<CandidateResponse> candidateResponses = candidates.getContent().stream()
                .map(candidate -> CandidateResponse.builder()
                                                    .firstname(candidate.getFirstname())
                                                    .lastname(candidate.getLastname())
                                                     .dateOfBirth(candidate.getDateOfBirth())
                                                     .contentStatus(candidate.getContentStatus())
                                                     .build())
                                                     .toList();
        
        return new PageResponse<>(
            candidateResponses,
            candidates.getNumber(),
            candidates.getSize(),
            candidates.getTotalElements(),
            candidates.getTotalPages(),
            candidates.isFirst(),
            candidates.isLast()
        );
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des candidats du promoteur: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la récupération des candidats");
        }
    }
    
    /**
     * Trouver un candidat par nom dans les centres du promoteur
     */
    public CandidateResponse findByName(Long promoterId, String name) {
        try {
            log.info("Recherche du candidat '{}' pour le promoteur ID: {}", name, promoterId);
            
            if (name == null || name.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le nom du candidat est requis");
            }
            
            Candidate candidate = candidateRepository.findCandidateByName(promoterId, name.trim())
                .orElseThrow(() -> new EntityNotFoundException(
                    "Le candidat n'est pas dans l'un de vos centres de formation ou n'existe pas"));
            
            if (!candidate.isActived()) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                    "Ce candidat a été supprimé");
            }
            
            return mapper.toCandidateResponse(candidate);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (EntityNotFoundException e) {
            log.warn("Candidat non trouvé: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Erreur lors de la recherche du candidat: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la recherche du candidat");
        }
    }
    
    /**
     * Désactiver/réactiver un candidat
     */
    @Transactional
    public void toggleCandidate(String email, Authentication connectedUser) {
        try {
            log.info("Changement de statut du candidat: {}", email);
            
            User user = validateAndGetUser(connectedUser);
            Candidate candidate = validateAndGetCandidate(email);
            
        if (candidate.isActived()) {
            // Désactivation
        	candidate.setEnabled(false);
        	candidate.setActived(false);
        	candidate.setArchived(true);
                log.info("Candidat désactivé: {}", email);
        } else {
            // Réactivation
        	candidate.setEnabled(true);
        	candidate.setActived(true);
        	candidate.setArchived(false);
                log.info("Candidat réactivé: {}", email);
            }
            
            // Audit
            candidate.setLastModifiedBy(user.getIdUser());
            candidate.setLastModifiedDate(LocalDateTime.now());
            
            candidateRepository.save(candidate);
        } catch (Exception e) {
            log.error("Erreur lors du changement de statut du candidat: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors du changement de statut: " + e.getMessage());
        }
    }
    
    /**
     * Supprimer définitivement un candidat
     */
    @Transactional
    public void deleteCandidatePermanently(String email, Authentication connectedUser) {
        try {
            log.info("Suppression définitive du candidat: {}", email);
            
            User user = validateAndGetUser(connectedUser);
            Candidate candidate = validateAndGetCandidate(email);
            
            // Vérification des droits (seul le STAFF peut supprimer définitivement)
            boolean isStaff = user.getRoles().stream()
                .anyMatch(role -> "STAFF".equals(role.getName()));
            
            if (!isStaff) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                    "Seuls les membres du staff peuvent supprimer définitivement un candidat");
            }
            
            // Suppression définitive
            candidateRepository.delete(candidate);
            log.info("Candidat supprimé définitivement: {}", email);
        } catch (Exception e) {
            log.error("Erreur lors de la suppression définitive: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la suppression: " + e.getMessage());
        }
    }
    
    /**
     * Désactiver un candidat (soft delete)
     */
    @Transactional
    public void deactivateCandidate(String email, Authentication connectedUser) {
        try {
            log.info("Désactivation du candidat: {}", email);
            
            User user = validateAndGetUser(connectedUser);
            Candidate candidate = validateAndGetCandidate(email);
            
            // Vérification des droits
            boolean isStaff = user.getRoles().stream()
                .anyMatch(role -> "STAFF".equals(role.getName()));
            
            if (!isStaff && !candidate.getEmail().equals(user.getEmail())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                    "Vous ne pouvez pas désactiver ce candidat");
            }
            
            // Désactivation
            candidate.setEnabled(false);
            candidate.setActived(false);
            candidate.setArchived(true);
            candidate.setLastModifiedBy(user.getIdUser());
            candidate.setLastModifiedDate(LocalDateTime.now());
            
            candidateRepository.save(candidate);
            log.info("Candidat désactivé avec succès: {}", email);
        } catch (Exception e) {
            log.error("Erreur lors de la désactivation: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la désactivation: " + e.getMessage());
        }
    }
    
    /**
     * Réactiver un candidat
     */
    @Transactional
    public void reactivateCandidate(String email, Authentication connectedUser) {
        try {
            log.info("Réactivation du candidat: {}", email);
            
            User user = validateAndGetUser(connectedUser);
            Candidate candidate = validateAndGetCandidate(email);
            
            // Vérification des droits (seul le STAFF peut réactiver)
            boolean isStaff = user.getRoles().stream()
                .anyMatch(role -> "STAFF".equals(role.getName()));
            
            if (!isStaff) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                    "Seuls les membres du staff peuvent réactiver un candidat");
            }
            
            // Réactivation
            candidate.setEnabled(true);
            candidate.setActived(true);
            candidate.setArchived(false);
        candidate.setLastModifiedBy(user.getIdUser());
        candidate.setLastModifiedDate(LocalDateTime.now());
            
        candidateRepository.save(candidate);
            log.info("Candidat réactivé avec succès: {}", email);
        } catch (Exception e) {
            log.error("Erreur lors de la réactivation: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la réactivation: " + e.getMessage());
        }
    }
    
    /**
     * Récupérer un candidat par ID
     */
    public CandidateResponse getCandidateById(Long candidateId) {
        try {
            log.info("Récupération du candidat ID: {}", candidateId);
            
            Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new EntityNotFoundException("Candidat non trouvé avec l'ID: " + candidateId));
                
            return mapper.toCandidateResponse(candidate);
        } catch (EntityNotFoundException e) {
            log.warn("Candidat non trouvé: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Erreur lors de la récupération du candidat: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la récupération du candidat");
        }
    }
    
    /**
     * Rechercher des candidats par nom
     */
    public List<CandidateResponse> searchCandidatesByName(String name) {
        try {
            log.info("Recherche de candidats par nom: {}", name);
            
            if (name == null || name.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le nom est requis");
            }
            
            // Implémentation de la recherche par nom
            // Note: Cette méthode nécessite l'ajout d'une méthode dans le repository
            List<Candidate> candidates = candidateRepository.findByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCase(
                name.trim(), name.trim());
            
            return candidates.stream()
                .map(mapper::toCandidateResponse)
                .toList();
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            log.error("Erreur lors de la recherche par nom: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la recherche par nom");
        }
    }
    
    public CandidateFullInfoResponse candidateInformation(String email) {
        Candidate candidate = candidateRepository.findByEmail(email)
            .orElseThrow(() -> new EntityNotFoundException("Candidat non trouvé pour l'email: " + email));

        // Centre de formation principal (premier hasSchooled)
        TrainingCenter trainingCenter = null;
        String schooledYear = null;
        if (candidate.getHasSchooledList() != null && !candidate.getHasSchooledList().isEmpty()) {
            trainingCenter = candidate.getHasSchooledList().get(0).getTrainingCenter();
        }

        // Années de scolarisation
        List<String> schooledYears = candidate.getHasSchooledList() != null ?
            candidate.getHasSchooledList().stream()
                .map(hs -> hs.getStartYear() + "-" + hs.getEndYear())
                .toList() : List.of();

        // Centre d'examen
        String examCenterName = candidate.getExamCenter() != null ? candidate.getExamCenter().getName() : null;
        String examCenterRegion = candidate.getExamCenter() != null ? candidate.getExamCenter().getRegion() : null;

        return CandidateFullInfoResponse.builder()
            .candidate(mapper.toCandidateResponse(candidate))
            .trainingCenter(trainingCenter != null ? trainingCenterMapper.toTrainingResponse(trainingCenter) : null)
            .examCenterName(examCenterName)
            .examCenterRegion(examCenterRegion)
            .schooledYears(schooledYears)
            .profilePictureUrl(candidate.getProfilePictureUrl())
            .birthCertificateUrl(candidate.getBirthCertificateUrl())
            .nationalIdCardUrl(candidate.getNationalIdCardUrl())
            .highestDiplomatUrl(candidate.getHighestDiplomatUrl())
            .cvUrl(candidate.getCvUrl())
            .letterUrl(candidate.getLetterUrl())
            .financialJustificationUrl(candidate.getFinancialJustificationUrl())
            .stageCertificateUrl(candidate.getStageCertificateUrl())
            .oldApplyanceUrl(candidate.getOldApplyanceUrl())
            .contentStatus(candidate.getContentStatus() != null ? candidate.getContentStatus().name() : null)
            .isAccountActive(candidate.isActived())
            .build();
    }
    
    // --- Nouvelle méthode pour création par le centre ---
    public void createCandidateByCenter(CreateCandidateByCenterRequest request, Authentication connectedUser) throws MessagingException {
        // Vérifier que l'email n'existe pas déjà
        if (candidateRepository.findByEmail(request.email) != null && candidateRepository.findByEmail(request.email).isPresent()) {
            throw new IllegalArgumentException("Email déjà utilisé");
        }
        // Générer un mot de passe aléatoire
        String randomPassword = generateRandomPassword(10);
        // Récupérer le centre de formation
        var center = trainingCenterRepository.findByFullName(request.trainingCenterName)
            .orElseThrow(() -> new EntityNotFoundException("Centre de formation non trouvé: " + request.trainingCenterName));
        // Récupérer le rôle CANDIDATE
        Role userRole = roleRepository.findByName("CANDIDATE")
            .orElseThrow(() -> new IllegalStateException("ROLE CANDIDATE was not initialized"));
        // Créer le candidat
        Candidate candidate = Candidate.builder()
            .firstname(request.firstname)
            .lastname(request.lastname)
            .email(request.email)
            .phoneNumber(request.phoneNumber)
            .language(request.language)
            .accountLocked(false)
            .enabled(false)
            .password(passwordEncoder.encode(randomPassword))
            .createdDate(java.time.LocalDateTime.now())
            .roles(List.of(userRole))
            .build();
        candidateRepository.save(candidate);
        // Associer au centre via HasSchooled
        HasSchooled hs = new HasSchooled();
        hs.setCandidate(candidate);
        hs.setTrainingCenter(center);
        hs.setStartYear(java.time.LocalDate.parse(request.startYear));
        hs.setEndYear(java.time.LocalDate.parse(request.endYear));
        hs.setActived(true);
        hasSchooledRepository.save(hs);
        // Générer le code d'activation
        String activationCode = generateActivationCode(6);
        Token token = Token.builder()
            .token(activationCode)
            .createdAt(java.time.LocalDateTime.now())
            .expiresAt(java.time.LocalDateTime.now().plusMinutes(15))
            .user(candidate)
            .build();
        tokenRepository.save(token);
        // Générer le lien d'activation
        String confirmationUrl = activationUrl + "?token=" + activationCode;
        // Envoyer le mail avec le mot de passe ET le code d'activation et le lien
        String subject = "Votre compte a été créé par le centre de formation " + center.getFullName();
        String activationInfo = "Mot de passe : " + randomPassword + "\nCode d'activation : " + activationCode;
        emailService.sendEmail(candidate.getEmail(), candidate.getFirstname(), EmailTemplateName.ACTIVATE_ACCOUNT, confirmationUrl, activationInfo, subject);
    }

    private String generateRandomPassword(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    private String generateActivationCode(int length) {
        String characters = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();
        java.security.SecureRandom secureRandom = new java.security.SecureRandom();
        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(characters.length());
            codeBuilder.append(characters.charAt(randomIndex));
        }
        return codeBuilder.toString();
    }
    
    // ==================== MÉTHODES PRIVÉES D'AIDE ====================
    
    private User validateAndGetUser(Authentication connectedUser) {
        if (connectedUser == null || connectedUser.getPrincipal() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur non authentifié");
        }
        return (User) connectedUser.getPrincipal();
    }
    
    private Candidate validateAndGetCandidate(String email) {
        return candidateRepository.findByEmail(email)
            .orElseThrow(() -> new EntityNotFoundException("Candidat non trouvé pour l'email: " + email));
    }
    
    private Promoter validateAndGetPromoter(String email) {
        return promoterRepository.findByEmail(email)
            .orElseThrow(() -> new EntityNotFoundException("Vous n'êtes pas un promoteur ou vous n'êtes pas connecté"));
    }
    
    private void updateCandidateInfo(Candidate candidate, CandidateRequest request) {
        candidate.setFirstname(request.firstname());
        candidate.setLastname(request.lastname());
        candidate.setDateOfBirth(request.dateOfBirth());
        candidate.setEmail(request.email());
        candidate.setPhoneNumber(request.phoneNumber());
        candidate.setNationalIdNumber(request.nationalIdNumber());
        candidate.setSex(request.sex());
        candidate.setPlaceOfBirth(request.placeOfBirth());
        candidate.setMotherFullName(request.motherFullName());
        candidate.setFatherFullName(request.fatherFullName());
        candidate.setMotherProfession(request.motherProfession());
        candidate.setFatherProfession(request.fatherProfession());
        candidate.setHighestSchoolLevel(request.highestSchoolLevel());
        candidate.setNationality(request.nationality());
        candidate.setTownOfResidence(request.townOfResidence());
    }
}

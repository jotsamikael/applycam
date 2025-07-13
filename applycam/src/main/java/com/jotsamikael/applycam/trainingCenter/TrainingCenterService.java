package com.jotsamikael.applycam.trainingCenter;

import com.jotsamikael.applycam.candidate.Candidate;
import com.jotsamikael.applycam.centerStatus.TrainingCenterHistoryRepository;
import com.jotsamikael.applycam.centerStatus.TrainingCenterStatusHistory;
import com.jotsamikael.applycam.common.ContentStatus;
import com.jotsamikael.applycam.common.FileStorageService;
import com.jotsamikael.applycam.common.PageResponse;
import com.jotsamikael.applycam.email.EmailService;
import com.jotsamikael.applycam.email.EmailTemplateName;
import com.jotsamikael.applycam.exception.OperationNotPermittedException;
import com.jotsamikael.applycam.promoter.Promoter;
import com.jotsamikael.applycam.promoter.PromoterRepository;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TrainingCenterService {
    private final TrainingCenterRepository trainingCenterRepository;
    private final PromoterRepository promoterRepository;
    private final TrainingCenterMapper mapper;
    private final FileStorageService fileStorageService;
    private final TrainingCenterHistoryRepository trainingCenterStatusHistoryRepository;
    private final EmailService emailService;
    private final TokenRepository tokenRepository;
    private final UserRepository userRepository;
    
    @Value("${application.mailing.frontend.activation-url}")
    String activationUrl;

    /**
     * Créer un nouveau centre de formation avec validation complète
     */
    @Transactional
    public String createTrainingCenter(@Valid CreateTainingCenterRequest request, Authentication connectedUser) {
        try {
            log.info("Début de création du centre de formation: {}", request.getFullName());
            
            User user = validateAndGetUser(connectedUser);
            
            // Validation des données
            validateTrainingCenterData(request);
            
            // Vérification que l'utilisateur connecté est un promoteur
            Promoter promoter = promoterRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non reconnu comme promoteur: " + user.getEmail()));
            
            // Vérification de l'unicité du numéro d'accord
            if(trainingCenterRepository.existsByAgreementNumber(request.getAgreementNumber())) {
                throw new DataIntegrityViolationException("Un centre avec ce numéro d'accord existe déjà");
            }
            
            // Création du centre de formation
            var trainingCenter = TrainingCenter.builder()
                    .fullName(request.getFullName())
                    .acronym(request.getAcronym())
                    .agreementNumber(request.getAgreementNumber())
                    .division(request.getDivision())
                    .fullAddress(request.getFullAddress())
                    .startDateOfAgreement(request.getStartDateOfAgreement())
                    .endDateOfAgreement(request.getEndDateOfAgreement())
                    .isCenterPresentCandidateForCqp(request.getIsCenterPresentCandidateForCqp())
                    .isCenterPresentCandidateForDqp(request.getIsCenterPresentCandidateForDqp())
                    .promoter(promoter)
                    .createdBy(user.getIdUser())
                    .createdDate(LocalDateTime.now())
                    .isActived(true)
                    .isArchived(false)
                    .build();

            trainingCenterRepository.save(trainingCenter);
            log.info("Centre de formation créé avec succès: {}", trainingCenter.getFullName());
            return trainingCenter.getFullName();
            
        } catch (DataIntegrityViolationException e) {
            log.error("Erreur de contrainte lors de la création: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.CONFLICT, 
                "Erreur de contrainte: " + e.getMessage());
        } catch (Exception e) {
            log.error("Erreur lors de la création du centre de formation: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la création: " + e.getMessage());
        }
    }

    /**
     * Récupérer un centre de formation par numéro d'accord
     */
    public TrainingCenterResponse getTrainingCenterByAgreementNumber(String agreementNumber) {
        try {
            log.info("Récupération du centre de formation par numéro d'accord: {}", agreementNumber);
            
            if (agreementNumber == null || agreementNumber.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le numéro d'accord est requis");
            }

            TrainingCenter trainingCenter = trainingCenterRepository.findByAgreementNumber(agreementNumber.trim())
                .orElseThrow(() -> new EntityNotFoundException("Aucun centre de formation trouvé pour le numéro d'accord: " + agreementNumber));

            return mapper.toTrainingResponse(trainingCenter);
            
        } catch (EntityNotFoundException e) {
            log.warn("Centre de formation non trouvé: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Erreur lors de la récupération: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la récupération du centre de formation");
        }
    }

    /**
     * Récupérer les centres de formation du promoteur connecté
     */
    public List<TrainingCenterResponse> getTrainingCenterOfConnectedPromoter(Authentication connectedUser) {
        try {
            log.info("Récupération des centres de formation du promoteur connecté");
            
            User user = validateAndGetUser(connectedUser);
            
            Promoter promoter = promoterRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non reconnu comme promoteur: " + user.getEmail()));

            List<TrainingCenter> trainingCenterList = trainingCenterRepository.findByPromoter(promoter)
                .orElseThrow(() -> new EntityNotFoundException("Aucun centre de formation trouvé pour: " + user.getEmail()));

            List<TrainingCenterResponse> responses = trainingCenterList.stream()
                .map(mapper::toTrainingResponse)
                .toList();

            return responses;
            
        } catch (EntityNotFoundException e) {
            log.warn("Centres de formation non trouvés: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Erreur lors de la récupération: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la récupération des centres de formation");
        }
    }

    /**
     * Récupérer tous les centres de formation avec pagination
     */
    public PageResponse<TrainingCenterResponse> getAllTrainingCenter(int offset, int pageSize, String field, boolean order) {
        try {
            log.info("Récupération des centres de formation - offset: {}, pageSize: {}", offset, pageSize);

            Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();

            Page<TrainingCenter> list = trainingCenterRepository.getAll(
                    PageRequest.of(offset, pageSize, sort));

            List<TrainingCenterResponse> responses = list.stream()
                .map(mapper::toTrainingResponse)
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
            log.error("Erreur lors de la récupération des centres de formation: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la récupération des centres de formation");
        }
    }

    /**
     * Télécharger un fichier d'accord avec gestion d'erreurs
     */
    @Transactional
    public void uploadAgreementFile(MultipartFile file, Authentication connectedUser, String agreementNumber, String fileType) {
        try {
            log.info("Téléchargement du fichier d'accord pour: {}", agreementNumber);
            
            User user = validateAndGetUser(connectedUser);
            
            // Vérification que l'utilisateur est un promoteur
            Promoter promoter = promoterRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non reconnu comme promoteur: " + user.getEmail()));

            TrainingCenter trainingCenter = trainingCenterRepository.findByAgreementNumber(agreementNumber)
                .orElseThrow(() -> new EntityNotFoundException("Centre de formation non trouvé pour le numéro d'accord: " + agreementNumber));
            
            // Vérification des droits (seul le promoteur propriétaire peut télécharger)
            if (!trainingCenter.getPromoter().getIdUser().equals(promoter.getIdUser())) {
                throw new OperationNotPermittedException("Vous ne pouvez pas télécharger des fichiers pour ce centre de formation");
            }
            
            var agreementFileUrl = fileStorageService.saveFile(file, promoter.getIdUser(), fileType);
            trainingCenter.setAgreementFileUrl(agreementFileUrl);
            trainingCenter.setLastModifiedBy(user.getIdUser());
            trainingCenter.setLastModifiedDate(LocalDateTime.now());
            
            trainingCenterRepository.save(trainingCenter);
            log.info("Fichier d'accord téléchargé avec succès: {}", agreementNumber);
            
        } catch (Exception e) {
            log.error("Erreur lors du téléchargement du fichier: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors du téléchargement: " + e.getMessage());
        }
    }

    /**
     * Obtenir le statut d'un accord
     */
    public String getAgreementStatus(String agreementNumber, Authentication connectedUser) {
        try {
            log.info("Vérification du statut d'accord: {}", agreementNumber);
            
            User user = validateAndGetUser(connectedUser);
            
            Promoter promoter = promoterRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non reconnu comme promoteur: " + user.getEmail()));

            TrainingCenter trainingCenter = trainingCenterRepository.findByAgreementNumber(agreementNumber)
                .orElseThrow(() -> new EntityNotFoundException("Centre de formation non trouvé pour le numéro d'accord: " + agreementNumber));
            
            // Vérification des droits
            if(!trainingCenter.getPromoter().getIdUser().equals(promoter.getIdUser())){
                throw new OperationNotPermittedException("Vous ne pouvez pas vérifier le statut d'accord d'autres centres");
            }

            // Mise à jour du statut
            if(trainingCenter.getEndDateOfAgreement().isAfter(LocalDate.now())){
                trainingCenter.setAgreementStatus(AgreementStatus.VALID);
            } else {
                trainingCenter.setAgreementStatus(AgreementStatus.EXPIRED);
            }
            
            trainingCenter.setLastModifiedBy(user.getIdUser());
            trainingCenter.setLastModifiedDate(LocalDateTime.now());
            trainingCenterRepository.save(trainingCenter);
            
            log.info("Statut d'accord vérifié: {}", trainingCenter.getAgreementStatus());
            return trainingCenter.getAgreementStatus().toString();
            
        } catch (Exception e) {
            log.error("Erreur lors de la vérification du statut: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la vérification du statut: " + e.getMessage());
        }
    }
    
    /**
     * Mettre à jour un centre de formation
     */
    @Transactional
    public String updateTrainingCenter(String agreementNumber, UpdateTrainingCenterRequest updateTrainingCenterRequest, Authentication connectedUser) {
        try {
            log.info("Mise à jour du centre de formation: {}", agreementNumber);
            
            User user = validateAndGetUser(connectedUser);
            
            TrainingCenter trainingCenter = trainingCenterRepository.findByAgreementNumber(agreementNumber)
                .orElseThrow(() -> new EntityNotFoundException("Centre de formation inexistant"));
            
            // Vérification que le centre peut être mis à jour
            if (!trainingCenter.isActived()) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                    "Ce centre de formation ne peut pas être mis à jour car il a été supprimé");
            }
            
            // Validation des données
            validateTrainingCenterUpdateData(updateTrainingCenterRequest);
            
            trainingCenter.setFullName(updateTrainingCenterRequest.getFullName());
            trainingCenter.setAcronym(updateTrainingCenterRequest.getAcronym());
            trainingCenter.setAgreementNumber(updateTrainingCenterRequest.getAgreementNumber());
            trainingCenter.setStartDateOfAgreement(updateTrainingCenterRequest.getStartDateOfAgreement());
            trainingCenter.setEndDateOfAgreement(updateTrainingCenterRequest.getEndDateOfAgreement());
            trainingCenter.setDivision(updateTrainingCenterRequest.getDivision());
            trainingCenter.setFullAddress(updateTrainingCenterRequest.getFullAddress());
            trainingCenter.setIsCenterPresentCandidateForCqp(updateTrainingCenterRequest.isCenterPresentCandidateForCqp());
            trainingCenter.setIsCenterPresentCandidateForDqp(updateTrainingCenterRequest.isCenterPresentCandidateForCqp());
            trainingCenter.setLastModifiedBy(user.getIdUser());
            trainingCenter.setLastModifiedDate(LocalDateTime.now());
            
            trainingCenterRepository.save(trainingCenter);
            log.info("Centre de formation mis à jour avec succès: {}", agreementNumber);
            return trainingCenter.getAgreementNumber();
            
        } catch (Exception e) {
            log.error("Erreur lors de la mise à jour: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la mise à jour: " + e.getMessage());
        }
    }
    
    /**
     * Valider un centre de formation
     */
    @Transactional
    public String validateTrainingCenter(String agreementNumber, Authentication connectedUser) {
        try {
            log.info("Validation du centre de formation: {}", agreementNumber);
            
            User user = validateAndGetUser(connectedUser);
            
            TrainingCenter trainingCenter = trainingCenterRepository
                .findByAgreementNumber(agreementNumber)
                .orElseThrow(() -> new EntityNotFoundException("Centre de formation non trouvé: " + agreementNumber));

            Optional<TrainingCenterStatusHistory> optionalHistory = trainingCenterStatusHistoryRepository.findByTrainingCenter(trainingCenter);
            TrainingCenterStatusHistory statusHistory;

            if (optionalHistory.isPresent()) {
                statusHistory = optionalHistory.get();
            } else {
                statusHistory = new TrainingCenterStatusHistory();
                statusHistory.setTrainingCenter(trainingCenter);
                statusHistory.setCreatedBy(user.getIdUser());
                statusHistory.setCreatedDate(LocalDateTime.now());
            }
            
            statusHistory.setStatus(ContentStatus.VALIDATED);
            statusHistory.setActived(true);
            statusHistory.setLastModifiedBy(user.getIdUser());
            statusHistory.setLastModifiedDate(LocalDateTime.now());
            trainingCenterStatusHistoryRepository.save(statusHistory);

            try {
                User promoter = trainingCenter.getPromoter();
                promoter.setEnabled(true);
                userRepository.save(promoter);
                
                emailService.sendTemplateEmail(
                        promoter.getEmail(),
                        promoter.fullName(),
                        trainingCenter.getFullName(),
                        "trainingcenter-validation",
                        "Votre centre a été validé avec succès"
                );

            } catch (MessagingException e) {
                log.error("Erreur lors de l'envoi d'email: {}", e.getMessage(), e);
                throw new RuntimeException("Échec d'envoi d'email", e);
            }

            log.info("Centre de formation validé avec succès: {}", agreementNumber);
            return "VALIDATED";
            
        } catch (Exception e) {
            log.error("Erreur lors de la validation: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la validation: " + e.getMessage());
        }
    }
    
    /**
     * Changer le statut d'un centre de formation
     */
    @Transactional
    public String changeTrainingCenterStatus(String agreementNumber, ContentStatus status, String comment, Authentication connectedUser) {
        try {
            log.info("Changement de statut du centre de formation: {} vers {}", agreementNumber, status);
            
            User user = validateAndGetUser(connectedUser);
            
            TrainingCenter trainingCenter = trainingCenterRepository
                .findByAgreementNumber(agreementNumber)
                .orElseThrow(() -> new EntityNotFoundException("Centre de formation non trouvé: " + agreementNumber));

            Optional<TrainingCenterStatusHistory> optionalHistory = trainingCenterStatusHistoryRepository.findByTrainingCenter(trainingCenter);
            TrainingCenterStatusHistory statusHistory;

            if (optionalHistory.isPresent()) {
                statusHistory = optionalHistory.get();
            } else {
                statusHistory = new TrainingCenterStatusHistory();
                statusHistory.setTrainingCenter(trainingCenter);
                statusHistory.setCreatedBy(user.getIdUser());
                statusHistory.setCreatedDate(LocalDateTime.now());
            }
            
            statusHistory.setStatus(status);
            statusHistory.setComment(comment);
            statusHistory.setActived(true);
            statusHistory.setLastModifiedBy(user.getIdUser());
            statusHistory.setLastModifiedDate(LocalDateTime.now());
            trainingCenterStatusHistoryRepository.save(statusHistory);

            log.info("Statut du centre de formation changé avec succès: {}", agreementNumber);
            return status.toString();
            
        } catch (Exception e) {
            log.error("Erreur lors du changement de statut: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors du changement de statut: " + e.getMessage());
        }
    }

    /**
     * Désactiver/réactiver un centre de formation
     */
    @Transactional
    public void deleteTrainingCenter(String agreementNumber, Authentication connectedUser) {
        try {
            log.info("Changement de statut du centre de formation: {}", agreementNumber);
            
            User user = validateAndGetUser(connectedUser);
            TrainingCenter trainingCenter = validateAndGetTrainingCenter(agreementNumber);
            
            if (trainingCenter.isActived()) {
                trainingCenter.setActived(false);
                trainingCenter.setArchived(true);
                log.info("Centre de formation désactivé: {}", agreementNumber);
            } else {
                trainingCenter.setActived(true);
                trainingCenter.setArchived(false);
                log.info("Centre de formation réactivé: {}", agreementNumber);
            }
            
            trainingCenter.setLastModifiedBy(user.getIdUser());
            trainingCenter.setLastModifiedDate(LocalDateTime.now());
            trainingCenterRepository.save(trainingCenter);
            
        } catch (Exception e) {
            log.error("Erreur lors du changement de statut: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors du changement de statut: " + e.getMessage());
        }
    }

    /**
     * Supprimer définitivement un centre de formation
     */
    @Transactional
    public void deleteTrainingCenterPermanently(String agreementNumber, Authentication connectedUser) {
        try {
            log.info("Suppression définitive du centre de formation: {}", agreementNumber);
            
            User user = validateAndGetUser(connectedUser);
            TrainingCenter trainingCenter = validateAndGetTrainingCenter(agreementNumber);
            
            // Vérification des droits (seul le STAFF peut supprimer définitivement)
            boolean isStaff = user.getRoles().stream()
                .anyMatch(role -> "STAFF".equals(role.getName()));
            
            if (!isStaff) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                    "Seuls les membres du staff peuvent supprimer définitivement un centre de formation");
            }
            
            trainingCenterRepository.delete(trainingCenter);
            log.info("Centre de formation supprimé définitivement: {}", agreementNumber);
            
        } catch (Exception e) {
            log.error("Erreur lors de la suppression définitive: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la suppression: " + e.getMessage());
        }
    }

    /**
     * Désactiver un centre de formation (soft delete)
     */
    @Transactional
    public void deactivateTrainingCenter(String agreementNumber, Authentication connectedUser) {
        try {
            log.info("Désactivation du centre de formation: {}", agreementNumber);
            
            User user = validateAndGetUser(connectedUser);
            TrainingCenter trainingCenter = validateAndGetTrainingCenter(agreementNumber);
            
            // Vérification des droits
            boolean isStaff = user.getRoles().stream()
                .anyMatch(role -> "STAFF".equals(role.getName()));
            
            if (!isStaff) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                    "Seuls les membres du staff peuvent désactiver un centre de formation");
            }
            
            trainingCenter.setActived(false);
            trainingCenter.setArchived(true);
            trainingCenter.setLastModifiedBy(user.getIdUser());
            trainingCenter.setLastModifiedDate(LocalDateTime.now());
            
            trainingCenterRepository.save(trainingCenter);
            log.info("Centre de formation désactivé avec succès: {}", agreementNumber);
            
        } catch (Exception e) {
            log.error("Erreur lors de la désactivation: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la désactivation: " + e.getMessage());
        }
    }

    /**
     * Réactiver un centre de formation
     */
    @Transactional
    public void reactivateTrainingCenter(String agreementNumber, Authentication connectedUser) {
        try {
            log.info("Réactivation du centre de formation: {}", agreementNumber);
            
            User user = validateAndGetUser(connectedUser);
            TrainingCenter trainingCenter = validateAndGetTrainingCenter(agreementNumber);
            
            // Vérification des droits (seul le STAFF peut réactiver)
            boolean isStaff = user.getRoles().stream()
                .anyMatch(role -> "STAFF".equals(role.getName()));
            
            if (!isStaff) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                    "Seuls les membres du staff peuvent réactiver un centre de formation");
            }
            
            trainingCenter.setActived(true);
            trainingCenter.setArchived(false);
            trainingCenter.setLastModifiedBy(user.getIdUser());
            trainingCenter.setLastModifiedDate(LocalDateTime.now());
            
            trainingCenterRepository.save(trainingCenter);
            log.info("Centre de formation réactivé avec succès: {}", agreementNumber);
            
        } catch (Exception e) {
            log.error("Erreur lors de la réactivation: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la réactivation: " + e.getMessage());
        }
    }

    /**
     * Récupérer des statistiques sur les centres de formation
     */
    public Map<String, Object> getTrainingCenterStatistics() {
        try {
            log.info("Récupération des statistiques des centres de formation");
            
            long totalCenters = trainingCenterRepository.count();
            long activeCenters = trainingCenterRepository.countByIsActivedTrue();
            long inactiveCenters = trainingCenterRepository.countByIsActivedFalse();
            long validAgreements = trainingCenterRepository.countByAgreementStatus(AgreementStatus.VALID);
            long expiredAgreements = trainingCenterRepository.countByAgreementStatus(AgreementStatus.EXPIRED);
            
            Map<String, Object> statistics = new HashMap<>();
            statistics.put("totalCenters", totalCenters);
            statistics.put("activeCenters", activeCenters);
            statistics.put("inactiveCenters", inactiveCenters);
            statistics.put("validAgreements", validAgreements);
            statistics.put("expiredAgreements", expiredAgreements);
            statistics.put("activationRate", totalCenters > 0 ? (double) activeCenters / totalCenters * 100 : 0);
            statistics.put("validAgreementRate", totalCenters > 0 ? (double) validAgreements / totalCenters * 100 : 0);
            
            return statistics;
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des statistiques: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la récupération des statistiques");
        }
    }

    // ==================== MÉTHODES PRIVÉES D'AIDE ====================
    
    private User validateAndGetUser(Authentication connectedUser) {
        if (connectedUser == null || connectedUser.getPrincipal() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur non authentifié");
        }
        return (User) connectedUser.getPrincipal();
    }
    
    private TrainingCenter validateAndGetTrainingCenter(String agreementNumber) {
        return trainingCenterRepository.findByAgreementNumber(agreementNumber)
            .orElseThrow(() -> new EntityNotFoundException("Centre de formation non trouvé avec le numéro d'accord: " + agreementNumber));
    }
    
    private void validateTrainingCenterData(CreateTainingCenterRequest request) {
        if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le nom complet est requis");
        }
        if (request.getAgreementNumber() == null || request.getAgreementNumber().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le numéro d'accord est requis");
        }
        if (request.getStartDateOfAgreement() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La date de début d'accord est requise");
        }
        if (request.getEndDateOfAgreement() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La date de fin d'accord est requise");
        }
        if (request.getStartDateOfAgreement().isAfter(request.getEndDateOfAgreement())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La date de début doit être antérieure à la date de fin");
        }
    }
    
    private void validateTrainingCenterUpdateData(UpdateTrainingCenterRequest request) {
        if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le nom complet est requis");
        }
        if (request.getAgreementNumber() == null || request.getAgreementNumber().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le numéro d'accord est requis");
        }
        if (request.getStartDateOfAgreement() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La date de début d'accord est requise");
        }
        if (request.getEndDateOfAgreement() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La date de fin d'accord est requise");
        }
        if (request.getStartDateOfAgreement().isAfter(request.getEndDateOfAgreement())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La date de début doit être antérieure à la date de fin");
        }
    }

    private void sendValidationEmail(User user) throws MessagingException {
        var newToken = generateAndSaveActivationToken(user);
        emailService.sendEmail(
                user.getEmail(),
                user.fullName(),
                EmailTemplateName.ACTIVATE_ACCOUNT,
                activationUrl,
                newToken,
                "Account activation"
        );
    }

    private String generateAndSaveActivationToken(User user) {
        String generatedToken = generateActivationCode(6);
        var token = Token.builder()
                .token(generatedToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .user(user)
                .build();
        tokenRepository.save(token);
        return generatedToken;
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
}

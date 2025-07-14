package com.jotsamikael.applycam.application;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.jotsamikael.applycam.candidate.Candidate;
import com.jotsamikael.applycam.candidate.CandidateRepository;
import com.jotsamikael.applycam.common.ContentStatus;
import com.jotsamikael.applycam.common.FileStorageService;
import com.jotsamikael.applycam.common.PageResponse;
import com.jotsamikael.applycam.course.Course;
import com.jotsamikael.applycam.course.CourseRepository;
import com.jotsamikael.applycam.email.EmailService;
import com.jotsamikael.applycam.email.EmailTemplateName;
import com.jotsamikael.applycam.examCenter.ExamCenter;
import com.jotsamikael.applycam.examCenter.ExamService;
import com.jotsamikael.applycam.payment.Payment;
import com.jotsamikael.applycam.payment.PaymentRepository;
import com.jotsamikael.applycam.session.Session;
import com.jotsamikael.applycam.session.SessionRepository;
import com.jotsamikael.applycam.speciality.Speciality;
import com.jotsamikael.applycam.speciality.SpecialityRepository;
import com.jotsamikael.applycam.staff.Staff;
import com.jotsamikael.applycam.staff.StaffRepository;
import com.jotsamikael.applycam.trainingCenter.TrainingCenter;
import com.jotsamikael.applycam.trainingCenter.TrainingCenterRepository;
import com.jotsamikael.applycam.user.User;
import com.jotsamikael.applycam.user.UserRepository;

import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ApplicationService {

    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;
    private final SpecialityRepository specialityRepository;
    private final ApplicationRepository applicationRepository;
    private final SessionRepository sessionRepository;
    private final TrainingCenterRepository trainingCenterRepository;
    private final PaymentRepository paymentRepository;
    private final FileStorageService fileStorageService;
    private final StaffRepository staffRepository;
    private final EmailService emailService;
    private final ExamService examService;
    private final ApplicationMapper mapper;
    private final CourseRepository courseRepository;

    /**
     * Créer une nouvelle candidature avec validation complète
     */
    @Transactional
    public void applyPersonalInfo(ApplicationRequest request, Authentication connectedUser) {
        try {
            log.info("Début de création de candidature pour l'utilisateur: {}", connectedUser.getName());
            
            User user = validateAndGetUser(connectedUser);
            Candidate candidate = validateAndGetCandidate(user.getEmail());
            
            // Mise à jour des informations du candidat
            updateCandidateInfo(candidate, request);
            candidateRepository.save(candidate);
            
            // Validation de la session
            String currentYear = String.valueOf(LocalDate.now().getYear());
            validateSessionYear(request.getSessionYear(), currentYear);
            
            // Récupération et validation des entités
            Session session = validateAndGetSession(request.getSessionYear(), request.getExamType());
            TrainingCenter trainingCenter = validateAndGetTrainingCenter(request.getTrainingCenterAcronym());
            validateCandidateTrainingCenter(candidate, trainingCenter);
            
            // Gestion spécialité/cours selon le type d'examen
            Speciality speciality = null;
            Course course = null;
            double expectedPrice = calculateExpectedPrice(request, currentYear, speciality, course);
            
            // Validation du montant
            validateAmount(request.getAmount(), expectedPrice);
            
            // Création du paiement
            Payment payment = createPayment(request, user);
            paymentRepository.save(payment);
            
            // Création de la candidature
            Application application = createApplication(request, candidate, session, payment, speciality);
            applicationRepository.save(application);
            
            log.info("Candidature créée avec succès pour le candidat: {}", candidate.getEmail());
            
        } catch (Exception e) {
            log.error("Erreur lors de la création de la candidature: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la création de la candidature: " + e.getMessage());
        }
    }
    
    /**
     * Upload des fichiers du candidat avec gestion d'erreurs améliorée
     */
    @Transactional
    public void uploadCandidateFile(MultipartFile cniFile, Authentication connectedUser,
            MultipartFile birthCertificate, MultipartFile diplomFile, MultipartFile photo,
            MultipartFile oldApplyanceFile, MultipartFile stageCertificate, MultipartFile cv,
            MultipartFile financialJustification, MultipartFile letter) {
        
        try {
            log.info("Début de l'upload des fichiers pour l'utilisateur: {}", connectedUser.getName());
            
            User user = validateAndGetUser(connectedUser);
            Candidate candidate = validateAndGetCandidate(user.getEmail());
            
            // Upload de tous les fichiers
            uploadFileIfPresent(candidate, cniFile, "CNI");
            uploadFileIfPresent(candidate, birthCertificate, "BIRTHCERTIFICATE");
            uploadFileIfPresent(candidate, diplomFile, "DIPLOM");
            uploadFileIfPresent(candidate, photo, "PHOTO");
            uploadFileIfPresent(candidate, oldApplyanceFile, "OLD");
            uploadFileIfPresent(candidate, stageCertificate, "CERTIFICATE");
            uploadFileIfPresent(candidate, cv, "CV");
            uploadFileIfPresent(candidate, financialJustification, "FINANCIAL");
            uploadFileIfPresent(candidate, letter, "LETTER");
            
            candidateRepository.save(candidate);
            log.info("Upload des fichiers terminé avec succès pour le candidat: {}", candidate.getEmail());
            
        } catch (Exception e) {
            log.error("Erreur lors de l'upload des fichiers: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de l'upload des fichiers: " + e.getMessage());
        }
    }
    
    /**
     * Valider une candidature avec assignation de centre d'examen
     */
    @Transactional
    public String validateApplication(Authentication connectedUser, Long id) throws MessagingException {
        try {
            log.info("Début de validation de la candidature ID: {}", id);
            
            User user = validateAndGetUser(connectedUser);
            Staff staff = validateAndGetStaff(user.getEmail());
            Application application = validateAndGetApplication(id);
            
            // Validation que la candidature n'est pas déjà validée
            if (ContentStatus.VALIDATED.equals(application.getStatus())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                    "Cette candidature est déjà validée");
            }
            
            Candidate candidate = application.getCandidate();
            
            // Assignation du centre d'examen
            examService.assignRandomExamCenterToCandidate(candidate.getEmail());
            
            // Mise à jour du statut
            application.setActived(true);
            application.setStatus(ContentStatus.VALIDATED);
            applicationRepository.save(application);
            
            // Envoi de l'email de validation
            ExamCenter examCenter = candidate.getExamCenter();
            Session session = application.getSession();
            sendApplicationValidationEmail(candidate, examCenter, session);
            
            log.info("Candidature validée avec succès ID: {}", id);
            return "Candidature validée avec succès";
            
        } catch (MessagingException e) {
            log.error("Erreur lors de l'envoi de l'email de validation: {}", e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            log.error("Erreur lors de la validation de la candidature: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la validation: " + e.getMessage());
        }
    }
    
    /**
     * Rejeter une candidature avec commentaire
     */
    @Transactional
    public String rejectApplication(Authentication connectedUser, Long id, String comment) throws MessagingException {
        try {
            log.info("Début de rejet de la candidature ID: {} avec commentaire: {}", id, comment);
            
            User user = validateAndGetUser(connectedUser);
            Staff staff = validateAndGetStaff(user.getEmail());
            Application application = validateAndGetApplication(id);
            
            // Validation que la candidature n'est pas déjà rejetée
            if (ContentStatus.REJECTED.equals(application.getStatus())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                    "Cette candidature est déjà rejetée");
            }
            
            // Validation du commentaire
            if (comment == null || comment.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                    "Un commentaire est requis pour rejeter une candidature");
            }
            
            // Mise à jour du statut
            application.setActived(false);
            application.setStatus(ContentStatus.REJECTED);
            applicationRepository.save(application);
            
            // Envoi de l'email de rejet
            Candidate candidate = application.getCandidate();
            sendApplicationRejectionEmail(candidate, comment);
            
            log.info("Candidature rejetée avec succès ID: {}", id);
            return "Candidature rejetée et email envoyé avec succès";
            
        } catch (MessagingException e) {
            log.error("Erreur lors de l'envoi de l'email de rejet: {}", e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            log.error("Erreur lors du rejet de la candidature: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors du rejet: " + e.getMessage());
        }
    }
    
    /**
     * Supprimer définitivement une candidature (DELETE mapping)
     */
    @Transactional
    public void deleteApplicationPermanently(Long applicationId, Authentication connectedUser) {
        try {
            log.info("Début de suppression définitive de la candidature ID: {}", applicationId);
            
            User user = validateAndGetUser(connectedUser);
            Application application = validateAndGetApplication(applicationId);
            
            // Vérification des droits (seul le STAFF peut supprimer définitivement)
            boolean isStaff = user.getRoles().stream()
                .anyMatch(role -> "STAFF".equals(role.getName()));
            
            if (!isStaff) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                    "Seuls les membres du staff peuvent supprimer définitivement une candidature");
            }
            
            // Suppression du paiement associé
            if (application.getPayment() != null) {
                paymentRepository.delete(application.getPayment());
            }
            
            // Suppression de la candidature
            applicationRepository.delete(application);
            
            log.info("Candidature supprimée définitivement ID: {}", applicationId);
            
        } catch (Exception e) {
            log.error("Erreur lors de la suppression définitive: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la suppression: " + e.getMessage());
        }
    }
    
    /**
     * Désactiver une candidature (soft delete)
     */
    @Transactional
    public void deactivateApplication(Long applicationId, Authentication connectedUser) {
        try {
            log.info("Début de désactivation de la candidature ID: {}", applicationId);
            
            User user = validateAndGetUser(connectedUser);
            Application application = validateAndGetApplication(applicationId);
            
            // Vérification des droits (admin ou le candidat lui-même)
            boolean isStaff = user.getRoles().stream()
                .anyMatch(role -> "STAFF".equals(role.getName()));
            
            if (!isStaff && !application.getCandidate().getEmail().equals(user.getEmail())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                    "Vous ne pouvez pas désactiver cette candidature");
            }
            
            // Désactivation
            application.setActived(false);
            application.setStatus(ContentStatus.DRAFT);
            applicationRepository.save(application);
            
            log.info("Candidature désactivée avec succès ID: {}", applicationId);
            
        } catch (Exception e) {
            log.error("Erreur lors de la désactivation: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la désactivation: " + e.getMessage());
        }
    }
    
    /**
     * Réactiver une candidature
     */
    @Transactional
    public void reactivateApplication(Long applicationId, Authentication connectedUser) {
        try {
            log.info("Début de réactivation de la candidature ID: {}", applicationId);
            
            User user = validateAndGetUser(connectedUser);
            Application application = validateAndGetApplication(applicationId);
            
            // Vérification des droits (seul le STAFF peut réactiver)
            boolean isStaff = user.getRoles().stream()
                .anyMatch(role -> "STAFF".equals(role.getName()));
            
            if (!isStaff) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                    "Seuls les membres du staff peuvent réactiver une candidature");
            }
            
            // Réactivation
            application.setActived(true);
            application.setStatus(ContentStatus.PENDING);
            applicationRepository.save(application);
            
            log.info("Candidature réactivée avec succès ID: {}", applicationId);
            
        } catch (Exception e) {
            log.error("Erreur lors de la réactivation: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la réactivation: " + e.getMessage());
        }
    }
    
    /**
     * Récupérer toutes les candidatures avec pagination
     */
    public PageResponse<ApplicationResponse> getAllApplications(int offset, int pageSize, String field, boolean order) {
        try {
            log.info("Début getAllApplications - offset: {}, pageSize: {}, field: {}, order: {}", offset, pageSize, field, order);
            
            Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();
            Page<Application> applications = applicationRepository.getAllApplications(PageRequest.of(offset, pageSize, sort));
            
            log.info("Applications récupérées depuis la base: {} éléments", applications.getTotalElements());
            log.info("Applications dans la page courante: {} éléments", applications.getContent().size());
            
            // Log des détails des applications pour debug
            applications.getContent().forEach(app -> {
                log.info("Application ID: {}, isActived: {}, status: {}, candidate: {}", 
                    app.getId(), app.isActived(), app.getStatus(), 
                    app.getCandidate() != null ? app.getCandidate().getEmail() : "null");
            });
            
            List<ApplicationResponse> content = applications.stream()
                .map(mapper::toApplicationResponse)
                .filter(response -> response != null)
                .toList();
            
            log.info("Applications mappées vers ApplicationResponse: {} éléments", content.size());
            
            return new PageResponse<>(
                content,
                applications.getNumber(),
                applications.getSize(),
                applications.getTotalElements(),
                applications.getTotalPages(),
                applications.isFirst(),
                applications.isLast()
            );
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des candidatures: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la récupération des candidatures");
        }
    }
    
    /**
     * Méthode temporaire pour debug - récupère toutes les candidatures sans filtre isActived
     */
    public PageResponse<ApplicationResponse> getAllApplicationsDebug(int offset, int pageSize, String field, boolean order) {
        try {
            log.info("Début getAllApplicationsDebug - offset: {}, pageSize: {}, field: {}, order: {}", offset, pageSize, field, order);
            
            Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();
            Page<Application> applications = applicationRepository.getAllApplicationsDebug(PageRequest.of(offset, pageSize, sort));
            
            log.info("DEBUG - Applications récupérées depuis la base (sans filtre isActived): {} éléments", applications.getTotalElements());
            log.info("DEBUG - Applications dans la page courante: {} éléments", applications.getContent().size());
            
            // Log des détails des applications pour debug
            applications.getContent().forEach(app -> {
                log.info("DEBUG - Application ID: {}, isActived: {}, status: {}, candidate: {}", 
                    app.getId(), app.isActived(), app.getStatus(), 
                    app.getCandidate() != null ? app.getCandidate().getEmail() : "null");
            });
            
            List<ApplicationResponse> content = applications.stream()
                .map(mapper::toApplicationResponse)
                .filter(response -> response != null)
                .toList();
            
            log.info("DEBUG - Applications mappées vers ApplicationResponse: {} éléments", content.size());
            
            return new PageResponse<>(
                content,
                applications.getNumber(),
                applications.getSize(),
                applications.getTotalElements(),
                applications.getTotalPages(),
                applications.isFirst(),
                applications.isLast()
            );
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des candidatures (debug): {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la récupération des candidatures (debug)");
        }
    }
    
    /**
     * Récupérer toutes les candidatures (actives et inactives) avec pagination
     */
    public PageResponse<ApplicationResponse> getAllApplicationsIncludingInactive(int offset, int pageSize, String field, boolean order) {
        try {
            log.info("Début getAllApplicationsIncludingInactive - offset: {}, pageSize: {}, field: {}, order: {}", offset, pageSize, field, order);
            
            Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();
            Page<Application> applications = applicationRepository.getAllApplicationsIncludingInactive(PageRequest.of(offset, pageSize, sort));
            
            log.info("Applications récupérées (incluant inactives): {} éléments", applications.getTotalElements());
            
            List<ApplicationResponse> content = applications.stream()
                .map(mapper::toApplicationResponse)
                .filter(response -> response != null)
                .toList();
            
            return new PageResponse<>(
                content,
                applications.getNumber(),
                applications.getSize(),
                applications.getTotalElements(),
                applications.getTotalPages(),
                applications.isFirst(),
                applications.isLast()
            );
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des candidatures (incluant inactives): {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la récupération des candidatures (incluant inactives)");
        }
    }
    
    /**
     * Récupérer toutes les candidatures de l'utilisateur connecté (actives et inactives) avec pagination
     */
    public PageResponse<ApplicationResponse> getMyApplicationsIncludingInactive(Authentication connectedUser, int offset, int pageSize, String field, boolean order) {
        try {
            log.info("Début getMyApplicationsIncludingInactive pour l'utilisateur: {}", connectedUser.getName());
            
            User user = validateAndGetUser(connectedUser);
            Candidate candidate = validateAndGetCandidate(user.getEmail());
            
            Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();
            Page<Application> applications = applicationRepository.findByCandidateIncludingInactive(candidate, PageRequest.of(offset, pageSize, sort));
            
            log.info("Applications de l'utilisateur récupérées (incluant inactives): {} éléments", applications.getTotalElements());
            
            List<ApplicationResponse> content = applications.stream()
                .map(mapper::toApplicationResponse)
                .filter(response -> response != null)
                .toList();
            
            return new PageResponse<>(
                content,
                applications.getNumber(),
                applications.getSize(),
                applications.getTotalElements(),
                applications.getTotalPages(),
                applications.isFirst(),
                applications.isLast()
            );
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des candidatures de l'utilisateur (incluant inactives): {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la récupération des candidatures de l'utilisateur (incluant inactives)");
        }
    }
    
    /**
     * Récupérer les candidatures avec filtres
     */
    public PageResponse<ApplicationResponse> getAllApplicationsWithFilters(
            int offset, int pageSize, String field, boolean order,
            ContentStatus status, String examType, String region, String year) {
        
        try {
            Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();
            Page<Application> applications = applicationRepository.getAllApplicationsWithFilters(
                status, examType, region, year, PageRequest.of(offset, pageSize, sort));
            
            List<ApplicationResponse> content = applications.stream()
                .map(mapper::toApplicationResponse)
                .filter(response -> response != null)
                .toList();
            
            return new PageResponse<>(
                content,
                applications.getNumber(),
                applications.getSize(),
                applications.getTotalElements(),
                applications.getTotalPages(),
                applications.isFirst(),
                applications.isLast()
            );
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des candidatures filtrées: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la récupération des candidatures filtrées");
        }
    }
    
    /**
     * Rechercher les candidatures par nom de candidat
     */
    public List<ApplicationResponse> findApplicationsByCandidateName(String name) {
        try {
            if (name == null || name.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le nom du candidat est requis");
            }
            
            List<Application> applications = applicationRepository.findByCandidateNameContainingIgnoreCase(name.trim());
            
            return applications.stream()
                .map(mapper::toApplicationResponse)
                .filter(response -> response != null)
                .toList();
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            log.error("Erreur lors de la recherche par nom: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la recherche par nom");
        }
    }
    
    /**
     * Récupérer les candidatures du candidat connecté
     */
    public List<ApplicationResponse> findApplicationsOfConnectedCandidate(Authentication connectedUser) {
        try {
            User user = validateAndGetUser(connectedUser);
            Candidate candidate = validateAndGetCandidate(user.getEmail());
            
            List<Application> applications = applicationRepository.findByCandidate(candidate)
                .orElse(List.of());
            
            return applications.stream()
                .map(mapper::toApplicationResponse)
                .filter(response -> response != null)
                .toList();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des candidatures du candidat connecté: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la récupération des candidatures");
        }
    }
    
    /**
     * Récupérer une candidature par ID
     */
    public ApplicationResponse getApplicationById(Long applicationId) {
        try {
            Application application = validateAndGetApplication(applicationId);
            return mapper.toApplicationResponse(application);
        } catch (Exception e) {
            log.error("Erreur lors de la récupération de la candidature ID {}: {}", applicationId, e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la récupération de la candidature");
        }
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
    
    private Staff validateAndGetStaff(String email) {
        return staffRepository.findByEmail(email)
            .orElseThrow(() -> new EntityNotFoundException("Staff non trouvé pour l'email: " + email));
    }
    
    private Application validateAndGetApplication(Long id) {
        return applicationRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Candidature non trouvée avec l'ID: " + id));
    }
    
    private void updateCandidateInfo(Candidate candidate, ApplicationRequest request) {
        candidate.setSex(request.getSex());
        candidate.setDateOfBirth(LocalDate.parse(request.getDateOfBirth()));
        candidate.setPlaceOfBirth(request.getPlaceOfBirth());
        candidate.setNationality(request.getNationality());
        candidate.setRegionOrigins(request.getRegionOrigins());
        candidate.setDepartmentOfOrigin(request.getDepartmentOfOrigin());
        candidate.setMatrimonialSituation(request.getMatrimonialSituation());
        candidate.setNumberOfKid(request.getNumberOfKid());
        candidate.setLearningLanguage(request.getLearningLanguage());
        candidate.setFreeCandidate(request.getFreeCandidate());
        candidate.setRepeatCandidate(request.getRepeatCandidate());
        candidate.setFormationMode(request.getFormationMode());
        candidate.setFinancialRessource(request.getFinancialRessource());
        candidate.setHighestSchoolLevel(request.getAcademicLevel());
    }
    
    private void validateSessionYear(String sessionYear, String currentYear) {
        if (!sessionYear.equals(currentYear)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                "Vous ne pouvez vous inscrire que pour la session de l'année en cours");
        }
    }
    
    private Session validateAndGetSession(String sessionYear, String examType) {
        return sessionRepository.findBySessionYearAndExamType(sessionYear, examType)
            .orElseThrow(() -> new EntityNotFoundException("Aucune session trouvée pour cette année et ce type d'examen"));
    }
    
    private TrainingCenter validateAndGetTrainingCenter(String acronym) {
        return trainingCenterRepository.findByAcronym(acronym)
            .orElseThrow(() -> new EntityNotFoundException("Centre de formation non trouvé"));
    }
    
    private void validateCandidateTrainingCenter(Candidate candidate, TrainingCenter trainingCenter) {
        TrainingCenter candidateTrainingCenter = trainingCenterRepository.findByCandidateId(candidate.getIdUser())
            .orElseThrow(() -> new EntityNotFoundException("Vous n'êtes pas candidat de ce centre de formation"));
        
        if (!trainingCenter.getFullName().equals(candidateTrainingCenter.getFullName())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                "Vous n'êtes pas candidat de ce centre de formation");
        }
    }
    
    private double calculateExpectedPrice(ApplicationRequest request, String currentYear, 
            Speciality speciality, Course course) {
        
        if ("DQP".equalsIgnoreCase(request.getExamType())) {
            if (request.getSpeciality() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La spécialité est requise pour DQP");
            }
            
            speciality = specialityRepository.findByName(request.getSpeciality())
                .orElseThrow(() -> new EntityNotFoundException("Spécialité non trouvée"));
            
            if (!speciality.getSession().getSessionYear().equals(currentYear)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                    "La spécialité n'appartient pas à la session en cours");
            }
            
            return speciality.getDqpPrice();
        } else if ("CQP".equalsIgnoreCase(request.getExamType())) {
            if (request.getCourseName() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le cours est requis pour CQP");
            }
            
            course = courseRepository.findByName(request.getCourseName())
                .orElseThrow(() -> new EntityNotFoundException("Cours non trouvé"));
            
            if (!course.getSession().getSessionYear().equals(currentYear)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                    "Le cours n'appartient pas à la session en cours");
            }
            
            return course.getPriceForCqp();
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "Type d'examen invalide. Doit être DQP ou CQP");
        }
    }
    
    private void validateAmount(Double amount, double expectedPrice) {
        if (Double.compare(expectedPrice, amount) != 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Montant incorrect. Attendu: " + expectedPrice);
        }
    }
    
    private Payment createPayment(ApplicationRequest request, User user) {
        return Payment.builder()
            .amount(request.getAmount())
            .paymentMethod(request.getPaymentMethod())
            .secretCode(request.getSecretCode())
            .createdBy(user.getIdUser())
            .createdDate(LocalDateTime.now())
            .isActived(true)
            .build();
    }
    
    private Application createApplication(ApplicationRequest request, Candidate candidate, 
            Session session, Payment payment, Speciality speciality) {
        return Application.builder()
            .speciality(speciality)
            .candidate(candidate)
            .session(session)
            .applicationRegion(request.getApplicationRegion())
            .applicationYear(session.getSessionYear())
            .payment(payment)
            .status(ContentStatus.PAID)
            .build();
    }
    
    private void uploadFileIfPresent(Candidate candidate, MultipartFile file, String fileType) {
        if (file != null && !file.isEmpty()) {
            try {
                String url = fileStorageService.saveFile(file, candidate.getIdUser(), fileType);
                updateCandidateFileUrl(candidate, fileType, url);
            } catch (Exception e) {
                log.error("Erreur lors de l'upload du fichier {}: {}", fileType, e.getMessage(), e);
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                    "Erreur lors de l'upload du fichier " + fileType);
            }
        }
    }
    
    private void updateCandidateFileUrl(Candidate candidate, String fileType, String url) {
        switch (fileType) {
            case "CNI" -> candidate.setNationalIdCardUrl(url);
            case "PHOTO" -> candidate.setProfilePictureUrl(url);
            case "BIRTHCERTIFICATE" -> candidate.setBirthCertificateUrl(url);
            case "DIPLOM" -> candidate.setHighestDiplomatUrl(url);
            case "LETTER" -> candidate.setLetterUrl(url);
            case "FINANCIAL" -> candidate.setFinancialJustificationUrl(url);
            case "CERTIFICATE" -> candidate.setStageCertificateUrl(url);
            case "OLD" -> candidate.setOldApplyanceUrl(url);
            case "CV" -> candidate.setCvUrl(url);
            default -> throw new IllegalArgumentException("Type de fichier non géré: " + fileType);
        }
    }
    
    private void sendApplicationValidationEmail(Candidate candidate, ExamCenter examCenter, Session session) 
            throws MessagingException {
        emailService.sendExamAssignmentEmail(
            candidate.getEmail(),
            candidate.getFirstname(),
            examCenter.getName(),
            session.getExamDate().toString()
        );
    }
    
    private void sendApplicationRejectionEmail(Candidate candidate, String comment) throws MessagingException {
        emailService.sendApplicationRejectionEmail(
            candidate.getEmail(),
            candidate.getFirstname(),
            comment
        );
    }
    
    // ==================== MÉTHODES DE STATISTIQUES ====================
    
    public Long getApplicationCountByStatus(ContentStatus status) {
        try {
            return applicationRepository.countByStatus(status);
        } catch (Exception e) {
            log.error("Erreur lors du comptage par statut: {}", e.getMessage(), e);
            return 0L;
        }
    }
    
    public List<Object[]> getApplicationsByRegion() {
        try {
            return applicationRepository.getApplicationsByRegion();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des statistiques par région: {}", e.getMessage(), e);
            return List.of();
        }
    }
    
    public Map<String, Object> getApplicationStatistics() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // Compter par statut
            stats.put("total", applicationRepository.count());
            stats.put("validated", getApplicationCountByStatus(ContentStatus.VALIDATED));
            stats.put("pending", getApplicationCountByStatus(ContentStatus.PENDING));
            stats.put("rejected", getApplicationCountByStatus(ContentStatus.REJECTED));
            stats.put("paid", getApplicationCountByStatus(ContentStatus.PAID));
            stats.put("draft", getApplicationCountByStatus(ContentStatus.DRAFT));
            stats.put("incompleted", getApplicationCountByStatus(ContentStatus.INCOMPLETED));
            
            // Statistiques par région
            stats.put("byRegion", getApplicationsByRegion());
            
            return stats;
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des statistiques: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                "Erreur lors de la récupération des statistiques");
        }
    }
}

package com.jotsamikael.applycam.application;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.jotsamikael.applycam.candidate.Candidate;
import com.jotsamikael.applycam.candidate.CandidateRepository;
import com.jotsamikael.applycam.common.ContentStatus;
import com.jotsamikael.applycam.common.FileStorageService;
import com.jotsamikael.applycam.common.PageResponse;
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

@Service
@RequiredArgsConstructor
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

    public void applyPersonalInfo(ApplicationRequest request, Authentication connectedUser) {
        User user = ((User) connectedUser.getPrincipal());

        Candidate candidate = candidateRepository.findByEmail(user.getEmail())
        .orElseThrow(() -> new EntityNotFoundException(" Not a Candidate "));

        if (candidate == null) {
            throw new RuntimeException("Candidate not found");
        }
        
       /* if (!candidate.getFirstname().equalsIgnoreCase(request.getFirstName()) ||
                !candidate.getLastname().equalsIgnoreCase(request.getLastName())||
                !candidate.getPhoneNumber().equalsIgnoreCase(request.getPhoneNumber()) ||
                !candidate.getEmail().equalsIgnoreCase(request.getEmail()) 
                ) {
                
                throw new IllegalArgumentException("Les informations fournies ne correspondent pas à celles de votre enregistrement.");
            } */
        
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
        		candidate.setFormationMode(request.getFormationMode());
        		candidate.setFinancialRessource(request.getFinancialRessource());
        		candidate.setHighestSchoolLevel(request.getAcademicLevel());
        		
        candidateRepository.save(candidate);
        Session session= sessionRepository.findBySessionYearAndExamType(request.getSessionYear(),request.getExamType())
        		.orElseThrow(() -> new EntityNotFoundException(" Not Session Found for this Year "));
        

        TrainingCenter trainingCenter = trainingCenterRepository.findByAcronym(request.getTrainingCenterAcronym())
        		.orElseThrow(() -> new EntityNotFoundException(" Not a training Center "));
        
        TrainingCenter trainingCenterIf= trainingCenterRepository.findByCandidateId(candidate.getIdUser())
        		.orElseThrow(() -> new EntityNotFoundException(" you are Not a candidate of this training Center "));
        
        if (!trainingCenter.getFullName().equals(trainingCenterIf.getFullName())) {
            throw new RuntimeException("You are note candidate ok this center");
        }

        //get exam information from the request
        Speciality speciality = specialityRepository.findByName(request.getSpeciality())
            .orElseThrow(() -> new EntityNotFoundException("Speciality not found"));

        var payment=Payment.builder()
				.amount(request.getAmount())
				.paymentMethod(request.getPaymentMethod())
				.secretCode(request.getSecretCode())
				.createdBy(user.getIdUser())
				.createdDate(LocalDateTime.now())
				.isActived(true)
				.build();
        
        paymentRepository.save(payment);
        
        var application = Application.builder()
        		.speciality(speciality)
        		.candidate(candidate)
        		.session(session)
        		.applicationRegion(request.getApplicationRegion())
        		.applicationYear(session.getSessionYear())
        		.payment(payment)
        		.status(ContentStatus.PAID)
        		.build();
        
        
        applicationRepository.save(application);

    }
    
    public void uploadCandidateFile(MultipartFile cniFile,Authentication connectedUser,MultipartFile birthCertificate,
    		MultipartFile diplomFile,MultipartFile photo,MultipartFile oldApplyanceFile,MultipartFile stageCertificate,
    		MultipartFile cv,MultipartFile financialJustification,MultipartFile letter) {
    	
    	User user = ((User) connectedUser.getPrincipal());
    	
    	Candidate candidate= candidateRepository.findByEmail(user.getEmail())
    			.orElseThrow(() -> new EntityNotFoundException(" Not a Candidate "));
    	
    	handleFileUploads(candidate, cniFile,"CNI");
    	handleFileUploads(candidate, birthCertificate,"BIRTHCERTIFICATE");
    	handleFileUploads(candidate, diplomFile,"DIPLOM");
    	handleFileUploads(candidate, photo,"PHOTO");
    	handleFileUploads(candidate, oldApplyanceFile,"OLD");
    	handleFileUploads(candidate, stageCertificate,"CERTIFICATE");
    	handleFileUploads(candidate, cv,"CV");
    	handleFileUploads(candidate, financialJustification,"FINANCIAL");
    	handleFileUploads(candidate, letter,"LETTER");
    	
    	candidateRepository.save(candidate);
    	
    }
    
    
    
    
    
    private void handleFileUploads(Candidate candidate, MultipartFile file,String fileType) {
        if (file != null && !file.isEmpty()) {
            String url = fileStorageService.saveFile(file, candidate.getIdUser(),fileType);
            switch (fileType) {
            case "CNI" ->candidate.setNationalIdCardUrl(url);
            case "PHOTO" -> candidate.setProfilePictureUrl(url);
            case "BIRTHCERTIFICATE" -> candidate.setBirthCertificateUrl(url);
            case "DIPLOM" -> candidate.setHighestDiplomatUrl(url);
            case "LETTER" -> candidate.setLetterUrl(url);
            case "FINANCIAL" -> candidate.setFinancialJustificationUrl(url);
            case "CERTIFICATE" -> candidate.setStageCertificateUrl(url);
            case "OLD" -> candidate.setOldApplyanceUrl(url);
            case "CV" -> candidate.setCvUrl(url);
            
            default -> throw new IllegalArgumentException("we do not handel this folder.");
        }
            candidateRepository.save(candidate);
          
        } else {
            return;
        }
    }
    
    public String validateApplication(Authentication connectedUser,Long id) throws MessagingException {
    	
    	User user = ((User) connectedUser.getPrincipal());
    	
    	Staff staff= staffRepository.findByEmail(user.getEmail())
    			.orElseThrow(()-> new EntityNotFoundException("No staff with found email"+ user.getEmail()));
    	
    	Application application= applicationRepository.findById(id)
    			.orElseThrow(()-> new EntityNotFoundException("No Application with found "));
    	
    	Candidate candidate=application.getCandidate();
    	
    	
    	examService.assignRandomExamCenterToCandidate(candidate.getIdUser());
    	
    	ExamCenter examCenter=candidate.getExamCenter();
    	Session session= application.getSession();
    	application.setActived(true);
    	application.setStatus(ContentStatus.VALIDATED);
    	applicationRepository.save(application);
    	
    	sendApplicationValidationEmail(candidate,examCenter,session);
    	
    	return "validated";
    }
    
    public String rejectApplication(Authentication connectedUser, Long id, String comment) throws MessagingException {

        User user = ((User) connectedUser.getPrincipal());

        Staff staff = staffRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("No staff with email found: " + user.getEmail()));

        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("No Application found with ID: " + id));

        application.setActived(false);
        application.setStatus(ContentStatus.REJECTED);
        applicationRepository.save(application);

        Candidate candidate = application.getCandidate();

        sendApplicationRejectionEmail(candidate, comment);

        return "Candidature rejetée et email envoyé avec succès.";
    }

    
    
    
    private void sendApplicationValidationEmail(Candidate candidate, ExamCenter examCenter,Session session) throws MessagingException {
        
        //send email
    	emailService.sendExamAssignmentEmail(
    		    candidate.getEmail(),
    		    candidate.getFirstname(),
    		    examCenter.getName(),         // Nom du centre d'examen
    		    session.getExamDate().toString()         // Formatée proprement si besoin
    		);
    }
    
    private void sendApplicationRejectionEmail(Candidate candidate, String comment) throws MessagingException {
        
        // Envoi de l'email de rejet
        emailService.sendApplicationRejectionEmail(
            candidate.getEmail(),
            candidate.getFirstname(),
            comment
        );
    }
    
    
    
    public PageResponse<ApplicationResponse> getAllApplications(int offset, int pageSize, String field, boolean order) {
        Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();
        
        
        Page<Application> applications = applicationRepository.getAllApplications(PageRequest.of(offset, pageSize, sort));
        
        List<ApplicationResponse> content = applications.stream()
            .map(mapper::toApplicationResponse)
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
    }
    
    public List<ApplicationResponse> findApplicationsByCandidateName(String name) {
        List<Application> applications = applicationRepository.findByCandidateNameContainingIgnoreCase(name);
        
        return applications.stream()
            .map(app -> ApplicationResponse.builder()
                .id(app.getId())
                .candidateName(app.getCandidate().getFirstname() + " " + app.getCandidate().getLastname())
                .speciality(app.getSpeciality().getName())
                .applicationRegion(app.getApplicationRegion())
                .applicationYear(app.getApplicationYear())
               // .status(app.getStatus())
                .build())
            .toList();
    }
    
    public List<ApplicationResponse> findApplicationsOfConnectedCandidate(Authentication connectedUser) {
    	
    	User user = ((User) connectedUser.getPrincipal());

        Candidate candidate = candidateRepository.findByEmail(user.getEmail())
        .orElseThrow(() -> new EntityNotFoundException(" Not a Candidate "));

        List<Application> applications = applicationRepository.findByCandidate(candidate)
        		.orElseThrow(() -> new EntityNotFoundException("No Application found for" + user.getEmail()));

        
        return applications.stream()
            .map(app -> ApplicationResponse.builder()
                .id(app.getId())
                .candidateName(app.getCandidate().getFirstname() + " " + app.getCandidate().getLastname())
                .speciality(app.getSpeciality().getName())
                .applicationRegion(app.getApplicationRegion())
                .applicationYear(app.getApplicationYear())
                //.status(app.getStatus())
                .build())
            .toList();
    }
    
    public void deleteApplication(Long applicationId, Authentication connectedUser) {
        User user = ((User) connectedUser.getPrincipal());
        
        Application application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new EntityNotFoundException("Application not found"));
        
        // Vérifier les droits (admin ou le candidat lui-même)
        boolean isStaff = user.getRoles().stream()
            .anyMatch(role -> role.getName().equals("STAFF"));
        
        if (!isStaff && !application.getCandidate().getEmail().equals(user.getEmail())) {
        	throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot delete yur own application");
        }
        
        application.setActived(false);        
        // Puis supprimer la candidature
        applicationRepository.save(application);
    }
    
    
    
    
}

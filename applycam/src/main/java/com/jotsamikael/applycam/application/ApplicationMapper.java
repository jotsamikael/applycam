package com.jotsamikael.applycam.application;

import java.time.LocalDate;
import org.springframework.stereotype.Service;

@Service
public class ApplicationMapper {
	
	public ApplicationResponse toApplicationResponse(Application application) {
	    if (application == null) {
	        return null;
	    }
	    
	    String candidateName = "N/A";
	    String examCenterName = "Non assigné";
	    String examCenterRegion = null;
	    
	    if (application.getCandidate() != null) {
	        String firstName = application.getCandidate().getFirstname() != null ? 
	            application.getCandidate().getFirstname() : "";
	        String lastName = application.getCandidate().getLastname() != null ? 
	            application.getCandidate().getLastname() : "";
	        candidateName = (firstName + " " + lastName).trim();
	        if (candidateName.isEmpty()) {
	            candidateName = "N/A";
	        }
	        
	        // Récupérer les informations du centre d'examen du candidat
	        if (application.getCandidate().getExamCenter() != null) {
	            examCenterName = application.getCandidate().getExamCenter().getName();
	            examCenterRegion = application.getCandidate().getExamCenter().getRegion();
	            System.out.println("DEBUG - Candidat " + candidateName + " assigné au centre: " + examCenterName + " (" + examCenterRegion + ")");
	        } else {
	            System.out.println("DEBUG - Candidat " + candidateName + " n'a pas de centre d'examen assigné");
	        }
	    }
	    
	    // Gestion spécialité/cours selon le type d'examen
	    String specialityOrCourse = "N/A";
	    if (application.getSession() != null && "DQP".equalsIgnoreCase(application.getSession().getExamType())) {
	        if (application.getSpeciality() != null && application.getSpeciality().getName() != null) {
	            specialityOrCourse = application.getSpeciality().getName();
	        }
	    } else if (application.getSession() != null && "CQP".equalsIgnoreCase(application.getSession().getExamType())) {
	        if (application.getSpeciality() != null && application.getSpeciality().getCourse() != null) {
	            specialityOrCourse = application.getSpeciality().getCourse().getName();
	        }
	    }
	    
	    String paymentMethod = "N/A";
	    Double amount = null;
	    if (application.getPayment() != null) {
	        paymentMethod = application.getPayment().getPaymentMethod() != null ? 
	            application.getPayment().getPaymentMethod() : "N/A";
	        amount = application.getPayment().getAmount();
	    }
	    
	    String examType = "N/A";
	    LocalDate examDate = null;
	    if (application.getSession() != null) {
	        examType = application.getSession().getExamType() != null ? 
	            application.getSession().getExamType() : "N/A";
	        examDate = application.getSession().getExamDate();
	    }
	    
	    return ApplicationResponse.builder()
	        .id(application.getId())
	        .candidateName(candidateName)
	        .speciality(specialityOrCourse)
	        .applicationRegion(application.getApplicationRegion() != null ? 
	            application.getApplicationRegion() : "N/A")
	        .applicationYear(application.getApplicationYear() != null ? 
	            application.getApplicationYear() : "N/A")
	        .status(application.getStatus())
	        .paymentMethod(paymentMethod)
	        .amount(amount)
	        .examType(examType)
	        .examDate(examDate)
	        .paymentReceiptUrl(application.getPaymentReceiptUrl())
	        .cniUrl(application.getCandidate() != null ? application.getCandidate().getNationalIdCardUrl() : null)
	        .diplomaUrl(application.getCandidate() != null ? application.getCandidate().getHighestDiplomatUrl() : null)
	        .photoUrl(application.getCandidate() != null ? application.getCandidate().getProfilePictureUrl() : null)
	        .birthCertificateUrl(application.getCandidate() != null ? application.getCandidate().getBirthCertificateUrl() : null)
	        .cvUrl(application.getCandidate() != null ? application.getCandidate().getCvUrl() : null)
	        .letterUrl(application.getCandidate() != null ? application.getCandidate().getLetterUrl() : null)
	        .financialJustificationUrl(application.getCandidate() != null ? application.getCandidate().getFinancialJustificationUrl() : null)
	        .stageCertificateUrl(application.getCandidate() != null ? application.getCandidate().getStageCertificateUrl() : null)
	        .oldApplyanceUrl(application.getCandidate() != null ? application.getCandidate().getOldApplyanceUrl() : null)
	        .examCenterName(examCenterName)
	        .examCenterRegion(examCenterRegion)
	        .build();
	}

}

package com.jotsamikael.applycam.application;

import org.springframework.stereotype.Service;

@Service
public class ApplicationMapper {
	
	public ApplicationResponse toApplicationResponse(Application application) {
	    return ApplicationResponse.builder()
	        .id(application.getId())
	        .candidateName(application.getCandidate().getFirstname() + " " + application.getCandidate().getLastname())
	        .speciality(application.getSpeciality().getName())
	        .applicationRegion(application.getApplicationRegion())
	        .applicationYear(application.getApplicationYear())
	        //.status(application.getStatus())
	        .paymentMethod(application.getPayment().getPaymentMethod())
	        .amount(application.getPayment().getAmount())
	        .build();
	}

}

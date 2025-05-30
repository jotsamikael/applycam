package com.jotsamikael.applycam.promoter;

import java.time.LocalDate;

import org.springframework.web.multipart.MultipartFile;

import com.jotsamikael.applycam.trainingCenter.CreateTainingCenterRequest;

import jakarta.validation.Valid;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CreatePromoterAndCenterRequest {
	
	 	@Valid
	    private CreatePromoterRequest promoter;

	    @Valid
	    private CreateTainingCenterRequest trainingCenter;
	    
	    private MultipartFile nationalIdCard;
	    
	    private MultipartFile agreementFile;
	    
	    private MultipartFile promoterPhoto;
	    
	    private MultipartFile signLetter;
	    
	    private MultipartFile localisationFile;
	    
	    private MultipartFile internalRegulation;
	    
	    private LocalDate validUntil;
	    
	    private LocalDate validFrom;
	    
	    private LocalDate validTo; 
	    
	    
	    
	    private String agreementNumber;
	
//DTO Global to sum up the two request to create a promoter while creating a training center
}

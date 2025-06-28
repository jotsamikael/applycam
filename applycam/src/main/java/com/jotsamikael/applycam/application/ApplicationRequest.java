package com.jotsamikael.applycam.application;


import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.Builder;


@Getter
@Setter
@Builder
public class ApplicationRequest {
	
	 
	 
	 @NotEmpty(message = "sex is mandatory")
	    @NotNull(message = "sex is mandatory")
	private String sex;
	 
	 @NotEmpty(message = "email is mandatory")
	    @NotNull(message = "email is mandatory")
	private String email;
	 
	 
	 
	 @NotEmpty(message = "nationIdNumberis mandatory")
	    @NotNull(message = "nationIdNumber is mandatory")
	private String nationIdNumber;

    @NotEmpty(message = "Academic level is mandatory")
    @NotNull(message = "Academic level is mandatory")
    private String academicLevel;

    @NotEmpty(message = "date of Birth  is mandatory")
    @NotNull(message = "date of Birth  can not be blank")
    private String dateOfBirth;

    @NotEmpty(message = "Speciliaty is mandatory")
    @NotNull(message = "Speciliaty is mandatory")
    private String Speciality;
    
    @NotEmpty(message = "Exam Type is mandatory")
    @NotNull(message = "Exam Type is mandatory")
    private String examType;
    
    @NotNull(message = "The departement of origin is mandatory")
    private String departmentOfOrigin;
    
    @NotEmpty(message = "Application Region is mandatory")
    @NotNull(message = "Apploication Region is mandatory")
    private String applicationRegion;
    
    @NotEmpty(message = " Region is mandatory")
    @NotNull(message = " Region is mandatory")
    private String regionOrigins;
    
    @NotEmpty(message = " Session Year is mandatory")
    @NotNull(message = " Session Year is mandatory")
    private String SessionYear;
    
    @NotEmpty(message = " Aronym is mandatory")
    @NotNull(message = " Acronym is mandatory")
    private String trainingCenterAcronym;
    
    @NotEmpty(message = " Nationality is mandatory")
    @NotNull(message = " Nationalityis mandatory")
    private String nationality;
    
   
    @NotNull(message = " Are you a New Candidate is mandatory")
    private Boolean freeCandidate;
    
    
    @NotNull(message = " Are you repeat Candidate is mandatory")
    private Boolean repeatCandidate;
    
    @NotNull(message = "The amount  is mandatory")
   	private Double amount;
    
   	 @NotNull(message = "Payment Method is mandatory")
   	private String paymentMethod;
   	 
   	 @NotNull(message = "Secret code is mandatory")
   	private Long secretCode;
   	 
   	@NotNull(message = "the matrimomial situation is mandatory")
   	 private String matrimonialSituation;
   	
   	@NotNull(message = "The learning Language is mandatory")
     private String learningLanguage;
     
   	@NotNull(message = "Formation mode is mandatory")
     private String formationMode;
     
   	@NotNull(message = "Finacial Ressource  is mandatory")
     private String financialRessource;
   	
   	@NotNull(message = "Place of birth is mandatory")
   	private String placeOfBirth;
   	
   	@NotNull(message = "Number of kid is mandatory")
   	private Integer numberOfKid;
} 
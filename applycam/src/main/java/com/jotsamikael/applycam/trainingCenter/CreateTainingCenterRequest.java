package com.jotsamikael.applycam.trainingCenter;

import com.jotsamikael.applycam.trainingCenter.division.Division;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class CreateTainingCenterRequest {

    @NotEmpty(message = "fullName is mandatory")
    @NotNull(message = "fullName is mandatory")
    private String fullName;

    private String acronym;

    @NotEmpty(message = "agreementNumber is mandatory")
    @NotNull(message = "agreementNumber is mandatory")
    private String agreementNumber;

    @NotNull(message = "startDateOfAgreement is mandatory")
    private LocalDate startDateOfAgreement;

    @NotNull(message = "endDateOfAgreement is mandatory")
    private LocalDate endDateOfAgreement;

    @NotEmpty(message = "Division is mandatory")
    @NotNull(message = "Division is mandatory")
    private String division;
    
    @NotEmpty(message = "FullAddress is mandatory")
    @NotNull(message = "FullAddress is mandatory")
    private String fullAddress;
    
   

    private Boolean isCenterPresentCandidateForCqp;

    private Boolean isCenterPresentCandidateForDqp;
}

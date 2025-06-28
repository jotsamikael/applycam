package com.jotsamikael.applycam.application;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ApplicationResponse {
    private Long id;
    private String candidateName;
    private String speciality;
    private String applicationRegion;
    private String applicationYear;
    private String status;
    private String paymentMethod;
    private Double amount;
    
}

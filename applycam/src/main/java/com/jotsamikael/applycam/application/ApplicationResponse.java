package com.jotsamikael.applycam.application;

import java.time.LocalDate;

import com.jotsamikael.applycam.common.ContentStatus;

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
    private ContentStatus status;
    private String paymentMethod;
    private Double amount;
    private String examType;
    private LocalDate examDate;
    
}

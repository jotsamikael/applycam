package com.jotsamikael.applycam.speciality;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SpecialityResponse {

    private Long id;
    private String name;
    private String code;
    private String description;
    private String examType;
    private Double paymentAmount;
}
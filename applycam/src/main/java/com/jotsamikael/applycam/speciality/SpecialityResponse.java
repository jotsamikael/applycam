package com.jotsamikael.applycam.speciality;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SpecialityResponse {

    private Long id;
    private String name;
    private String code;
    private String description;
    private String examType;
}
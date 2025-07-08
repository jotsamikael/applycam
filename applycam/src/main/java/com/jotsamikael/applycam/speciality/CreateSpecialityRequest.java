package com.jotsamikael.applycam.speciality;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateSpecialityRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Code is required")
    private String code;
    
    @NotBlank(message = "the type d'exam is required")
    private String examType;
    
    @NotNull(message = "the amount is required")
    private Double amount;
    
   

}

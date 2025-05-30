package com.jotsamikael.applycam.subject;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder

public class SubjectRequest {

    @NotBlank(message = "Name is required")
    private String name;

    
    
    @NotNull(message = "Speciality ID is required")
    private Long specialityId;
}
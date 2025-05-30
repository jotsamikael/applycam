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

    @NotEmpty(message = "Academic level is mandatory")
    @NotNull(message = "Academic level is mandatory")
    private String academicLevel;

    @NotEmpty(message = "Father fullname is mandatory")
    @NotNull(message = "Father fullname is mandatory")
    private String fatherFullname;

    @NotEmpty(message = "Mother fullname is mandatory")
    @NotNull(message = "Mother fullname is mandatory")
    private String motherFullname;

    @NotEmpty(message = "Mother profession is mandatory")
    @NotNull(message = " is mandatory")
    private String motherProfession;

    @NotEmpty(message = "Firstname is mandatory")
    @NotNull(message = "Firstname is mandatory")
    private String fatherProfession;

    @NotEmpty(message = "Firstname is mandatory")
    @NotNull(message = "Firstname is mandatory")
    private String townOfResidence;
   
    private String Speciality;
    
    private String examType;
    
    private String applicationRegion;
} 
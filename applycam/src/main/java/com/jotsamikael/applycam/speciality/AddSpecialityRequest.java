package com.jotsamikael.applycam.speciality;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AddSpecialityRequest {
    @NotEmpty(message = "Coursename is mandatory")
	@NotBlank(message = "Coursename can not be blank")
    private String courseName;
    
    @NotEmpty(message = "Specialityname is mandatory")
	@NotBlank(message = "Specialityname can not be blank")
    private String specialityName;

}
package com.jotsamikael.applycam.speciality;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;


@Data
@Builder

public class SpecialityCourseRequest {
	
	@NotBlank(message = "Name is required")
    private String name;

   
    @NotBlank(message = "Code is required")
    private String code;
    
    @NotBlank(message = "Course Id is required")
    private Long courseId;

}

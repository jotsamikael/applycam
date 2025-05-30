package com.jotsamikael.applycam.subject;

import com.jotsamikael.applycam.course.CourseRequest;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UpdateSubjectRequest {
	
	@NotEmpty(message = "id is mandatory")
    @NotBlank(message = "id can not be blank")
    private Long id;
	
 	@NotEmpty(message = "name is mandatory")
    @NotBlank(message = "name can not be blank")
 	private String name;
 	
 	@NotEmpty(message = "code is mandatory")
    @NotBlank(message = "code can not be blank")
    private String code;
   
 	@Size(max = 500, message = "La description ne doit pas dépasser 500 caractères")
    private String description;

}

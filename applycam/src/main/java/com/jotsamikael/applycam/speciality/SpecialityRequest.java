package com.jotsamikael.applycam.speciality;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SpecialityRequest {
	
	@NotBlank(message = "Name is required")
	    private String name;

	   
	    @NotBlank(message = "Code is required")
	    private String code;
	
		@NotNull(message = "Training center ID is required")
	    private Long trainingCenterId;

}

package com.jotsamikael.applycam.subject;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SpecialitySubjectRequest {
	
	@NotNull(message = "Speciality ID is required")
    private Long specialityId;

}

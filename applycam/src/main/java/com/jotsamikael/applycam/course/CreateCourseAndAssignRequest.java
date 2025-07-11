package com.jotsamikael.applycam.course;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CreateCourseAndAssignRequest {
	
	@NotEmpty(message = "name is mandatory")
	private String name;
	@NotEmpty(message = "code is mandatory")
    private String code;
	@NotEmpty(message = "description is mandatory")
    private String description;
	@NotNull(message = "price for cqp is mandatory")
    private Double priceForCqp;
	@NotEmpty(message = "activity sector name is mandatory")
    private String activitySectorName;

}

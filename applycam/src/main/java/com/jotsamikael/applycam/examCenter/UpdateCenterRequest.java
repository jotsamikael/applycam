package com.jotsamikael.applycam.examCenter;

import java.time.LocalDate;

import com.jotsamikael.applycam.session.UpdateSessionRequest;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UpdateCenterRequest {
	
	@NotBlank(message = "Exam center Id is required")
	private Long examCenterId;
	@NotBlank(message = "Name is required")
	private String name;
	@NotBlank(message = "Region is required")
	private String region;
	@NotBlank(message = "division is required")
	private String division;
	@NotBlank(message = "Capacity is required")
	private int capacity;

}

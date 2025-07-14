package com.jotsamikael.applycam.session;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UpdateSessionRequest {
	
	@NotBlank(message = "SessinId is required")
    private Long sessionId;
    @NotBlank(message = "ExamType is required")
    private String examType;
    @NotBlank(message = "examDate is required")
    private LocalDate examDate;
    @NotBlank(message = "SessionYear is required")
    private String sessionYear;

    private LocalDate registrationStartDate;
    private LocalDate registrationEndDate;
}

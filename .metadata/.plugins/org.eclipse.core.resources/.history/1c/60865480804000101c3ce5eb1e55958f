package com.jotsamikael.applycam.session;

import java.time.LocalDate;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateSessionRequest {

    @NotEmpty(message = "ExamType is mandatory")
    @NotNull(message = "ExamType is mandatory")
    private String examType;
	
    @NotEmpty(message = "ExamDate is mandatory")
    @NotNull(message = "ExamDate is mandatory")
	private LocalDate examDate;
	
    @NotEmpty(message = "Session-year is mandatory")
    @NotNull(message = "Session-Year is mandatory")
	private String sessionYear;
}

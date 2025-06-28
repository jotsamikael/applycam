package com.jotsamikael.applycam.examCenter;

import java.time.LocalDate;

import com.jotsamikael.applycam.session.SessionResponse;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExamCenterResponse {
	
	private Long id;
	private String name;
	private String region;
	private String division;
	private int capacity;

}

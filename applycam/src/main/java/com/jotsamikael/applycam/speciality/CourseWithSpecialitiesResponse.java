package com.jotsamikael.applycam.speciality;

import java.util.List;

import com.jotsamikael.applycam.application.ApplicationRequest;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CourseWithSpecialitiesResponse {
	
	private Long courseId;
    private String courseName;
    private List<SpecialityResponse> specialities;

}

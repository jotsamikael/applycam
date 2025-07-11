package com.jotsamikael.applycam.session;

import java.util.List;

import com.jotsamikael.applycam.course.CourseResponse;
import com.jotsamikael.applycam.speciality.SpecialityResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SessionDetailsListResponse {
	
	public List<SpecialityResponse> specialities;
    private List<CourseResponse> courses;

}

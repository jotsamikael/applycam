package com.jotsamikael.applycam.session;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.jotsamikael.applycam.application.Application;
import com.jotsamikael.applycam.common.BaseEntity;
import com.jotsamikael.applycam.course.Course;
import com.jotsamikael.applycam.speciality.Speciality;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@EntityListeners(AuditingEntityListener.class)
public class Session extends BaseEntity{
		
	private String examType;
	
	private LocalDate examDate;

    private LocalDate registrationStartDate;
    private LocalDate registrationEndDate;
	
	private String sessionYear;
	
	@OneToMany(mappedBy="session")
	@JsonManagedReference
	private List<Application> applicationList; 
	
	@OneToMany(mappedBy="session")
	@JsonManagedReference
	private List<Speciality> speciality;
	
	@OneToMany(mappedBy="session")
	@JsonManagedReference
	private List<Course> course;
	
	

}

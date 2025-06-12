package com.jotsamikael.applycam.session;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.jotsamikael.applycam.application.Application;
import com.jotsamikael.applycam.common.BaseEntity;


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
	
	private String sessionYear;
	
	@OneToMany(mappedBy="session")
	@JsonManagedReference
	private List<Application> applicationList; 
	
	

}

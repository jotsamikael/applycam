package com.jotsamikael.applycam.payment;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.jotsamikael.applycam.application.Application;
import com.jotsamikael.applycam.candidate.Candidate;
import com.jotsamikael.applycam.common.BaseEntity;
import com.jotsamikael.applycam.common.ContentStatus;
import com.jotsamikael.applycam.session.Session;
import com.jotsamikael.applycam.speciality.Speciality;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.OneToOne;
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
public class Payment extends BaseEntity{
	
	private double amount;
	private String paymentMethod;
	private Long secretCode;
	
	@OneToOne(mappedBy="payment")
	@JsonManagedReference
	private Application application;
	
	@OneToOne(mappedBy="payment")
	@JsonManagedReference
	private Speciality speciality;
}

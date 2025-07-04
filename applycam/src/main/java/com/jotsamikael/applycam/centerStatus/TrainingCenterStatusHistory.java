package com.jotsamikael.applycam.centerStatus;

import java.util.List;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.jotsamikael.applycam.application.Application;
import com.jotsamikael.applycam.candidate.Candidate;
import com.jotsamikael.applycam.common.BaseEntity;
import com.jotsamikael.applycam.common.ContentStatus;
import com.jotsamikael.applycam.examCenter.ExamCenter;
import com.jotsamikael.applycam.hasSchooled.HasSchooled;
import com.jotsamikael.applycam.payment.Payment;
import com.jotsamikael.applycam.trainingCenter.TrainingCenter;
import com.jotsamikael.applycam.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
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
@Table(name = "center_history")
public class TrainingCenterStatusHistory extends BaseEntity{
	
	 @OneToOne
	 @JoinColumn(name="trainingCenter_id")  
	private TrainingCenter trainingCenter;
	 
	@Column(nullable = true)
	@Enumerated(EnumType.STRING)
	private ContentStatus status;
	
	private String comment;
	 
	 
	
	

}

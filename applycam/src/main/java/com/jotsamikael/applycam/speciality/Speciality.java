package com.jotsamikael.applycam.speciality;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.jotsamikael.applycam.application.Application;
import com.jotsamikael.applycam.common.BaseEntity;
import com.jotsamikael.applycam.course.Course;
import com.jotsamikael.applycam.offersSpeciality.OffersSpeciality;
import com.jotsamikael.applycam.payment.Payment;
import com.jotsamikael.applycam.session.Session;
import com.jotsamikael.applycam.subject.Subject;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.List;

/*
* This class represents a speciality which is a subset of a field
* */

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@EntityListeners(AuditingEntityListener.class)
public class Speciality extends BaseEntity {
	
	@Column(unique=true)
    private String name;
	
    private String code;
    private String description;
    
    private String examType;
    
    private double dqpPrice;
    @ManyToOne
    @JoinColumn(name="session_id")
    @JsonIgnore
    private Session session;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @OneToMany(mappedBy = "speciality" ,cascade = CascadeType.ALL, orphanRemoval = false)
    @JsonManagedReference
    private List<OffersSpeciality> offersSpecialityList;

    @OneToMany(mappedBy = "speciality")
    @JsonManagedReference
    private List<Application> applicationList;
    
    @ManyToMany
    @JoinTable(name = "speciality_subject",
            joinColumns = @JoinColumn(name = "speciality_id"),
            inverseJoinColumns = @JoinColumn(name = "subject_id"))
    private List<Subject> subjectList;
    
    @OneToOne
    @JoinColumn(name="payment_id")
    @JsonIgnore
    private Payment payment;


}

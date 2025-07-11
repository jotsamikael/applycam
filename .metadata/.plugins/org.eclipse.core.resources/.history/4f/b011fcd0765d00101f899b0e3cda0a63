package com.jotsamikael.applycam.course;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.jotsamikael.applycam.common.BaseEntity;
import com.jotsamikael.applycam.session.Session;
import com.jotsamikael.applycam.speciality.Speciality;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.List;

/*
 * This class represents the course Entity
 * */
@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@EntityListeners(AuditingEntityListener.class)
public class Course extends BaseEntity {
	
	@Column(unique=true)
    private String name;
    private String code;
    private String description;
    private double priceForCqp;
    
    @ManyToOne
    @JoinColumn(name="session_id")
    @JsonIgnore
    private Session session;

    @OneToMany(mappedBy = "course")
    private List<Speciality> specialityList;
}

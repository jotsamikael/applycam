package com.jotsamikael.applycam.activitySector;

import java.util.List;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.jotsamikael.applycam.campus.Campus;
import com.jotsamikael.applycam.common.BaseEntity;
import com.jotsamikael.applycam.course.Course;
import com.jotsamikael.applycam.speciality.Speciality;
import com.jotsamikael.applycam.trainingCenter.TrainingCenter;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.OneToMany;
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
public class ActivitySector extends BaseEntity {
	
	@Column(unique=true)
	private String name;
	
	private String code;
    private String description;
    
    @OneToMany(mappedBy = "activitySector")
    private List<Course> courseList;

}

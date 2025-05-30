package com.jotsamikael.applycam.subject;



import java.util.List;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.jotsamikael.applycam.common.BaseEntity;
import com.jotsamikael.applycam.speciality.Speciality;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.ManyToMany;
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
@Table(name = "subjects")
public class Subject extends BaseEntity {
	
	@Column(unique=true)
	private String name;
	@Column(unique=true)
    private String code;
    private String description;
    
    @ManyToMany(mappedBy = "subjectList")
    private List<Speciality> specialityList;

	

}

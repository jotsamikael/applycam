package com.jotsamikael.applycam.application;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.jotsamikael.applycam.candidate.Candidate;
import com.jotsamikael.applycam.common.BaseEntity;
import com.jotsamikael.applycam.common.ContentStatus;
import com.jotsamikael.applycam.offersSpeciality.OffersSpeciality;
import com.jotsamikael.applycam.session.Session;
import com.jotsamikael.applycam.speciality.Speciality;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@EntityListeners(AuditingEntityListener.class)
public class Application extends BaseEntity {



    

    private String applicationYear;

    @ManyToOne
    @JoinColumn(name = "candidate_id")
    private Candidate candidate;

    //relationship between Application and offerSpeciality
    @ManyToOne
    @JoinColumn(name = "speciality")
    private Speciality speciality;
    
    @ManyToOne
    @JoinColumn(name="session_id")
    @JsonIgnore
    private Session session;
    
    private String applicationRegion;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ContentStatus status;
    
    
}

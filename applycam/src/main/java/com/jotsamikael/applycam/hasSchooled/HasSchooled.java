package com.jotsamikael.applycam.hasSchooled;

import com.jotsamikael.applycam.application.Application;
import com.jotsamikael.applycam.candidate.Candidate;
import com.jotsamikael.applycam.common.BaseEntity;
import com.jotsamikael.applycam.trainingCenter.TrainingCenter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
/*
* This class relates the candidate with a training center in a given academic year
* Thereby answering the question: which training center did this candidate attend this year.
* */
@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@EntityListeners(AuditingEntityListener.class)
public class HasSchooled extends BaseEntity {

    private LocalDate startYear;
    private LocalDate endYear;

    //relationship with candidate
    @ManyToOne()
    @JoinColumn(name = "candidate_id")
    private Candidate candidate;

    //relationship with training center
    @ManyToOne()
    @JoinColumn(name = "training_center_id")
    private TrainingCenter trainingCenter;
}

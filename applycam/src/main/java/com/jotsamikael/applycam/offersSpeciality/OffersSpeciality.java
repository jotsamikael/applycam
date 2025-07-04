package com.jotsamikael.applycam.offersSpeciality;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.jotsamikael.applycam.application.Application;
import com.jotsamikael.applycam.common.BaseEntity;
import com.jotsamikael.applycam.speciality.Speciality;
import com.jotsamikael.applycam.trainingCenter.TrainingCenter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.List;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@EntityListeners(AuditingEntityListener.class)
public class OffersSpeciality extends BaseEntity {

    private String agreement;

    @ManyToOne
    @JoinColumn(name = "speciality_id")
    private Speciality speciality;

    @ManyToOne
    @JoinColumn(name = "training_center_id")
    @JsonIgnore
    private TrainingCenter trainingCenter;




}

package com.jotsamikael.applycam.campus;

import com.jotsamikael.applycam.common.BaseEntity;
import com.jotsamikael.applycam.trainingCenter.TrainingCenter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "_campus")
public class Campus extends BaseEntity {

    private String name;
    private int capacity; //max number of students it can support
    private String quarter;
    private String town;
    private double xCoor;
    private double yCoor;

    @ManyToOne
    @JoinColumn(name = "id_training_center")
    private TrainingCenter trainingCenter;



}

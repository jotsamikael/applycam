package com.jotsamikael.applycam.promoter;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.jotsamikael.applycam.trainingCenter.TrainingCenter;
import com.jotsamikael.applycam.user.User;
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
@Table(name = "_promoter")
public class Promoter extends User {

    private String address;
    private String nationality;
    private String SchoolLevel; //Primary, junior secondary, high school, unversity etc
    private String nationalIdCardUrl;
    private String PhotoUrl;
    
    
    @OneToMany(mappedBy = "promoter")
    @JsonManagedReference
    private List<TrainingCenter> trainingCenterList;
}

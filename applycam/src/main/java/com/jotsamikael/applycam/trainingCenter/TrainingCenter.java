package com.jotsamikael.applycam.trainingCenter;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.jotsamikael.applycam.campus.Campus;
import com.jotsamikael.applycam.centerStatus.TrainingCenterStatusHistory;
import com.jotsamikael.applycam.common.BaseEntity;
import com.jotsamikael.applycam.course.Course;
import com.jotsamikael.applycam.hasSchooled.HasSchooled;
import com.jotsamikael.applycam.offersSpeciality.OffersSpeciality;
import com.jotsamikael.applycam.promoter.Promoter;
import com.jotsamikael.applycam.subject.Subject;
import com.jotsamikael.applycam.trainingCenter.division.Division;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.util.List;

/*
 * This class represents the training center, in this system a training center is not a mere physical place
 * but a moral entity that is bind by the laws in place therefore a training center with several sites is still
 * considered as one training center
 * */

@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@EntityListeners(AuditingEntityListener.class)
public class TrainingCenter extends BaseEntity {
    private String fullName;
    
    @Column(unique = true)
    private String acronym;

    @Column(unique = true)
    private String agreementNumber;
    private String agreementFileUrl;
    private Enum<AgreementStatus> agreementStatus;

    private LocalDate startDateOfAgreement;
    private LocalDate endDateOfAgreement;
    private Boolean isCenterPresentCandidateForCqp;
    private Boolean isCenterPresentCandidateForDqp;
    private String division;
    private String fullAddress;
    private String centerType;
    private String centerPhone;
    @Column(unique = true)
    private String centerEmail;
    private String website;
    private String city;
    private String region;
    private String SignatureLetterUrl;
    private String LocalisationFileUrl;
    private String InternalRegulationFileUrl;
    private double centerAge;
   

    @ManyToOne
    @JoinColumn(name = "promoter_id")
    @JsonIgnore // <-- Avoid circular ref
    private Promoter promoter;
    
    @OneToOne(mappedBy="trainingCenter")
    private TrainingCenterStatusHistory status;
    
    @ManyToMany
    @JoinTable(name = "center_course",
            joinColumns = @JoinColumn(name = "traininCenter_id"),
            inverseJoinColumns = @JoinColumn(name = "course_id"))
    private List<Course> courseList;
    

    @OneToMany(mappedBy = "trainingCenter")
    @JsonManagedReference
    private List<OffersSpeciality> offersSpecialityList;

    @OneToMany(mappedBy = "trainingCenter")
    @JsonManagedReference
    private List<Campus> campusList;
    
    @OneToMany(mappedBy = "trainingCenter")
    @JsonManagedReference
    private List<HasSchooled> hasSchooledList;

}

package com.jotsamikael.applycam.candidate;

import com.jotsamikael.applycam.application.Application;
import com.jotsamikael.applycam.common.BaseEntity;
import com.jotsamikael.applycam.common.ContentStatus;
import com.jotsamikael.applycam.hasSchooled.HasSchooled;
import com.jotsamikael.applycam.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.List;
/*
 * This class represents the candidate Entity which is also a user of the system
 *  and can therefore login, logout etc. like a normal user
 * */
@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "_candidate")
public class Candidate extends User {
    private String sex;
    private String placeOfBirth;
    private String motherFullName;
    private String fatherFullName;
    private String motherProfession;
    private String fatherProfession;
    private String highestSchoolLevel;
    private String nationality;
    private String townOfResidence;
    private boolean freeCandidate;
    private boolean repeatCandidate;
    


    private String profilePictureUrl;
    private String birthCertificateUrl;
    private String nationalIdCardUrl;
    private String highestDiplomatUrl;
    private ContentStatus contentStatus;

    //relationship with has_schooled
    @OneToMany(mappedBy = "candidate")
    private List<HasSchooled> hasSchooledList;

    @OneToMany(mappedBy = "candidate")
    private List<Application> applicationList;
}

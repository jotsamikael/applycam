package com.jotsamikael.applycam.candidate;


import com.jotsamikael.applycam.common.ContentStatus;
import jakarta.persistence.Column;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CandidateResponse{
    private String firstname;
    private String lastname;
    private LocalDate dateOfBirth;
    private String email;
    private String phoneNumber;
    private String nationalIdNumber;
    private String sex;
    private String placeOfBirth;
    private String motherFullName;
    private String fatherFullName;
    private String motherProfession;
    private String fatherProfession;
    private String highestSchoolLevel;
    private String nationality;
    private String townOfResidence;


    private String profilePictureUrl;
    private String birthCertificateUrl;
    private String nationalIdCardUrl;
    private String highestDiplomatUrl;
    private ContentStatus contentStatus;
}

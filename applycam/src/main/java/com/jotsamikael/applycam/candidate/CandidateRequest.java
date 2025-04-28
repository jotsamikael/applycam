package com.jotsamikael.applycam.candidate;

import com.jotsamikael.applycam.common.ContentStatus;
import java.time.LocalDate;

public record CandidateRequest(
        String firstname,
        String lastname,
        LocalDate dateOfBirth,
        String email,
        String phoneNumber,
        String nationalIdNumber,
        String sex,
        String placeOfBirth,
        String motherFullName,
        String fatherFullName,
        String motherProfession,
        String fatherProfession,
        String highestSchoolLevel,
        String nationality,
        String townOfResidence,
        String profilePictureUrl,
        String birthCertificateUrl,
        String nationalIdCardUrl,
        String highestDiplomatUrl,
        ContentStatus contentStatus
) {
}

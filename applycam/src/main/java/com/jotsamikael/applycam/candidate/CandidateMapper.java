package com.jotsamikael.applycam.candidate;

import org.springframework.stereotype.Service;
/*
* This class is used to map a Candidate Object to a CandidateResponse object and vice-versa
* */
@Service
public class CandidateMapper {

    public CandidateResponse toCandidateResponse(Candidate candidate){
        return CandidateResponse.builder()
                .firstname(candidate.getFirstname())
                .lastname(candidate.getLastname())
                .dateOfBirth(candidate.getDateOfBirth())
                .email(candidate.getEmail())
                .phoneNumber(candidate.getPhoneNumber())
                .nationalIdNumber(candidate.getNationalIdNumber())
                .sex(candidate.getSex())
                .placeOfBirth(candidate.getPlaceOfBirth())
                .motherFullName(candidate.getMotherFullName())
                .fatherFullName(candidate.getFatherFullName())
                .motherProfession(candidate.getMotherProfession())
                .fatherProfession(candidate.getFatherProfession())
                .highestSchoolLevel(candidate.getHighestSchoolLevel())
                .townOfResidence(candidate.getTownOfResidence())
                .profilePictureUrl(candidate.getProfilePictureUrl())
                .birthCertificateUrl(candidate.getBirthCertificateUrl())
                .nationalIdCardUrl(candidate.getNationalIdCardUrl())
                .highestDiplomatUrl(candidate.getHighestDiplomatUrl())
                .contentStatus(candidate.getContentStatus())
                .build();
    }



        public Candidate toCandidate(CandidateResponse candidateResponse){
        return Candidate.builder()
                .firstname(candidateResponse.getFirstname())
                .lastname(candidateResponse.getLastname())
                .dateOfBirth(candidateResponse.getDateOfBirth())
                .email(candidateResponse.getEmail())
                .phoneNumber(candidateResponse.getPhoneNumber())
                .nationalIdNumber(candidateResponse.getNationalIdNumber())
                .sex(candidateResponse.getSex())
                .placeOfBirth(candidateResponse.getPlaceOfBirth())
                .motherFullName(candidateResponse.getMotherFullName())
                .fatherFullName(candidateResponse.getFatherFullName())
                .motherProfession(candidateResponse.getMotherProfession())
                .fatherProfession(candidateResponse.getFatherProfession())
                .highestSchoolLevel(candidateResponse.getHighestSchoolLevel())
                .townOfResidence(candidateResponse.getTownOfResidence())
                .profilePictureUrl(candidateResponse.getProfilePictureUrl())
                .birthCertificateUrl(candidateResponse.getBirthCertificateUrl())
                .nationalIdCardUrl(candidateResponse.getNationalIdCardUrl())
                .highestDiplomatUrl(candidateResponse.getHighestDiplomatUrl())
                .contentStatus(candidateResponse.getContentStatus())
                .build();
    }
}
  
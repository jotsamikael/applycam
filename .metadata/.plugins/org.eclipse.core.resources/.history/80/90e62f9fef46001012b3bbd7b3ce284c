package com.jotsamikael.applycam.application;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.jotsamikael.applycam.candidate.Candidate;
import com.jotsamikael.applycam.candidate.CandidateRepository;
import com.jotsamikael.applycam.speciality.Speciality;
import com.jotsamikael.applycam.speciality.SpecialityRepository;
import com.jotsamikael.applycam.user.User;
import com.jotsamikael.applycam.user.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;
    private final SpecialityRepository specialityRepository;
    private final ApplicationRepository applicationRepository;

    public void applyPersonalInfo(ApplicationRequest request, Authentication connectedUser) {
        User user = ((User) connectedUser.getPrincipal());

        Candidate candidate = candidateRepository.findByEmail(user.getEmail())
        .orElseThrow(() -> new EntityNotFoundException(" Not a Candidate "));

        if (candidate == null) {
            throw new RuntimeException("Candidate not found");
        }

        
        var candidateif= Candidate.builder()
        .firstname(user.getFirstname())
        .lastname(user.getLastname())
        .phoneNumber(user.getPhoneNumber())
        .sex(candidate.getSex())
        .email(user.getEmail())
        .nationalIdNumber(user.getNationalIdNumber())
        .highestSchoolLevel(request.getAcademicLevel())
        .fatherFullName(request.getFatherFullname())
        .motherFullName(request.getMotherFullname())
        .motherProfession(request.getMotherProfession())
        .fatherProfession(request.getFatherProfession())
        .townOfResidence(request.getTownOfResidence())
        .freeCandidate(candidate.isFreeCandidate())
        .repeatCandidate(candidate.isRepeatCandidate())
        
        .build();

        userRepository.save(candidateif);
        
        //get exam information from the request
        Speciality speciality = specialityRepository.findByName(request.getSpeciality())
            .orElseThrow(() -> new EntityNotFoundException("Speciality not found"));

        var application = Application.builder()
        		.examType(request.getExamType())
        		.speciality(speciality)
        		.candidate(candidateif)
        		.build();
        applicationRepository.save(application);

    }
}

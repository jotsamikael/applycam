package com.jotsamikael.applycam.subject;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.jotsamikael.applycam.common.PageResponse;
import com.jotsamikael.applycam.course.Course;
import com.jotsamikael.applycam.course.CourseRequest;
import com.jotsamikael.applycam.course.CourseResponse;
import com.jotsamikael.applycam.speciality.Speciality;
import com.jotsamikael.applycam.speciality.SpecialityRepository;
import com.jotsamikael.applycam.user.User;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubjectService {
    private final SubjectRepository subjectRepository;
    private final SpecialityRepository specialityRepository;

    public String addSubjectBySpecialityId(SubjectRequest subjectRequest) {
        Speciality speciality = specialityRepository.findById(subjectRequest.getSpecialityId())
                .orElseThrow(() -> new EntityNotFoundException("Speciality not found"));
        
        Subject subject_if= subjectRepository.findByName(subjectRequest.getName()).orElseThrow(() -> new EntityNotFoundException("Subject does not exists"));
        
        var subject = Subject.builder()
        		.name(subject_if.getName())
        		.description(subject_if.getDescription())
        		.code(subject_if.getCode())
            .specialityList(new ArrayList<>(List.of(speciality)))
            .build();

        // Sauvegarder le sujet
        subject = subjectRepository.save(subject);
        
        // Mettre à jour la liste des sujets dans la spécialité
        if (speciality.getSubjectList() == null) {
            speciality.setSubjectList(new ArrayList<>());
        }
        speciality.getSubjectList().add(subject);
        specialityRepository.save(speciality);
            
        return subject.getName();
    }
    
    public PageResponse<SubjectResponse> getAllSubjectOfSpeciality(SubjectRequest subjectRequest,int offset, 
    	    int pageSize, String field, boolean order){

    	        Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();

    	        Page<Subject> list= subjectRepository.findAllBySpecialityId(subjectRequest.getSpecialityId(), PageRequest.of(offset,pageSize,sort));

    	        List<SubjectResponse> responses= list.getContent().stream().map(subject-> SubjectResponse.builder()
    	        .id(subject.getId())
    	        .name(subject.getName())
    	        .description(subject.getDescription())
    	        .code(subject.getCode())
    	        .build()).toList();

    	        return new PageResponse<>(
    	            responses,
    	            list.getNumber(),
    	            list.getSize(),
    	            list.getTotalElements(),
    	            list.getTotalPages(),
    	            list.isFirst(),
    	            list.isLast()
    	        );
    	    }

    	    public String createSubject(CreateSubjectRequest createSubjectRequest, Authentication connectedUser){
    	    	
    	    	 User user = (User) connectedUser.getPrincipal();
    	    	 
    	    	 if(subjectRepository.existsByName(createSubjectRequest.getName())) {
    	    		 throw new DataIntegrityViolationException("Subject already created");
    	    	 };
    	    	
    	        var subject = Subject.builder()
    	        .name(createSubjectRequest.getName())
    	        .description(createSubjectRequest.getDescription())
    	        .code(createSubjectRequest.getCode())
    	        .createdBy(user.getIdUser())
                .createdDate(LocalDateTime.now())
    	        .build();
    	        
    	        subjectRepository.save(subject);
    	        return subject.getName();
    	    }
    	    
    	    public String updateSubject(UpdateSubjectRequest updateSubjectRequest,  Authentication connectedUser) {
    	    	
    	    	 User user = ((User) connectedUser.getPrincipal());

    	        Subject subject = subjectRepository.findById(updateSubjectRequest.getId()).orElseThrow(() -> new EntityNotFoundException("Subject not found"));
    	        
    	        if (!subject.isActived() ) {
    	        	throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This Subject cannot be updated.");
    	        }

    	        subject.setName(updateSubjectRequest.getName());
    	        subject.setCode(updateSubjectRequest.getCode());
    	        subject.setDescription(updateSubjectRequest.getDescription());
    	        subject.setLastModifiedBy(user.getIdUser());
    	        subject.setLastModifiedDate(LocalDateTime.now());

    	        subjectRepository.save(subject);
    	        return subject.getName();
    	    }
    	    
    	    public SubjectResponse findByName(String name) {
    	        Subject subject = subjectRepository.findByName(name).orElseThrow(() -> new EntityNotFoundException("Subject not found"));
    	        
    	        if (!subject.isActived()) {
    	            return SubjectResponse.builder()
    	                .name(subject.getName())
    	                .code(subject.getCode())
    	                .description("This Course was already deleted.")
    	                .build();
    	        }
    	        
    	        return SubjectResponse.builder()
    	            .name(subject.getName())
    	            .code(subject.getCode())
    	            .description(subject.getDescription())
    	            .build();
    	    }
    	    
    	    public void toggleSubject(String name, Authentication connectedUser) {
    	    	
    	    	User user =(User) connectedUser.getPrincipal();
    	        Subject subject = subjectRepository.findByName(name).orElseThrow(() -> new EntityNotFoundException("Course not found"));
    	        if(subject.isActived()){
    	        	subject.setActived(false);
    	        	subject.setArchived(true);
    	            
    	        }else{
    	        	subject.setActived(true);
    	        	subject.setArchived(false);
    	        }
    	        subject.setLastModifiedBy(user.getIdUser());
    	        subject.setLastModifiedDate(LocalDateTime.now());
    	        subjectRepository.save(subject);
    	    }
}

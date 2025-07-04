package com.jotsamikael.applycam.speciality;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.jotsamikael.applycam.common.PageResponse;
import com.jotsamikael.applycam.course.Course;
import com.jotsamikael.applycam.course.CourseRepository;
import com.jotsamikael.applycam.course.CourseRequest;
import com.jotsamikael.applycam.course.CourseResponse;
import com.jotsamikael.applycam.trainingCenter.TrainingCenter;
import com.jotsamikael.applycam.trainingCenter.TrainingCenterRepository;
import com.jotsamikael.applycam.user.User;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SpecialityService {

    private final SpecialityRepository specialityRepository;
    private final TrainingCenterRepository trainingCenterRepository;
    private final CourseRepository courseRepository;

    public String addSpecialitybyTrainingCenterId(SpecialityRequest specialityRequest) {

        TrainingCenter trainingCenter = trainingCenterRepository.findById(specialityRequest.getTrainingCenterId())
        .orElseThrow(() -> new EntityNotFoundException("Training center not found"));

        Speciality speciality = specialityRepository.findByName(specialityRequest.getName())
        .orElseThrow(() -> new EntityNotFoundException("Speciality not found"));
        
        if (!speciality.isActived() ) {
           	throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This Speciality cannot be added to the training Center it has been enabled.");
           }
        
         speciality = Speciality.builder()
            .offersSpecialityList(trainingCenter.getOffersSpecialityList())
            .build();

        specialityRepository.save(speciality);

        return speciality.getName();
    }

    public PageResponse<SpecialityResponse> getallSpecialityOfTrainingCenter(SpecialityRequest specialityRequest,int offset, int pageSize, String field, boolean order) {
        Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();

        Page<Speciality> list = specialityRepository.findAllByTrainingCenterId(specialityRequest.getTrainingCenterId(), PageRequest.of(offset, pageSize, sort));

        List<SpecialityResponse> specialityResponses = list.getContent().stream().map(speciality->SpecialityResponse.builder()
        .id(speciality.getId())
        .name(speciality.getName())
        .description(speciality.getDescription())
        .build()).toList();

       
        return new PageResponse<>(
            specialityResponses,
            list.getNumber(),
            list.getSize(),
            list.getTotalElements(),
            list.getTotalPages(),
            list.isFirst(),
            list.isLast()
        );
    }

    public String createSpeciality(CreateSpecialityRequest createSpecialityRequest, Authentication connectedUser) {
    	
    	User user = ((User) connectedUser.getPrincipal());
    	
        var speciality = Speciality.builder()
        .name(createSpecialityRequest.getName())
        .description(createSpecialityRequest.getDescription())
        .createdBy(user.getIdUser())
	    .createdDate(LocalDateTime.now())
	    .isActived(true)
        .isArchived(false)
        .build();
        specialityRepository.save(speciality);
        return speciality.getName();
    }

    public PageResponse<SpecialityResponse> getAllSpeciality( int offset, int pageSize, String field, boolean order) {
        Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();
        Page<Speciality> specialities = specialityRepository.findAll(PageRequest.of(offset, pageSize, sort));
        
        List<SpecialityResponse> specialityResponses = specialities.getContent().stream()
            .map(speciality -> SpecialityResponse.builder()
                .id(speciality.getId())
                .name(speciality.getName())
                .description(speciality.getDescription())
                .build())
            .toList();

        return new PageResponse<>(
            specialityResponses,
            specialities.getNumber(),
            specialities.getSize(),
            specialities.getTotalElements(),
            specialities.getTotalPages(),
            specialities.isFirst(),
            specialities.isLast()
        );
    }
    
    public String addSpecialityToCourse(AddSpecialityRequest addSpecialityRequest) {
        // Récupération du cours existant
        Course course = courseRepository.findByName(addSpecialityRequest.getCourseName())
                .orElseThrow(() -> new EntityNotFoundException("Course not listed"));

        // Récupération de la spécialité existante
        Speciality speciality = specialityRepository.findByName(addSpecialityRequest.getSpecialityName())
                .orElseThrow(() -> new EntityNotFoundException("Speciality doesn't exist"));
        
        if (!speciality.isActived() ) {
           	throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This Speciality cannot be added it has been disabled.");
           }

        // Vérifier si la liste des spécialités est null, sinon ajouter
        if (course.getSpecialityList() == null) {
            course.setSpecialityList(new ArrayList<>());
        }

        // Éviter les doublons
        if (!course.getSpecialityList().contains(speciality)) {
            course.getSpecialityList().add(speciality);
        }

        // Sauvegarder le cours mis à jour
        courseRepository.save(course);
        speciality.setCourse(course);
        specialityRepository.save(speciality);

        return "Speciality added to course successfully.";
    }
    
    public PageResponse<SpecialityResponse> getAllSpecialityOfCourse(SpecialityCourseRequest specialityCourseRequest,int offset, int pageSize, String field, boolean order){
    	Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();
    	
    	Page<Speciality> list = specialityRepository.findAllByCourseId(specialityCourseRequest.getCourseId(), PageRequest.of(offset, pageSize, sort));
    	
    	 List<SpecialityResponse> specialityResponses = list.getContent().stream().map(speciality->SpecialityResponse.builder()
    		        .id(speciality.getId())
    		        .name(speciality.getName())
    		        .description(speciality.getDescription())
    		        .build()).toList();

    		       
    		        return new PageResponse<>(
    		            specialityResponses,
    		            list.getNumber(),
    		            list.getSize(),
    		            list.getTotalElements(),
    		            list.getTotalPages(),
    		            list.isFirst(),
    		            list.isLast()
    		        );
    }
    
    public void toggleSpeciality(String name, Authentication connectedUser) {
    	
    	User user =(User) connectedUser.getPrincipal();
        Speciality speciality = specialityRepository.findByName(name).orElseThrow(() -> new EntityNotFoundException("Course not found"));
        
        if(speciality.isActived()){
        	speciality.setActived(false);
        	speciality.setArchived(true);
            
        }else{
        	speciality.setActived(true);
        	speciality.setArchived(false);
        }
        speciality.setLastModifiedBy(user.getIdUser());
        speciality.setLastModifiedDate(LocalDateTime.now());
        specialityRepository.save(speciality);
    }
    public String updateSpeciality(UpdateSpecialityRequest updateSpecialityRequest,  Authentication connectedUser) {
    	
   	 User user = ((User) connectedUser.getPrincipal());

   	Speciality speciality = specialityRepository.findById(updateSpecialityRequest.getId()).orElseThrow(() -> new EntityNotFoundException("Course not found"));
       
       if (!speciality.isActived() ) {
       	throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This Speciality cannot be updated.");
       }

       speciality.setName(updateSpecialityRequest.getName());
       speciality.setCode(updateSpecialityRequest.getCode());
       speciality.setDescription(updateSpecialityRequest.getDescription());
       speciality.setLastModifiedBy(user.getIdUser());
       speciality.setLastModifiedDate(LocalDateTime.now());

       specialityRepository.save(speciality);
       return speciality.getName();
   }
    public SpecialityResponse findByName(String name) {
        Speciality speciality = specialityRepository.findByName(name).orElseThrow(() -> new EntityNotFoundException("Speciality not found"));
        
        if (!speciality.isActived()) {
            return SpecialityResponse.builder()
            	.id(speciality.getId())
                .name(speciality.getName())
                .code(speciality.getCode())
                .description("This Course was already deleted.")
                .build();
        }
        
        return SpecialityResponse.builder()
        	.id(speciality.getId())
            .name(speciality.getName())
            .code(speciality.getCode())
            .description(speciality.getDescription())
            .build();
    }
}


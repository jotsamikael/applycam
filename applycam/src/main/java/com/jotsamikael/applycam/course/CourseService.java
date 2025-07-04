package com.jotsamikael.applycam.course;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.jotsamikael.applycam.common.PageResponse;
import com.jotsamikael.applycam.promoter.Promoter;
import com.jotsamikael.applycam.promoter.PromoterRepository;
import com.jotsamikael.applycam.speciality.Speciality;
import com.jotsamikael.applycam.speciality.SpecialityRepository;
import com.jotsamikael.applycam.user.User;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourseService {

	private final CourseRepository courseRepository;
	
	private final SpecialityRepository specialityRepository;

    public String createCourse(CreateCourseRequest createCourseRequest,  Authentication connectedUser) {

		User user = ((User) connectedUser.getPrincipal());
		
		 if(courseRepository.existsByName(createCourseRequest.getName())) {
    		 throw new DataIntegrityViolationException("Subject already created");
    	 };

		 
		var course = Course.builder()
		.name(createCourseRequest.getName())
		.code(createCourseRequest.getCode())
		.description(createCourseRequest.getDescription())
		.createdBy(user.getIdUser())
	    .createdDate(LocalDateTime.now())
	    .isActived(true)
        .isArchived(false)
		.build();

		courseRepository.save(course);
		return course.getName();
		
    }
    
    public String updateCourse(CourseRequest courseRequest,  Authentication connectedUser) {
    	
    	 User user = ((User) connectedUser.getPrincipal());

        Course course = courseRepository.findById(courseRequest.getId()).orElseThrow(() -> new EntityNotFoundException("Course not found"));
        
        if (!course.isActived() ) {
        	throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This Course cannot be updated.");
        }

        course.setName(courseRequest.getName());
        course.setCode(courseRequest.getCode());
        course.setDescription(courseRequest.getDescription());
        course.setLastModifiedBy(user.getIdUser());
        course.setLastModifiedDate(LocalDateTime.now());

        courseRepository.save(course);
        return course.getName();
    }
    
    public PageResponse<CourseResponse> getAllCourses( int offset, int pageSize, String field, boolean order) {
        Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();
        Page<Course> courses = courseRepository.findAll(PageRequest.of(offset, pageSize, sort));
        
        List<CourseResponse> courseResponses = courses.getContent().stream()
            .map(course -> CourseResponse.builder()
                .name(course.getName())
                .code(course.getCode())
                .description(course.getDescription())
                .build())
            .toList();

        return new PageResponse<>(
        		courseResponses,
        		courses.getNumber(),
        		courses.getSize(),
        		courses.getTotalElements(),
        		courses.getTotalPages(),
        		courses.isFirst(),
        		courses.isLast()
        		);
    }
    
    public CourseResponse findByName(String name) {
        Course course = courseRepository.findByName(name).orElseThrow(() -> new EntityNotFoundException("Course not found"));
        
        if (!course.isActived()) {
            return CourseResponse.builder()
                .name(course.getName())
                .code(course.getCode())
                .description("This Course was already deleted.")
                .build();
        }
        
        return CourseResponse.builder()
            .name(course.getName())
            .code(course.getCode())
            .description(course.getDescription())
            .build();
    }
    
    
    
    public void toggleCourse(String name, Authentication connectedUser) {
    	
    	User user =(User) connectedUser.getPrincipal();
        Course course = courseRepository.findByName(name).orElseThrow(() -> new EntityNotFoundException("Course not found"));
        if(course.isActived()){
            course.setActived(false);
            course.setArchived(true);
            
        }else{
            course.setActived(true);
            course.setArchived(false);
        }
        course.setLastModifiedBy(user.getIdUser());
        course.setLastModifiedDate(LocalDateTime.now());
        courseRepository.save(course);
    }
    
    /*public Map<String, Object> getCoursesBySpecialit( CourseRequest  courseRequest,int offset, int pageSize, String field, boolean order) {
    	 Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();
    	 
        Speciality speciality = specialityRepository.findById(courseRequest.getSpecialityiId())
            .orElseThrow(() -> new EntityNotFoundException("Speciality not found   " ));
        
        
        Page<Course> coursesPage = courseRepository.findBySpecialityId(courseRequest.getSpecialityiId(),  PageRequest.of(offset, pageSize,sort));
        
        List<CourseResponse> courseResponses = coursesPage.getContent().stream()
            .map(course -> CourseResponse.builder()
                .name(course.getName())
                .code(course.getCode())
                .description(course.getDescription())
                .build())
            .toList();
        
        Map<String, Object> response = new HashMap<>();
        response.put("speciality", speciality);
        response.put("courses", courseResponses);
        response.put("currentPage", coursesPage.getNumber());
        response.put("totalPages", coursesPage.getTotalPages());
        response.put("totalElements", coursesPage.getTotalElements());
        
        return response;
    }*/
}

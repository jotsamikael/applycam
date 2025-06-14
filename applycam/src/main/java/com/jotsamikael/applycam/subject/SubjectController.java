package com.jotsamikael.applycam.subject;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jotsamikael.applycam.common.PageResponse;
import com.jotsamikael.applycam.course.CourseRequest;
import com.jotsamikael.applycam.course.CourseResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;

    @PostMapping("/add-Subject")
    public ResponseEntity<String> addSubjectBySpecialityId(@RequestBody 
      @Valid SubjectRequest subjectRequest) {

        return ResponseEntity.ok(subjectService.addSubjectBySpecialityId(subjectRequest));

    }
    
    @GetMapping("/get-all")
    public ResponseEntity<PageResponse<SubjectResponse>> getAllCourse(
      @RequestBody SubjectRequest subjectRequest,
      @RequestParam(defaultValue="0", required=false) int offset,
      @RequestParam(defaultValue = "10", required = false) int pageSize,
      @RequestParam(defaultValue= "name", required= false) String field,
      @RequestParam(defaultValue = "true", required= false) boolean order
    ){
      return ResponseEntity.ok(subjectService.getAllSubjectOfSpeciality(subjectRequest, offset, pageSize, field, order));
    }
    
    @PostMapping("/create-subject")
    public ResponseEntity<String> createSubject(@RequestBody @Valid CreateSubjectRequest createCourseRequest, Authentication connectedUser){
      return ResponseEntity.ok(subjectService.createSubject(createCourseRequest,connectedUser));
    }
    @PatchMapping
    public ResponseEntity<String> updateSubject(@RequestBody @Valid UpdateSubjectRequest updatesubjectRequest,Authentication connectedUser){
    	
    	return ResponseEntity.ok(subjectService.updateSubject(updatesubjectRequest, connectedUser));
    	
    }
    
    @GetMapping("/findByName/{name}")
    public ResponseEntity<SubjectResponse> findByName(
        @PathVariable String name){

        
    return ResponseEntity.ok(subjectService.findByName(name));
        }
    
    @PatchMapping("/update-subject")
    public ResponseEntity<String> updateCourse(@RequestBody UpdateSubjectRequest updateSubjectRequest,
     Authentication connectedUser) {
        subjectService.updateSubject(updateSubjectRequest,  connectedUser);
        return ResponseEntity.status(HttpStatus.OK).build();
 }
    	
    @PatchMapping("/toggle-subject/{name}")
	 public ResponseEntity<?> toogleCourse(
			 @PathVariable String name,
			 Authentication connectedUser){
		 
		 subjectService.toggleSubject(name, connectedUser);
		 
		 return ResponseEntity.ok().build();
	 }
    
}


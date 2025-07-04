package com.jotsamikael.applycam.course;

import java.util.Map;

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

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("course-management")
@Tag(name = "course")
public class CourseController {
	

	private final CourseService courseService;
	

	@PostMapping("/create-course")
    public ResponseEntity<String> createCourse(@RequestBody CreateCourseRequest createCourseRequest,
     Authentication connectedUser) {
        courseService.createCourse(createCourseRequest,  connectedUser);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
	
	 @PatchMapping("/update-course")
	    public ResponseEntity<String> updateCourse(@RequestBody CourseRequest courseRequest,
	     Authentication connectedUser) {
	        courseService.updateCourse(courseRequest,  connectedUser);
	        return ResponseEntity.status(HttpStatus.OK).build();
	 }
	
	 @GetMapping("/get-all")
	    public ResponseEntity<PageResponse<CourseResponse>> getCourses(
	        @RequestParam(name = "offset", defaultValue = "0", required = false) int offset,
	        @RequestParam(name = "pageSize", defaultValue = "10", required = false) int pageSize,
	        @RequestParam(name = "field", defaultValue = "name", required = false) String field,
	        @RequestParam(name = "order", defaultValue = "true", required = false) boolean order) {
	        PageResponse<CourseResponse> response = courseService.getAllCourses(offset, pageSize, field, order);
	        return ResponseEntity.ok(response);
	    }
	 
	 @GetMapping("/findByName/{name}")
	    public ResponseEntity<CourseResponse> findByName(
	        @PathVariable String name){

	        
	    return ResponseEntity.ok(courseService.findByName(name));
	        }
	 
	 @PatchMapping("/toggle-course/{name}")
	 public ResponseEntity<?> toogleCourse(
			 @PathVariable String name,
			 Authentication connectedUser){
		 
		 courseService.toggleCourse(name, connectedUser);
		 
		 return ResponseEntity.ok().build();
	 }
	 
	 
    
  /*  @GetMapping("/by-speciality/{specialityId}")
    public ResponseEntity<Map<String, Object>> getCoursesBySpeciality(
            @RequestBody CourseRequest courseRequest,
            @RequestParam(name = "offset", defaultValue = "0", required = false) int offset,
            @RequestParam(name = "pageSize", defaultValue = "10", required = false) int pageSize,
            @RequestParam(name = "field", defaultValue = "name", required = false) String field,
            @RequestParam(name = "order", defaultValue = "true", required = false) boolean order) {
            	
        Map<String, Object> response = courseService.getCoursesBySpecialit(courseRequest, offset, pageSize, field, order);
        return ResponseEntity.ok(response);
    }*/
	
	
	

}

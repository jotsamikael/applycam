package com.jotsamikael.applycam.speciality;

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
@RequestMapping("/specialities")
@RequiredArgsConstructor
public class SpecialityController {

    private final SpecialityService specialityService;

    @PatchMapping("/add-speciality-totrainingCenter")
    public ResponseEntity<String> addSpeciality(@RequestBody @Valid SpecialityRequest specialityRequest) {

        return ResponseEntity.ok(specialityService.addSpecialitybyTrainingCenterId(specialityRequest));

    }
    
    @GetMapping("/get-by-trainingcenter")
    public ResponseEntity<PageResponse<SpecialityResponse>> getAllSpecialityByTrainingCenter(
        @RequestBody SpecialityRequest specialityRequest,
        @RequestParam(defaultValue = "0", required = false) int offset,
        @RequestParam(defaultValue = "10", required = false) int pageSize,
        @RequestParam(defaultValue = "name", required = false) String field,
        @RequestParam(defaultValue = "true", required = false) boolean order
    ){

    return ResponseEntity.ok(specialityService.getallSpecialityOfTrainingCenter(specialityRequest,offset,pageSize, field,order));
    }
    
    @GetMapping("/get-by-course")
    public ResponseEntity<PageResponse<SpecialityResponse>> getAllSpecialityOfCourse(
        @RequestBody SpecialityCourseRequest specialityCourseRequest,
        @RequestParam(defaultValue = "0", required = false) int offset,
        @RequestParam(defaultValue = "10", required = false) int pageSize,
        @RequestParam(defaultValue = "name", required = false) String field,
        @RequestParam(defaultValue = "true", required = false) boolean order
    ){

    return ResponseEntity.ok(specialityService.getAllSpecialityOfCourse(specialityCourseRequest,offset,pageSize, field,order));
    }
    
    @PostMapping("/create")
    public ResponseEntity<String> createSpeciality(@RequestBody @Valid CreateSpecialityRequest createSpecialityRequest,
    		Authentication connectedUser) {
    	
        return ResponseEntity.ok(specialityService.createSpeciality(createSpecialityRequest,connectedUser));
    }
    

    @GetMapping("/get-all")
    public ResponseEntity<PageResponse<SpecialityResponse>> getall( 
        @RequestParam(name = "offset", defaultValue = "0", required = false) int offset,
        @RequestParam(name = "pageSize", defaultValue = "10", required = false) int pageSize,
        @RequestParam(name = "field", defaultValue = "name", required = false) String field,
        @RequestParam(name = "order", defaultValue = "true", required = false) boolean order
){
    return ResponseEntity.ok(specialityService.getAllSpeciality( offset, pageSize, field, order));

}
    @PatchMapping("/update-speciality")
    public ResponseEntity<String> updateCourse(@RequestBody UpdateSpecialityRequest updateSpecialityeRequest,
     Authentication connectedUser) {
        specialityService.updateSpeciality(updateSpecialityeRequest,  connectedUser);
        return ResponseEntity.status(HttpStatus.OK).build();
 }
    
    @PatchMapping("/toggle-Speciality/{name}")
	 public ResponseEntity<?> toogleCourse(
			 @PathVariable String name,
			 Authentication connectedUser){
		 
		 specialityService.toggleSpeciality(name, connectedUser);
		 
		 return ResponseEntity.ok().build();
	 }
    
    
    @PatchMapping("/add-speciality-to-course")
    public ResponseEntity<String> addSpecialityToCourse(@RequestBody @Valid AddSpecialityRequest addSpecialityRequest) {

        return ResponseEntity.ok(specialityService.addSpecialityToCourse(addSpecialityRequest));

    }
    
    
    @GetMapping("/findByName/{name}")
    public ResponseEntity<SpecialityResponse> findByName(
        @PathVariable String name){

        
    return ResponseEntity.ok(specialityService.findByName(name));
        }
    


}
package com.jotsamikael.applycam.examCenter;

import java.time.LocalDate;
import java.util.List;

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

import com.jotsamikael.applycam.candidate.CandidateRepository;
import com.jotsamikael.applycam.common.PageResponse;
import com.jotsamikael.applycam.session.CreateSessionRequest;
import com.jotsamikael.applycam.session.SessionResponse;
import com.jotsamikael.applycam.session.UpdateSessionRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("assignment")
@RequiredArgsConstructor
public class ExamCenterController {
	
	 private final ExamService examService;

	    @PostMapping("/assign-exam-center/{id}")
	    public ResponseEntity<Void> assignExamCenter(@PathVariable Long id) {
	        examService.assignRandomExamCenterToCandidate(id);
	        return ResponseEntity.ok().build();
	    }
	    
	    @PostMapping("/create")
	    public ResponseEntity<String> createExamCenter(@RequestBody @Valid CreateCenterRequest createCenterRequest,
	    		Authentication connectedUser) {
	    	
	        return ResponseEntity.ok(examService.createExamCenter(createCenterRequest,connectedUser));
	    }
	    
	    @GetMapping("/findBy-division/{division}")
	    public ResponseEntity<PageResponse<ExamCenterResponse>> findByName(
	        @PathVariable String division,
	        @RequestParam(defaultValue = "0", required = false) int offset,
	        @RequestParam(defaultValue = "10", required = false) int pageSize,
	        @RequestParam(defaultValue = "name", required = false) String field,
	        @RequestParam(defaultValue = "true", required = false) boolean order){

	        
	    return ResponseEntity.ok(examService.findExamCenterByDivision(division,offset,pageSize, field,order));
	        }
	    @GetMapping("/get-all")
	    public ResponseEntity<PageResponse<ExamCenterResponse>> getAllExamCenters(
	            @RequestParam(defaultValue = "0") int offset,          // page offset
	            @RequestParam(defaultValue = "10") int pageSize,          // page size
	            @RequestParam(defaultValue = "name") String field,     // field to sort by
	            @RequestParam(defaultValue = "true") boolean order      // true for ascending, false for descending
	    ) {
	        return ResponseEntity.ok(examService.getAllExamCenter(offset,pageSize, field,order));
	    }
	    
	    @PatchMapping("/delete-Center/{examCenterId}")
		 public ResponseEntity<?> deleteSession(
				 @PathVariable Long examCenterId,
				 Authentication connectedUser){
			 
			 examService.deleteExamCenter(examCenterId, connectedUser);
			 
			 return ResponseEntity.ok().build();
		 }
	    
	    @PatchMapping("/update-Center")
	    public ResponseEntity<Long> updateExamCenter(@RequestBody UpdateCenterRequest updateCenterRequest,
	     Authentication connectedUser) {
	        
	        return ResponseEntity.ok(examService.updateExamCenter(updateCenterRequest,  connectedUser));
	 }
	    

}

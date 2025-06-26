package com.jotsamikael.applycam.application;


import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jotsamikael.applycam.common.PageResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("application")
@Tag(name = "application")
public class ApplicationController {
	
	 private final ApplicationService service;

    @PostMapping("/PersonalInformation")
    public ResponseEntity<?> candidateAppliance(
        @RequestBody @Valid ApplicationRequest request,
        Authentication connectedUser
    ) {
    	service.applyPersonalInfo(request, connectedUser);
        return ResponseEntity.ok().build();
    }
    
    @PatchMapping(value="/PersonalInformation/documents",consumes="multipart/form-data")
    public ResponseEntity<?> uploadCandidateFile(@RequestParam MultipartFile cniFile,Authentication connectedUser,
    		@RequestParam MultipartFile birthCertificate,
    		@RequestParam MultipartFile diplomFile,
    		@RequestParam MultipartFile photo,
    		@RequestParam(required=false) MultipartFile oldApplyanceFile,
    		@RequestParam(required=false) MultipartFile stageCertificate,
    		@RequestParam(required=false) MultipartFile cv,
    		@RequestParam(required=false) MultipartFile financialJustification,
    		@RequestParam(required=false) MultipartFile letter){
    	service.uploadCandidateFile(cniFile,connectedUser,birthCertificate,diplomFile,photo,oldApplyanceFile,stageCertificate,cv,
    			financialJustification,letter);
    	return  ResponseEntity.accepted().build();	
    }
    
    
    
    
    @PatchMapping("/validate/{id}")
    public ResponseEntity<String> validateApplication(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            String result = service.validateApplication(authentication, id);
            return ResponseEntity.ok(result);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'envoi de l'email : " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur inattendue : " + e.getMessage());
        }
    }
    
    @PostMapping("/reject/{id}")
    public ResponseEntity<String> rejectApplication(
            @PathVariable Long id,
            @RequestParam String comment,
            Authentication authentication) {
        try {
            String result = service.rejectApplication(authentication, id, comment);
            return ResponseEntity.ok(result);
        } catch (MessagingException e) {
            return ResponseEntity.status(500).body("Erreur lors de l'envoi de l'email : " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur : " + e.getMessage());
        }
    }
    
    
    @GetMapping("/get-all")
    public ResponseEntity<PageResponse<ApplicationResponse>> getAllApplications(
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "id") String field,
            @RequestParam(defaultValue = "true") boolean order) {
        
        PageResponse<ApplicationResponse> response = service.getAllApplications(offset, pageSize, field, order);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/get-application-By-candidate")
    public ResponseEntity<List<ApplicationResponse>> searchApplicationsByCandidateName(
            @RequestParam String name) {
        
        List<ApplicationResponse> applications = service.findApplicationsByCandidateName(name);
        return ResponseEntity.ok(applications);
    }
    
    @GetMapping("/my-applications")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications(Authentication authentication) {
        
        List<ApplicationResponse> applications = service.findApplicationsOfConnectedCandidate(authentication);
        return ResponseEntity.ok(applications);
    }
    
    @PatchMapping("/delete/{applicationId}")
    public ResponseEntity<Void> deleteApplication(
            @PathVariable Long applicationId,
            Authentication authentication) {
        
        service.deleteApplication(applicationId, authentication);
        return ResponseEntity.noContent().build();
    }

    
    
}

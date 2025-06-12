package com.jotsamikael.applycam.application;


import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
    
    @PostMapping(value="/PersonalInformation/documents",consumes="multipart/form-data")
    public ResponseEntity<?> uploadCandidateFile(@RequestParam MultipartFile cniFile, Authentication connectedUser){
    	service.uploadCandidateFile(cniFile,connectedUser);
    	return  ResponseEntity.accepted().build();	
    }
}

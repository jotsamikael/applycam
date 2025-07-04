package com.jotsamikael.applycam.application;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("application")
@Tag(name = "application")
public class ApplicationController {
	
	 private final ApplicationService service;

    @PostMapping("/apply/PersonalInformation")
    public ResponseEntity<?> candidateAppliance(
        @RequestBody @Valid ApplicationRequest request,
        Authentication connectedUser
    ) {
    	service.applyPersonalInfo(request, connectedUser);
        return ResponseEntity.ok().build();
    }
}

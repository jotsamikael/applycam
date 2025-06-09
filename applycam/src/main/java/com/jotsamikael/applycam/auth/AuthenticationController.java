package com.jotsamikael.applycam.auth;

import com.jotsamikael.applycam.promoter.CreatePromoterAndCenterRequest;
import com.jotsamikael.applycam.promoter.CreatePromoterRequest;
import com.jotsamikael.applycam.promoter.PromoterService;
import com.jotsamikael.applycam.trainingCenter.CreateTainingCenterRequest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

@RestController
@RequestMapping("auth")
@RequiredArgsConstructor
@Tag(name = "Authentication")
public class AuthenticationController {

    private final AuthenticationService service;
    private final PromoterService promoterService;


    @PostMapping(value="/candidate-register", consumes = "multipart/form-data")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> register(
    		@ModelAttribute  @Valid CandidateRegistrationRequest request
    ) throws MessagingException {
        try {
            //System.out.println(request);
            service.register(request);
            return ResponseEntity.accepted().build();
        } catch (ConstraintViolationException e) {
            throw new MessagingException("Invalid input provided", e);
        }
    }

    @PostMapping(value="/promoter-register",consumes = "multipart/form-data")
    @Operation(summary = "Enregistrer un promoteur avec centre de formation",
    requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
        content = @Content(
            mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
            schema = @Schema(implementation = CreatePromoterAndCenterRequest.class)
        )
    )
)
    
    public ResponseEntity<?> createPromoter(
    		@ModelAttribute @Valid CreatePromoterAndCenterRequest request,
    		Authentication connectedUser
    ) throws MessagingException {
        promoterService.createPromoter(connectedUser,request);
        return ResponseEntity.accepted().build();
    }


    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody @Valid AuthenticationRequest request
    ){
        return  ResponseEntity.ok(service.authenticate(request));
    }

    @GetMapping("/activate-account")
    public void confirm(
            @RequestParam String token
    ) throws MessagingException {
        service.activateAccount(token);
    }

}

package com.jotsamikael.applycam.auth;

import com.jotsamikael.applycam.promoter.CreatePromoterRequest;
import com.jotsamikael.applycam.promoter.PromoterService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("auth")
@RequiredArgsConstructor
@Tag(name = "Authentication")
public class AuthenticationController {

    private final AuthenticationService service;
    private final PromoterService promoterService;


    @PostMapping("/candidate-register")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> register(
            @RequestBody @Valid CandidateRegistrationRequest request
    ) throws MessagingException {
        try {
            //System.out.println(request);
            service.register(request);
            return ResponseEntity.accepted().build();
        } catch (ConstraintViolationException e) {
            throw new MessagingException("Invalid input provided", e);
        }
    }

    @PostMapping("/promoter-register")
    public ResponseEntity<?> createStaff(
            @RequestBody() @Valid CreatePromoterRequest request
    ) throws MessagingException {
        promoterService.createPromoter(request);
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

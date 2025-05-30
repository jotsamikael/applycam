package com.jotsamikael.applycam.candidate;

import com.jotsamikael.applycam.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("candidate")
@Tag(name = "candidate")
public class CandidateController {

    private final CandidateService candidateService;


    @GetMapping("/get-all")
    public ResponseEntity<PageResponse<CandidateResponse>> getAllCandidates(
            @RequestParam(defaultValue = "0", required = false) int offset,
            @RequestParam(defaultValue = "10", required = false) int pageSize,
            @RequestParam(defaultValue = "name", required = false) String field,
            @RequestParam(defaultValue = "true", required = false) boolean order
    ) {
        return ResponseEntity.ok(candidateService.getAllCandidates(offset, pageSize, field, order));
    }

    @GetMapping("/find-by-email")
    public ResponseEntity<CandidateResponse> findCandidateByEmail(
            @RequestParam(required = false) String email) {
        return ResponseEntity.ok(candidateService.findCandidateByEmail(email));
    }

    @PatchMapping("/update/{email}")
    public ResponseEntity<String> updateCandidate(@PathVariable String email,
                                                @RequestBody CandidateRequest request,
                                                Authentication connectedUser) {
        return ResponseEntity.ok(candidateService.updateProfile(email, request,connectedUser));
    }
    
    @GetMapping("get-promoter-candidates/{year}")
    public ResponseEntity<PageResponse<CandidateResponse>> getCandidatesOfConnectedpromoterid(
            Authentication connectedUser,
            @PathVariable("year") int year,
            @RequestParam(defaultValue = "0", required = false) int offset,
            @RequestParam(defaultValue = "10", required = false) int pageSize,
            @RequestParam(defaultValue = "name", required = false) String field,
            @RequestParam(defaultValue = "true", required = false) boolean order
    ) {
        return ResponseEntity.ok(candidateService.getCandidatesOfConnectedPromoter(connectedUser,year,offset, pageSize, field, order));
    }
    
    @GetMapping("/find")
    public ResponseEntity<CandidateResponse> findCandidate(
        @RequestParam(required= true) Long promoterId,
        @RequestParam(required = true) String name
    ){
    return ResponseEntity.ok(candidateService.findByName(promoterId, name));
    }
    
    @PatchMapping("toggleCandidate/{email}")
    public ResponseEntity<Void> toggleCandidate(
            @PathVariable String email,
            Authentication connectedUser
    ) {
        candidateService.toggleCandidate(email, connectedUser);
        return ResponseEntity.ok().build();
    }

}

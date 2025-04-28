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
            @RequestParam(name = "offset", defaultValue = "0", required = false) int offset,
            @RequestParam(name = "pageSize", defaultValue = "10", required = false) int pageSize,
            @RequestParam(name = "field", defaultValue = "name", required = false) String field,
            @RequestParam(name = "order", defaultValue = "true", required = false) boolean order
    ) {
        return ResponseEntity.ok(candidateService.getAllCandidates(offset, pageSize, field, order));
    }

    @GetMapping("/find-by-email")
    public ResponseEntity<CandidateResponse> findCandidateByEmail(
            @RequestParam(name = "email", required = false) String email) {
        return ResponseEntity.ok(candidateService.findCandidateByEmail(email));
    }

    @PatchMapping()
    public ResponseEntity<String> updateCandidate(@PathVariable String email,
                                                @RequestBody CandidateRequest request,
                                                Authentication connectedUser) {
        return ResponseEntity.ok(candidateService.updateProfile(email, request,connectedUser));
    }

}

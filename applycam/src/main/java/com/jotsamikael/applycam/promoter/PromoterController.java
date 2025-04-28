package com.jotsamikael.applycam.promoter;

import com.jotsamikael.applycam.common.PageResponse;
import com.jotsamikael.applycam.staff.CreateStaffRequest;
import com.jotsamikael.applycam.staff.StaffResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("promoter")
@Tag(name = "promoter")
public class PromoterController {
    private final PromoterService promoterService;



    @GetMapping("/get-all")
    public ResponseEntity<PageResponse<PromoterResponse>> getAllStaffs(
            @RequestParam(name = "offset", defaultValue = "0", required = false) int offset,
            @RequestParam(name = "pageSize", defaultValue = "10", required = false) int pageSize,
            @RequestParam(name = "field", defaultValue = "firstname", required = false) String field,
            @RequestParam(name = "order", defaultValue = "true", required = false) boolean order
    ) {
        return ResponseEntity.ok(promoterService.getAllPromoter(offset, pageSize, field, order));
    }

    @GetMapping("/find-by-email")
    public ResponseEntity<PromoterResponse> findStaffByEmail(
            @RequestParam(name = "email", required = false) String email) {
        return ResponseEntity.ok(promoterService.findPromoterByEmail(email));
    }

    @PatchMapping("/update-promoter")
    public ResponseEntity<String> updatePromoter(@PathVariable String email,
                                              @RequestBody CreatePromoterRequest request,
                                              Authentication connectedUser) {
        return ResponseEntity.ok(promoterService.updateProfile(email, request,connectedUser));
    }

    @PatchMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@PathVariable String email,
                                                 Authentication connectedUser) throws MessagingException {
        return ResponseEntity.ok(promoterService.resetPassword(email,connectedUser));
    }
}

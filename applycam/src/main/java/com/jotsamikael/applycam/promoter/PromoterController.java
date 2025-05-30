package com.jotsamikael.applycam.promoter;

import com.jotsamikael.applycam.common.PageResponse;
import com.jotsamikael.applycam.staff.CreateStaffRequest;
import com.jotsamikael.applycam.staff.StaffResponse;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("promoter")
@Tag(name = "promoter")
public class PromoterController {
    private final PromoterService promoterService;


    //to Get all the promoter who ever existed
    @GetMapping("/get-all")
    public ResponseEntity<PageResponse<PromoterResponse>> getAllStaffs(
            @RequestParam(defaultValue = "0", required = false) int offset,
            @RequestParam(defaultValue = "10", required = false) int pageSize,
            @RequestParam(defaultValue = "firstname", required = false) String field,
            @RequestParam(defaultValue = "true", required = false) boolean order
    ) {
        return ResponseEntity.ok(promoterService.getAllPromoter(offset, pageSize, field, order));
    }
    
    //to find a promoter by email we use a request param the url will be like this ?email=
    @GetMapping("/find-by-email")
    public ResponseEntity<PromoterResponse> findStaffByEmail(
            @RequestParam(required = true) String email) {
        return ResponseEntity.ok(promoterService.findPromoterByEmail(email));
    }
    
    //to update a promoter by fetching his email first
    @PatchMapping("/update-promoter/{email}")
    public ResponseEntity<String> updatePromoter(@PathVariable String email,
                                              @RequestBody CreatePromoterRequest request,
                                              Authentication connectedUser) {
        return ResponseEntity.ok(promoterService.updateProfile(email, request,connectedUser));
    }
    
    //To Reset the password 
    @PatchMapping("/reset-password/{email}")
    public ResponseEntity<String> resetPassword(@PathVariable String email,
                                                 Authentication connectedUser) throws MessagingException {
        return ResponseEntity.ok(promoterService.resetPassword(email,connectedUser));
    }
    
    @PatchMapping("togglePromoterActivation/{email}")
    public ResponseEntity<Void> togglePromoter(
            @PathVariable String email,
            Authentication connectedUser
    ) {
        promoterService.togglePromoter(email, connectedUser);
        return ResponseEntity.ok().build();
    }
   // @PostMapping(value="nationalId/{validUntil}", consumes = "multipart/form-data")
   /* public ResponseEntity<?>nationalIdCardFileUpload(
    		 @RequestParam("validUntil") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate validUntil,
            @RequestParam String nationalIdNumber,
            @Parameter(description = "idCard file Upload")
            @RequestParam MultipartFile file,
            Authentication connectedUser
    ){
        promoterService.nationalIdCardFileUpload(file,connectedUser,validUntil,nationalIdNumber);
        return  ResponseEntity.accepted().build();
    }*/

   
}

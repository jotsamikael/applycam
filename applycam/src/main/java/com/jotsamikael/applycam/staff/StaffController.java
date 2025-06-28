package com.jotsamikael.applycam.staff;


import com.jotsamikael.applycam.candidate.CandidateRequest;
import com.jotsamikael.applycam.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("staff")
@Tag(name = "staff")
public class StaffController {

    private final StaffService staffService;

    @PostMapping("/create-staff")
    public ResponseEntity<String> createStaff(
            @RequestBody() @Valid CreateStaffRequest request,
            Authentication connectedUser
    ) {
        return ResponseEntity.ok(staffService.createStaff(request, connectedUser));
    }

    @GetMapping("/getAll")
    public ResponseEntity<PageResponse<StaffResponse>> getAllStaffs(
            @RequestParam(defaultValue = "0", required = false) int offset,
            @RequestParam(defaultValue = "10", required = false) int pageSize,
            @RequestParam(defaultValue = "name", required = false) String field,
            @RequestParam(defaultValue = "true", required = false) boolean order
    ) {
        return ResponseEntity.ok(staffService.getAllStaff(offset, pageSize, field, order));
    }

    @GetMapping("/find-by-email")
    public ResponseEntity<StaffResponse> findStaffByEmail(
            @RequestParam(required = true) String email) {
        return ResponseEntity.ok(staffService.findStaffByEmail(email));
    }

    @PatchMapping("/update-staff/")
    public ResponseEntity<String> updateStaff( @RequestBody CreateStaffRequest request,
                                                  Authentication connectedUser) {
        return ResponseEntity.ok(staffService.updateProfile(request,connectedUser));
    }
    
    @PatchMapping("/toggle-staff/{fullName}")
	 public ResponseEntity<?> toogleStaff(
			 @PathVariable String fullName,
			 Authentication connectedUser){
		 
		 staffService.deleteStaff(fullName, connectedUser);
		 
		 return ResponseEntity.ok().build();
	 }

}

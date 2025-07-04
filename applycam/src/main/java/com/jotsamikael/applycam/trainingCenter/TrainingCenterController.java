package com.jotsamikael.applycam.trainingCenter;

import com.jotsamikael.applycam.common.ContentStatus;
import com.jotsamikael.applycam.common.PageResponse;
import com.jotsamikael.applycam.promoter.CreatePromoterRequest;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("trainingcenter")
@Tag(name = "trainingcenter")
public class TrainingCenterController {

    private final TrainingCenterService service;

    //This endpoint allows the connected use who has to be a promoter to create a training center
    @PostMapping("create-training-center")
    public ResponseEntity<String> createTrainingCenter(
            @RequestBody() @Valid CreateTainingCenterRequest request,
            Authentication connectedUser
    ) {
        return ResponseEntity.ok(service.createTrainingCenter(request, connectedUser));
    }

    //This endpoint gets a single training center based on agreement number
    @GetMapping("get-training-by-agreement-number")
    public ResponseEntity<TrainingCenterResponse> getTrainingCenterByAgreementNumber(
            @RequestParam(required = true) String agreementNumber
    ) {
        return ResponseEntity.ok(service.getTrainingCenterByAgreementNumber(agreementNumber));
    }

    //This endpoint gets all training centers of connected user (promoter)
    @GetMapping("get-training-centers-of-connected-promoter")
    public ResponseEntity<List<TrainingCenterResponse>> getTrainingCenterOfConnectedPromoter(
            Authentication connectedUser
    ) {
        return ResponseEntity.ok(service.getTrainingCenterOfConnectedPromoter(connectedUser));
    }

    //This endpoint gets all training centers for admin
    @GetMapping("get-all")
    public ResponseEntity<PageResponse<TrainingCenterResponse>> getAllTrainingCenters(
            @RequestParam(defaultValue = "0", required = false) int offset,
            @RequestParam(defaultValue = "10", required = false) int pageSize,
            @RequestParam(defaultValue = "fullName", required = false) String field,
            @RequestParam(defaultValue = "true", required = false) boolean order
    ) {
        return ResponseEntity.ok(service.getAllTrainingCenter(offset, pageSize, field, order));
    }

    //This endpoint uploads an agreement file
    @PostMapping(value="agreement/{agreement-number}", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadAgreementFile(
            @PathVariable("agreement-number") String agreementNumber,
            @Parameter(description = "Agreement file to upload")
            @RequestParam MultipartFile file,
            @RequestParam String fileType,
            Authentication connectedUser
    ){
        service.uploadAgreementFile(file,connectedUser, agreementNumber,fileType);
        return  ResponseEntity.accepted().build();
    }

   @GetMapping("/getAgreementStatus/{agreement-number}")
   public ResponseEntity<String> getAgreementStatus(
    @PathVariable("agreement-number") String agreementNumber,
    Authentication connectedUser
   ){
    return ResponseEntity.ok(service.getAgreementStatus(agreementNumber, connectedUser));
   }
   
   @PatchMapping("/update-trainingCenter/{fullname}")
   public ResponseEntity<String> updatePromoter(@PathVariable String fullname,
                                             @RequestBody UpdateTrainingCenterRequest request,
                                             Authentication connectedUser) {
       return ResponseEntity.ok(service.updateTrainingCenter(fullname, request,connectedUser));
   }
   
   @PatchMapping("/status/{fullName}")
   public ResponseEntity<String> changeStatus(
           @PathVariable String fullName,
           @RequestParam ContentStatus status,
           @RequestParam(required = false) String comment,
           Authentication connectedUser) {
       
       try {
           String result;
           if (status == ContentStatus.VALIDATED) {
               result = service.validateTrainingCenter(fullName,connectedUser);
           } else {
               result = service.changeTrainingCenterStatus(fullName, status, comment,connectedUser);
           }
           return ResponseEntity.ok(result);
       } catch (EntityNotFoundException e) {
           return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
       } catch (RuntimeException e) {
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
       }
   }
   
   
   
}

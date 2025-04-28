package com.jotsamikael.applycam.trainingCenter;

import com.jotsamikael.applycam.common.PageResponse;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
            @RequestParam(name = "agreementNumber", required = true) String agreementNumber
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
    public ResponseEntity<PageResponse<TrainingCenterResponse>> getTrainingCenterByAgreementNumber(
            @RequestParam(name = "offset", defaultValue = "0", required = false) int offset,
            @RequestParam(name = "pageSize", defaultValue = "10", required = false) int pageSize,
            @RequestParam(name = "field", defaultValue = "name", required = false) String field,
            @RequestParam(name = "order", defaultValue = "true", required = false) boolean order

    ) {
        return ResponseEntity.ok(service.getAllTrainingCenter(offset, pageSize, field, order));
    }

    //This endpoint uploads an agreement file
    @PostMapping(value="agreement/{agreement-number}", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadAgreementFile(
            @PathVariable("agreement-number") String agreementNumber,
            @Parameter()
            @RequestParam("file") MultipartFile file,
            Authentication connectedUser
    ){
        service.uploadAgreementFile(file,connectedUser, agreementNumber);
        return  ResponseEntity.accepted().build();
    }




}

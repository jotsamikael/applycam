package com.jotsamikael.applycam.campus;

import com.jotsamikael.applycam.common.PageResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("campus")
@Tag(name = "campus")
public class CampusController {

    private final CampusService campusService;

    //create campus
    @PostMapping
    public ResponseEntity<String> createCampus(CreateCampusRequest request, Authentication connectedUser) {

        return ResponseEntity.ok(campusService.createCampus(request, connectedUser));
    }

    //get all campuses of Training center
    @GetMapping("get-campus-by-training-center/{agreementNumber}")
    public ResponseEntity<List<CampusResponse>> findCampusByTrainingCenter(@PathVariable String agreementNumber) {
        return ResponseEntity.ok(campusService.findCampusByTrainingCenter(agreementNumber));
    }


    //get all campuses by town
    @GetMapping("get-campus-by-training-town/{town}")
    public ResponseEntity<PageResponse<CampusResponse>> findCampusByTown(@PathVariable String town,
                                                                         @RequestParam(defaultValue = "0", required = false) int offset,
                                                                         @RequestParam(defaultValue = "10", required = false) int pageSize,
                                                                         @RequestParam(defaultValue = "name", required = false) String field,
                                                                         @RequestParam(defaultValue = "true", required = false) boolean order) {
        return ResponseEntity.ok(campusService.findCampusByTown(offset, pageSize, field, order));


    }


}

package com.jotsamikael.applycam.trainingCenter.division;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("division")
@Tag(name = "division")
public class DivisionController {
    private final DivisionService service;

    @GetMapping("get-by-region/{region}")
    private ResponseEntity<List<Division>> getDivisionByRegion(
            @PathVariable String region
    ) {

      return ResponseEntity.ok(service.findByRegion(region));
    }
}

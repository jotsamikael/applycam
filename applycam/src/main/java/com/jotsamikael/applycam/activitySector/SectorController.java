package com.jotsamikael.applycam.activitySector;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jotsamikael.applycam.common.PageResponse;
import com.jotsamikael.applycam.course.CourseService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("activitySector-management")
@Tag(name = "activity-sector")
public class SectorController {
	
	private final SectorService activitySectorService;
	
	@PostMapping("/create")
    public ResponseEntity<String> createActivitySector(@RequestBody @Valid CreateActivitySectorRequest request,
                                                       Authentication authentication) {
        String response = activitySectorService.createActivitySector(request, authentication);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/update/{name}")
    public ResponseEntity<String> updateActivitySector(@PathVariable String name,
                                                       @RequestBody @Valid CreateActivitySectorRequest request,
                                                       Authentication authentication) {
        String response = activitySectorService.updateActivitySector(name, request, authentication);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        activitySectorService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/all")
    public ResponseEntity<PageResponse<ActivitySectorResponse>> findAllActivitySectors(
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "createdDate") String field,
            @RequestParam(defaultValue = "false") boolean order) {

        PageResponse<ActivitySectorResponse> response = activitySectorService.findAllActivitySectors(offset, pageSize, field, order);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/toggle/{name}")
    public ResponseEntity<Void> toggleActivitySector(@PathVariable String name,
                                                     Authentication authentication) {
        activitySectorService.toggleCourse(name, authentication);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{activitySectorName}/add-courses")
    public ResponseEntity<String> addMultipleCoursesToActivitySector(
            @PathVariable String activitySectorName,
            @RequestBody List<Long> courseIds) {

        String result = activitySectorService.addMultipleCoursesToActivitySector(activitySectorName, courseIds);
        return ResponseEntity.ok(result);
    }

}

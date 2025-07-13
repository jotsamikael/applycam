package com.jotsamikael.applycam.course;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
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
import com.jotsamikael.applycam.session.SessionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("course-management")
@Tag(name = "course", description = "API de gestion des cours")
@Slf4j
public class CourseController {
	

	private final CourseService courseService;
	private final SessionService sessionService;
	

	@PostMapping("/create-course")
	@Operation(summary = "Créer un cours", description = "Créer un nouveau cours")
	public ResponseEntity<String> createCourse(
		@RequestBody CreateCourseRequest createCourseRequest,
		Authentication connectedUser
	) {
		try {
			log.info("Création du cours: {}", createCourseRequest.getName());
			String result = courseService.createCourse(createCourseRequest, connectedUser);
			return ResponseEntity.status(HttpStatus.CREATED).body(result);
		} catch (Exception e) {
			log.error("Erreur lors de la création du cours: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body("Erreur lors de la création du cours: " + e.getMessage());
		}
	}
	
	@PatchMapping("/update-course")
	@Operation(summary = "Mettre à jour un cours", description = "Mettre à jour un cours existant")
	public ResponseEntity<String> updateCourse(
		@RequestBody CourseRequest courseRequest,
		Authentication connectedUser
	) {
		try {
			log.info("Mise à jour du cours ID: {}", courseRequest.getId());
			String result = courseService.updateCourse(courseRequest, connectedUser);
			return ResponseEntity.ok(result);
		} catch (EntityNotFoundException e) {
			log.warn("Cours non trouvé: {}", e.getMessage());
			return ResponseEntity.notFound().build();
		} catch (Exception e) {
			log.error("Erreur lors de la mise à jour: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body("Erreur lors de la mise à jour: " + e.getMessage());
		}
	}
	
	@GetMapping("/get-all")
	@Operation(summary = "Récupérer tous les cours", description = "Récupérer tous les cours avec pagination et tri")
	public ResponseEntity<PageResponse<CourseResponse>> getCourses(
		@Parameter(description = "Offset de pagination") @RequestParam(name = "offset", defaultValue = "0", required = false) int offset,
		@Parameter(description = "Taille de page") @RequestParam(name = "pageSize", defaultValue = "10", required = false) int pageSize,
		@Parameter(description = "Champ de tri") @RequestParam(name = "field", defaultValue = "name", required = false) String field,
		@Parameter(description = "Ordre de tri") @RequestParam(name = "order", defaultValue = "true", required = false) boolean order
	) {
		try {
			log.info("Récupération des cours - offset: {}, pageSize: {}", offset, pageSize);
			PageResponse<CourseResponse> response = courseService.getAllCourses(offset, pageSize, field, order);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			log.error("Erreur lors de la récupération des cours: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	 
	@GetMapping("/findByName/{name}")
	@Operation(summary = "Trouver par nom", description = "Trouver un cours par son nom")
	public ResponseEntity<CourseResponse> findByName(
		@Parameter(description = "Nom du cours") @PathVariable String name
	) {
		try {
			log.info("Recherche du cours par nom: {}", name);
			CourseResponse course = courseService.findByName(name);
			return ResponseEntity.ok(course);
		} catch (EntityNotFoundException e) {
			log.warn("Cours non trouvé: {}", e.getMessage());
			return ResponseEntity.notFound().build();
		} catch (Exception e) {
			log.error("Erreur lors de la recherche: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	 
	@PatchMapping("/toggle-course/{name}")
	@Operation(summary = "Changer le statut", description = "Désactiver ou réactiver un cours")
	public ResponseEntity<Void> toogleCourse(
		@Parameter(description = "Nom du cours") @PathVariable String name,
		Authentication connectedUser
	) {
		try {
			log.info("Changement de statut du cours: {}", name);
			courseService.toggleCourse(name, connectedUser);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			log.error("Erreur lors du changement de statut: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	/**
	 * Désactiver un cours (soft delete)
	 */
	@PatchMapping("/deactivate/{name}")
	@Operation(summary = "Désactiver un cours", description = "Désactiver un cours (soft delete)")
	public ResponseEntity<Void> deactivateCourse(
		@Parameter(description = "Nom du cours") @PathVariable String name,
		Authentication connectedUser
	) {
		try {
			log.info("Désactivation du cours: {}", name);
			courseService.deactivateCourse(name, connectedUser);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			log.error("Erreur lors de la désactivation: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	/**
	 * Réactiver un cours
	 */
	@PatchMapping("/reactivate/{name}")
	@Operation(summary = "Réactiver un cours", description = "Réactiver un cours désactivé")
	public ResponseEntity<Void> reactivateCourse(
		@Parameter(description = "Nom du cours") @PathVariable String name,
		Authentication connectedUser
	) {
		try {
			log.info("Réactivation du cours: {}", name);
			courseService.reactivateCourse(name, connectedUser);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			log.error("Erreur lors de la réactivation: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	/**
	 * Supprimer définitivement un cours (DELETE mapping)
	 */
	@DeleteMapping("/{name}")
	@Operation(summary = "Supprimer définitivement", description = "Supprimer définitivement un cours")
	public ResponseEntity<Void> deleteCoursePermanently(
		@Parameter(description = "Nom du cours") @PathVariable String name,
		Authentication connectedUser
	) {
		try {
			log.info("Suppression définitive du cours: {}", name);
			courseService.deleteCoursePermanently(name, connectedUser);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			log.error("Erreur lors de la suppression définitive: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	/**
	 * Récupérer un cours par ID
	 */
	@GetMapping("/{courseId}")
	@Operation(summary = "Récupérer par ID", description = "Récupérer un cours par son ID")
	public ResponseEntity<CourseResponse> getCourseById(
		@Parameter(description = "ID du cours") @PathVariable Long courseId
	) {
		try {
			log.info("Récupération du cours ID: {}", courseId);
			CourseResponse course = courseService.getCourseById(courseId);
			return ResponseEntity.ok(course);
		} catch (EntityNotFoundException e) {
			log.warn("Cours non trouvé: {}", e.getMessage());
			return ResponseEntity.notFound().build();
		} catch (Exception e) {
			log.error("Erreur lors de la récupération: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	/**
	 * Rechercher des cours par nom
	 */
	@GetMapping("/search")
	@Operation(summary = "Rechercher par nom", description = "Rechercher des cours par nom")
	public ResponseEntity<List<CourseResponse>> searchCoursesByName(
		@Parameter(description = "Nom à rechercher") @RequestParam String name
	) {
		try {
			log.info("Recherche de cours par nom: {}", name);
			List<CourseResponse> courses = courseService.searchCoursesByName(name);
			return ResponseEntity.ok(courses);
		} catch (Exception e) {
			log.error("Erreur lors de la recherche: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	 
	@PostMapping("/create-and-assign")
	@Operation(summary = "Créer et assigner", description = "Créer un cours et l'assigner à un secteur d'activité")
	public ResponseEntity<String> createAndAssignCourseToActivitySector(
		@RequestBody @Valid CreateCourseAndAssignRequest request,
		Authentication authentication
	) {
		try {
			log.info("Création et assignation du cours: {}", request.getName());
			String response = courseService.createCourseAndAssignToActivitySector(request, authentication);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			log.error("Erreur lors de la création et assignation: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body("Erreur lors de la création et assignation: " + e.getMessage());
		}
	}
	 
	@PostMapping("/{sessionId}/add-courses")
	@Operation(summary = "Ajouter à une session", description = "Ajouter des cours à une session")
	public ResponseEntity<String> addCourses(
		@Parameter(description = "ID de la session") @PathVariable Long sessionId, 
		@RequestBody List<Long> courseIds
	) {
		try {
			log.info("Ajout de {} cours à la session ID: {}", courseIds.size(), sessionId);
			String result = courseService.addCoursesToSession(sessionId, courseIds);
			return ResponseEntity.ok(result);
		} catch (Exception e) {
			log.error("Erreur lors de l'ajout des cours: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body("Erreur lors de l'ajout des cours: " + e.getMessage());
		}
	}
	 
	/**
	 * Supprimer une ou plusieurs filières (courses) d'un centre de formation
	 */
	@DeleteMapping("/courses/{agreementNumber}")
	@Operation(summary = "Supprimer du centre", description = "Supprimer des cours d'un centre de formation")
	public ResponseEntity<String> removeCoursesFromTrainingCenter(
		@Parameter(description = "Numéro d'agrément du centre") @PathVariable String agreementNumber,
		@RequestBody List<Long> courseIds
	) {
		try {
			log.info("Suppression de {} cours du centre: {}", courseIds.size(), agreementNumber);
			String result = courseService.removeCoursesFromTrainingCenter(agreementNumber, courseIds);
			return ResponseEntity.ok(result);
		} catch (Exception e) {
			log.error("Erreur lors de la suppression des cours: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body("Erreur lors de la suppression des cours: " + e.getMessage());
		}
	}
}

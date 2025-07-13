package com.jotsamikael.applycam.application;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

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
import org.springframework.web.multipart.MultipartFile;

import com.jotsamikael.applycam.common.ContentStatus;
import com.jotsamikael.applycam.common.PageResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("application")
@Tag(name = "application", description = "API de gestion des candidatures")
@Slf4j
public class ApplicationController {
	
	private final ApplicationService service;

	/**
	 * Créer une nouvelle candidature
	 */
	@PostMapping("/PersonalInformation")
	@Operation(summary = "Créer une candidature", description = "Créer une nouvelle candidature avec les informations personnelles")
	public ResponseEntity<?> candidateAppliance(
		@RequestBody @Valid ApplicationRequest request,
		Authentication connectedUser
	) {
		try {
			log.info("Création de candidature pour l'utilisateur: {}", connectedUser.getName());
			service.applyPersonalInfo(request, connectedUser);
			return ResponseEntity.ok().body(Map.of("message", "Candidature créée avec succès"));
		} catch (Exception e) {
			log.error("Erreur lors de la création de la candidature: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(Map.of("error", "Erreur lors de la création de la candidature: " + e.getMessage()));
		}
	}
	
	/**
	 * Upload des fichiers de candidature
	 */
	@PatchMapping(value="/PersonalInformation/documents", consumes="multipart/form-data")
	@Operation(summary = "Upload des fichiers", description = "Upload des documents de candidature")
	public ResponseEntity<?> uploadCandidateFile(
		@Parameter(description = "Fichier CNI") @RequestParam MultipartFile cniFile,
		Authentication connectedUser,
		@Parameter(description = "Certificat de naissance") @RequestParam MultipartFile birthCertificate,
		@Parameter(description = "Diplôme") @RequestParam MultipartFile diplomFile,
		@Parameter(description = "Photo") @RequestParam MultipartFile photo,
		@Parameter(description = "Ancienne candidature", required = false) @RequestParam(required=false) MultipartFile oldApplyanceFile,
		@Parameter(description = "Certificat de stage", required = false) @RequestParam(required=false) MultipartFile stageCertificate,
		@Parameter(description = "CV", required = false) @RequestParam(required=false) MultipartFile cv,
		@Parameter(description = "Justification financière", required = false) @RequestParam(required=false) MultipartFile financialJustification,
		@Parameter(description = "Lettre de motivation", required = false) @RequestParam(required=false) MultipartFile letter
	) {
		try {
			log.info("Upload de fichiers pour l'utilisateur: {}", connectedUser.getName());
			service.uploadCandidateFile(cniFile, connectedUser, birthCertificate, diplomFile, photo, 
				oldApplyanceFile, stageCertificate, cv, financialJustification, letter);
			return ResponseEntity.accepted().body(Map.of("message", "Fichiers uploadés avec succès"));
		} catch (Exception e) {
			log.error("Erreur lors de l'upload des fichiers: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(Map.of("error", "Erreur lors de l'upload des fichiers: " + e.getMessage()));
		}
	}
	
	/**
	 * Valider une candidature
	 */
	@PatchMapping("/validate/{id}")
	@Operation(summary = "Valider une candidature", description = "Valider une candidature et assigner un centre d'examen")
	public ResponseEntity<String> validateApplication(
		@Parameter(description = "ID de la candidature") @PathVariable Long id,
		Authentication authentication
	) {
		try {
			log.info("Validation de la candidature ID: {}", id);
			String result = service.validateApplication(authentication, id);
			return ResponseEntity.ok(result);
		} catch (EntityNotFoundException e) {
			log.warn("Candidature non trouvée: {}", e.getMessage());
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		} catch (MessagingException e) {
			log.error("Erreur lors de l'envoi de l'email: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body("Erreur lors de l'envoi de l'email : " + e.getMessage());
		} catch (Exception e) {
			log.error("Erreur lors de la validation: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body("Erreur inattendue : " + e.getMessage());
		}
	}
	
	/**
	 * Rejeter une candidature
	 */
	@PostMapping("/reject/{id}")
	@Operation(summary = "Rejeter une candidature", description = "Rejeter une candidature avec un commentaire")
	public ResponseEntity<String> rejectApplication(
		@Parameter(description = "ID de la candidature") @PathVariable Long id,
		@Parameter(description = "Commentaire de rejet") @RequestParam String comment,
		Authentication authentication
	) {
		try {
			log.info("Rejet de la candidature ID: {} avec commentaire: {}", id, comment);
			String result = service.rejectApplication(authentication, id, comment);
			return ResponseEntity.ok(result);
		} catch (MessagingException e) {
			log.error("Erreur lors de l'envoi de l'email de rejet: {}", e.getMessage(), e);
			return ResponseEntity.status(500).body("Erreur lors de l'envoi de l'email : " + e.getMessage());
		} catch (Exception e) {
			log.error("Erreur lors du rejet: {}", e.getMessage(), e);
			return ResponseEntity.badRequest().body("Erreur : " + e.getMessage());
		}
	}
	
	/**
	 * Récupérer toutes les candidatures avec filtres optionnels
	 */
	@GetMapping("/get-all")
	@Operation(summary = "Récupérer toutes les candidatures", description = "Récupérer toutes les candidatures avec pagination et filtres")
	public ResponseEntity<PageResponse<ApplicationResponse>> getAllApplications(
		@Parameter(description = "Offset de pagination") @RequestParam(defaultValue = "0") int offset,
		@Parameter(description = "Taille de page") @RequestParam(defaultValue = "10") int pageSize,
		@Parameter(description = "Champ de tri") @RequestParam(defaultValue = "id") String field,
		@Parameter(description = "Ordre de tri") @RequestParam(defaultValue = "true") boolean order,
		@Parameter(description = "Statut de filtrage") @RequestParam(required = false) String status,
		@Parameter(description = "Type d'examen") @RequestParam(required = false) String examType,
		@Parameter(description = "Région") @RequestParam(required = false) String region,
		@Parameter(description = "Année") @RequestParam(required = false) String year
	) {
		try {
			log.info("Récupération des candidatures avec filtres - offset: {}, pageSize: {}", offset, pageSize);
			
			PageResponse<ApplicationResponse> response;
			
			if (status != null || examType != null || region != null || year != null) {
				// Utiliser les filtres avancés
				ContentStatus contentStatus = null;
				if (status != null && !status.isEmpty()) {
					try {
						contentStatus = ContentStatus.valueOf(status.toUpperCase());
					} catch (IllegalArgumentException e) {
						log.warn("Statut invalide: {}", status);
						return ResponseEntity.badRequest().build();
					}
				}
				
				response = service.getAllApplicationsWithFilters(offset, pageSize, field, order, 
					contentStatus, examType, region, year);
			} else {
				// Utiliser la méthode simple
				response = service.getAllApplications(offset, pageSize, field, order);
			}
			
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			log.error("Erreur lors de la récupération des candidatures: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	/**
	 * Endpoint temporaire pour debug - récupère toutes les candidatures sans filtre isActived
	 */
	@GetMapping("/get-all-debug")
	@Operation(summary = "Debug - Récupérer toutes les candidatures", description = "Récupérer toutes les candidatures sans filtre isActived pour debug")
	public ResponseEntity<PageResponse<ApplicationResponse>> getAllApplicationsDebug(
		@Parameter(description = "Offset de pagination") @RequestParam(defaultValue = "0") int offset,
		@Parameter(description = "Taille de page") @RequestParam(defaultValue = "10") int pageSize,
		@Parameter(description = "Champ de tri") @RequestParam(defaultValue = "id") String field,
		@Parameter(description = "Ordre de tri") @RequestParam(defaultValue = "true") boolean order
	) {
		try {
			log.info("DEBUG - Récupération des candidatures sans filtre isActived - offset: {}, pageSize: {}", offset, pageSize);
			
			PageResponse<ApplicationResponse> response = service.getAllApplicationsDebug(offset, pageSize, field, order);
			
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			log.error("Erreur lors de la récupération des candidatures (debug): {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	/**
	 * Récupérer toutes les candidatures (actives et inactives) avec pagination
	 */
	@GetMapping("/get-all-including-inactive")
	@Operation(summary = "Récupérer toutes les candidatures", description = "Récupérer toutes les candidatures (actives et inactives) avec pagination")
	public ResponseEntity<PageResponse<ApplicationResponse>> getAllApplicationsIncludingInactive(
		@Parameter(description = "Offset de pagination") @RequestParam(defaultValue = "0") int offset,
		@Parameter(description = "Taille de page") @RequestParam(defaultValue = "10") int pageSize,
		@Parameter(description = "Champ de tri") @RequestParam(defaultValue = "id") String field,
		@Parameter(description = "Ordre de tri") @RequestParam(defaultValue = "true") boolean order
	) {
		try {
			log.info("Récupération de toutes les candidatures (incluant inactives) - offset: {}, pageSize: {}", offset, pageSize);
			
			PageResponse<ApplicationResponse> response = service.getAllApplicationsIncludingInactive(offset, pageSize, field, order);
			
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			log.error("Erreur lors de la récupération des candidatures (incluant inactives): {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	/**
	 * Récupérer toutes les candidatures de l'utilisateur connecté (actives et inactives) avec pagination
	 */
	@GetMapping("/get-my-applications-including-inactive")
	@Operation(summary = "Mes candidatures complètes", description = "Récupérer toutes les candidatures de l'utilisateur connecté (actives et inactives) avec pagination")
	public ResponseEntity<PageResponse<ApplicationResponse>> getMyApplicationsIncludingInactive(
		@Parameter(description = "Offset de pagination") @RequestParam(defaultValue = "0") int offset,
		@Parameter(description = "Taille de page") @RequestParam(defaultValue = "10") int pageSize,
		@Parameter(description = "Champ de tri") @RequestParam(defaultValue = "id") String field,
		@Parameter(description = "Ordre de tri") @RequestParam(defaultValue = "true") boolean order,
		Authentication authentication
	) {
		try {
			log.info("Récupération des candidatures de l'utilisateur (incluant inactives) - offset: {}, pageSize: {}", offset, pageSize);
			
			PageResponse<ApplicationResponse> response = service.getMyApplicationsIncludingInactive(authentication, offset, pageSize, field, order);
			
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			log.error("Erreur lors de la récupération des candidatures de l'utilisateur (incluant inactives): {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	/**
	 * Rechercher des candidatures par nom de candidat
	 */
	@GetMapping("/get-application-By-candidate")
	@Operation(summary = "Rechercher par nom", description = "Rechercher des candidatures par nom de candidat")
	public ResponseEntity<List<ApplicationResponse>> searchApplicationsByCandidateName(
		@Parameter(description = "Nom du candidat") @RequestParam String name
	) {
		try {
			log.info("Recherche de candidatures pour le candidat: {}", name);
			List<ApplicationResponse> applications = service.findApplicationsByCandidateName(name);
			return ResponseEntity.ok(applications);
		} catch (Exception e) {
			log.error("Erreur lors de la recherche par nom: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	/**
	 * Récupérer les candidatures du candidat connecté
	 */
	@GetMapping("/my-applications")
	@Operation(summary = "Mes candidatures", description = "Récupérer les candidatures du candidat connecté")
	public ResponseEntity<List<ApplicationResponse>> getMyApplications(Authentication authentication) {
		try {
			log.info("Récupération des candidatures pour l'utilisateur: {}", authentication.getName());
			List<ApplicationResponse> applications = service.findApplicationsOfConnectedCandidate(authentication);
			return ResponseEntity.ok(applications);
		} catch (Exception e) {
			log.error("Erreur lors de la récupération des candidatures personnelles: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	/**
	 * Récupérer une candidature par ID
	 */
	@GetMapping("/{applicationId}")
	@Operation(summary = "Récupérer une candidature", description = "Récupérer une candidature par son ID")
	public ResponseEntity<ApplicationResponse> getApplicationById(
		@Parameter(description = "ID de la candidature") @PathVariable Long applicationId
	) {
		try {
			log.info("Récupération de la candidature ID: {}", applicationId);
			ApplicationResponse application = service.getApplicationById(applicationId);
			return ResponseEntity.ok(application);
		} catch (EntityNotFoundException e) {
			log.warn("Candidature non trouvée: {}", e.getMessage());
			return ResponseEntity.notFound().build();
		} catch (Exception e) {
			log.error("Erreur lors de la récupération de la candidature: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	/**
	 * Désactiver une candidature (soft delete)
	 */
	@PatchMapping("/deactivate/{applicationId}")
	@Operation(summary = "Désactiver une candidature", description = "Désactiver une candidature (soft delete)")
	public ResponseEntity<Void> deactivateApplication(
		@Parameter(description = "ID de la candidature") @PathVariable Long applicationId,
		Authentication authentication
	) {
		try {
			log.info("Désactivation de la candidature ID: {}", applicationId);
			service.deactivateApplication(applicationId, authentication);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			log.error("Erreur lors de la désactivation: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	/**
	 * Réactiver une candidature
	 */
	@PatchMapping("/reactivate/{applicationId}")
	@Operation(summary = "Réactiver une candidature", description = "Réactiver une candidature désactivée")
	public ResponseEntity<Void> reactivateApplication(
		@Parameter(description = "ID de la candidature") @PathVariable Long applicationId,
		Authentication authentication
	) {
		try {
			log.info("Réactivation de la candidature ID: {}", applicationId);
			service.reactivateApplication(applicationId, authentication);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			log.error("Erreur lors de la réactivation: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	/**
	 * Supprimer définitivement une candidature (DELETE mapping)
	 */
	@DeleteMapping("/{applicationId}")
	@Operation(summary = "Supprimer définitivement", description = "Supprimer définitivement une candidature")
	public ResponseEntity<Void> deleteApplicationPermanently(
		@Parameter(description = "ID de la candidature") @PathVariable Long applicationId,
		Authentication authentication
	) {
		try {
			log.info("Suppression définitive de la candidature ID: {}", applicationId);
			service.deleteApplicationPermanently(applicationId, authentication);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			log.error("Erreur lors de la suppression définitive: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	/**
	 * Récupérer les statistiques des candidatures
	 */
	@GetMapping("/statistics")
	@Operation(summary = "Statistiques", description = "Récupérer les statistiques des candidatures")
	public ResponseEntity<Map<String, Object>> getApplicationStatistics() {
		try {
			log.info("Récupération des statistiques des candidatures");
			Map<String, Object> stats = service.getApplicationStatistics();
			return ResponseEntity.ok(stats);
		} catch (Exception e) {
			log.error("Erreur lors de la récupération des statistiques: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
}

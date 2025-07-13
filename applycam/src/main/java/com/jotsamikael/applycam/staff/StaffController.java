package com.jotsamikael.applycam.staff;

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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/staff")
@RequiredArgsConstructor
@Tag(name = "staff", description = "API de gestion du personnel")
@Slf4j
public class StaffController {

    private final StaffService staffService;

	@PostMapping("/create")
	@Operation(summary = "Créer un membre du staff", description = "Créer un nouveau membre du personnel")
    public ResponseEntity<String> createStaff(
		@RequestBody @Valid StaffRequest staffRequest,
            Authentication connectedUser
    ) {
		try {
			log.info("Création du membre du staff: {}", staffRequest.getFirstname());
			String result = staffService.createStaff(staffRequest, connectedUser);
			return ResponseEntity.status(HttpStatus.CREATED).body(result);
		} catch (Exception e) {
			log.error("Erreur lors de la création du membre du staff: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body("Erreur lors de la création du membre du staff: " + e.getMessage());
		}
	}

	@GetMapping("/get-all")
	@Operation(summary = "Récupérer tous les membres du staff", description = "Récupérer tous les membres du personnel avec pagination et tri")
	public ResponseEntity<PageResponse<StaffResponse>> getAllStaff(
		@Parameter(description = "Offset de pagination") @RequestParam(name = "offset", defaultValue = "0", required = false) int offset,
		@Parameter(description = "Taille de page") @RequestParam(name = "pageSize", defaultValue = "10", required = false) int pageSize,
		@Parameter(description = "Champ de tri") @RequestParam(name = "field", defaultValue = "firstName", required = false) String field,
		@Parameter(description = "Ordre de tri") @RequestParam(name = "order", defaultValue = "true", required = false) boolean order
	) {
		try {
			log.info("Récupération des membres du staff - offset: {}, pageSize: {}", offset, pageSize);
			PageResponse<StaffResponse> response = staffService.getAllStaff(offset, pageSize, field, order);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			log.error("Erreur lors de la récupération des membres du staff: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@GetMapping("/search")
	@Operation(summary = "Rechercher par nom", description = "Rechercher des membres du staff par nom ou prénom")
	public ResponseEntity<List<StaffResponse>> searchStaffByName(
		@Parameter(description = "Nom à rechercher") @RequestParam String name
	) {
		try {
			log.info("Recherche des membres du staff par nom: {}", name);
			List<StaffResponse> staffMembers = staffService.searchStaffByName(name);
			return ResponseEntity.ok(staffMembers);
		} catch (ResponseStatusException e) {
			return ResponseEntity.status(e.getStatusCode()).build();
		} catch (Exception e) {
			log.error("Erreur lors de la recherche: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@PatchMapping("/delete-staff/{staffId}")
	@Operation(summary = "Changer le statut", description = "Désactiver ou réactiver un membre du staff")
	public ResponseEntity<Void> deleteStaff(
		@Parameter(description = "ID du membre du staff") @PathVariable Long staffId,
		Authentication connectedUser
	) {
		try {
			log.info("Changement de statut du membre du staff ID: {}", staffId);
			staffService.deleteStaff(staffId, connectedUser);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			log.error("Erreur lors du changement de statut: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@PatchMapping("/update-staff")
	@Operation(summary = "Mettre à jour un membre du staff", description = "Mettre à jour un membre du personnel existant")
	public ResponseEntity<Long> updateStaff(
		@RequestBody StaffRequest staffRequest,
		Authentication connectedUser
	) {
		try {
			log.info("Mise à jour du membre du staff ID: {}", staffRequest.getId());
			Long result = staffService.updateStaff(staffRequest, connectedUser);
			return ResponseEntity.ok(result);
		} catch (EntityNotFoundException e) {
			log.warn("Membre du staff non trouvé: {}", e.getMessage());
			return ResponseEntity.notFound().build();
		} catch (Exception e) {
			log.error("Erreur lors de la mise à jour: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	/**
	 * Désactiver un membre du staff (soft delete)
	 */
	@PatchMapping("/deactivate/{staffId}")
	@Operation(summary = "Désactiver un membre du staff", description = "Désactiver un membre du staff (soft delete)")
	public ResponseEntity<Void> deactivateStaff(
		@Parameter(description = "ID du membre du staff") @PathVariable Long staffId,
		Authentication connectedUser
	) {
		try {
			log.info("Désactivation du membre du staff ID: {}", staffId);
			staffService.deactivateStaff(staffId, connectedUser);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			log.error("Erreur lors de la désactivation: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	/**
	 * Réactiver un membre du staff
	 */
	@PatchMapping("/reactivate/{staffId}")
	@Operation(summary = "Réactiver un membre du staff", description = "Réactiver un membre du staff désactivé")
	public ResponseEntity<Void> reactivateStaff(
		@Parameter(description = "ID du membre du staff") @PathVariable Long staffId,
		Authentication connectedUser
	) {
		try {
			log.info("Réactivation du membre du staff ID: {}", staffId);
			staffService.reactivateStaff(staffId, connectedUser);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			log.error("Erreur lors de la réactivation: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	/**
	 * Supprimer définitivement un membre du staff (DELETE mapping)
	 */
	@DeleteMapping("/{staffId}")
	@Operation(summary = "Supprimer définitivement", description = "Supprimer définitivement un membre du staff")
	public ResponseEntity<Void> deleteStaffPermanently(
		@Parameter(description = "ID du membre du staff") @PathVariable Long staffId,
		Authentication connectedUser
	) {
		try {
			log.info("Suppression définitive du membre du staff ID: {}", staffId);
			staffService.deleteStaffPermanently(staffId, connectedUser);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			log.error("Erreur lors de la suppression définitive: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	/**
	 * Récupérer un membre du staff par ID
	 */
	@GetMapping("/{staffId}")
	@Operation(summary = "Récupérer par ID", description = "Récupérer un membre du staff par son ID")
	public ResponseEntity<StaffResponse> getStaffById(
		@Parameter(description = "ID du membre du staff") @PathVariable Long staffId
	) {
		try {
			log.info("Récupération du membre du staff ID: {}", staffId);
			StaffResponse staff = staffService.getStaffById(staffId);
			return ResponseEntity.ok(staff);
		} catch (EntityNotFoundException e) {
			log.warn("Membre du staff non trouvé: {}", e.getMessage());
			return ResponseEntity.notFound().build();
		} catch (Exception e) {
			log.error("Erreur lors de la récupération: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	/**
	 * Récupérer les statistiques du staff
	 */
	@GetMapping("/statistics")
	@Operation(summary = "Statistiques du staff", description = "Récupérer les statistiques sur les membres du staff")
	public ResponseEntity<Map<String, Object>> getStaffStatistics() {
		try {
			log.info("Récupération des statistiques du staff");
			Map<String, Object> statistics = staffService.getStaffStatistics();
			return ResponseEntity.ok(statistics);
		} catch (Exception e) {
			log.error("Erreur lors de la récupération des statistiques: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
}

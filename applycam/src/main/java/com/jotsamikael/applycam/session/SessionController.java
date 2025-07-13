package com.jotsamikael.applycam.session;

import java.time.LocalDate;
import java.util.List;

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

@RestController
@RequestMapping("/session")
@RequiredArgsConstructor
@Tag(name = "session", description = "API de gestion des sessions")
@Slf4j
public class SessionController {

	private final SessionService sessionService;

	@PostMapping("/create")
	@Operation(summary = "Créer une session", description = "Créer une nouvelle session")
	public ResponseEntity<String> createSession(
		@RequestBody @Valid CreateSessionRequest createSessionRequest,
		Authentication connectedUser
	) {
		try {
			log.info("Création de la session: {}", createSessionRequest.getSessionYear());
			String result = sessionService.createSession(createSessionRequest, connectedUser);
			return ResponseEntity.status(HttpStatus.CREATED).body(result);
		} catch (Exception e) {
			log.error("Erreur lors de la création de la session: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body("Erreur lors de la création de la session: " + e.getMessage());
		}
	}

	@GetMapping("/get-all")
	@Operation(summary = "Récupérer toutes les sessions", description = "Récupérer toutes les sessions avec pagination et tri")
	public ResponseEntity<PageResponse<SessionResponse>> getall(
		@Parameter(description = "Offset de pagination") @RequestParam(name = "offset", defaultValue = "0", required = false) int offset,
		@Parameter(description = "Taille de page") @RequestParam(name = "pageSize", defaultValue = "10", required = false) int pageSize,
		@Parameter(description = "Champ de tri") @RequestParam(name = "field", defaultValue = "name", required = false) String field,
		@Parameter(description = "Ordre de tri") @RequestParam(name = "order", defaultValue = "true", required = false) boolean order
	) {
		try {
			log.info("Récupération des sessions - offset: {}, pageSize: {}", offset, pageSize);
			PageResponse<SessionResponse> response = sessionService.getAllSession(offset, pageSize, field, order);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			log.error("Erreur lors de la récupération des sessions: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@GetMapping("/get-all-including-inactive")
	@Operation(summary = "Récupérer toutes les sessions (diagnostic)", description = "Récupérer toutes les sessions (actives et inactives) pour diagnostic")
	public ResponseEntity<PageResponse<SessionResponse>> getAllIncludingInactive(
		@Parameter(description = "Offset de pagination") @RequestParam(name = "offset", defaultValue = "0", required = false) int offset,
		@Parameter(description = "Taille de page") @RequestParam(name = "pageSize", defaultValue = "10", required = false) int pageSize,
		@Parameter(description = "Champ de tri") @RequestParam(name = "field", defaultValue = "name", required = false) String field,
		@Parameter(description = "Ordre de tri") @RequestParam(name = "order", defaultValue = "true", required = false) boolean order
	) {
		try {
			log.info("Récupération de toutes les sessions (incluant inactives) - offset: {}, pageSize: {}", offset, pageSize);
			PageResponse<SessionResponse> response = sessionService.getAllSessionsIncludingInactive(offset, pageSize, field, order);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			log.error("Erreur lors de la récupération de toutes les sessions: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@GetMapping("/get-by-year/{sessionYear}")
	@Operation(summary = "Rechercher par année", description = "Récupérer des sessions par année")
	public ResponseEntity<PageResponse<SessionResponse>> findSessionByYear(
		@Parameter(description = "Année de session") @PathVariable String sessionYear,
		@Parameter(description = "Offset de pagination") @RequestParam(defaultValue = "0", required = false) int offset,
		@Parameter(description = "Taille de page") @RequestParam(defaultValue = "10", required = false) int pageSize,
		@Parameter(description = "Champ de tri") @RequestParam(defaultValue = "examType", required = false) String field,
		@Parameter(description = "Ordre de tri") @RequestParam(defaultValue = "true", required = false) boolean order
	) {
		try {
			log.info("Recherche des sessions pour l'année: {}", sessionYear);
			PageResponse<SessionResponse> response = sessionService.findSessionByYear(sessionYear, offset, pageSize, field, order);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			log.error("Erreur lors de la recherche par année: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@GetMapping("/findBy-examdate/{examDate}")
	@Operation(summary = "Rechercher par date", description = "Trouver des sessions par date d'examen")
	public ResponseEntity<List<SessionResponse>> findByName(
		@Parameter(description = "Date d'examen") @PathVariable LocalDate examDate
	) {
		try {
			log.info("Recherche des sessions par date d'examen: {}", examDate);
			List<SessionResponse> sessions = sessionService.findByExamDate(examDate);
			return ResponseEntity.ok(sessions);
		} catch (EntityNotFoundException e) {
			log.warn("Sessions non trouvées: {}", e.getMessage());
			return ResponseEntity.notFound().build();
		} catch (Exception e) {
			log.error("Erreur lors de la recherche par date: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@PatchMapping("/delete-session/{sessionId}")
	@Operation(summary = "Changer le statut", description = "Désactiver ou réactiver une session")
	public ResponseEntity<Void> deleteSession(
		@Parameter(description = "ID de la session") @PathVariable Long sessionId,
		Authentication connectedUser
	) {
		try {
			log.info("Changement de statut de la session ID: {}", sessionId);
			sessionService.deleteSession(sessionId, connectedUser);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			log.error("Erreur lors du changement de statut: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@PatchMapping("/update-session")
	@Operation(summary = "Mettre à jour une session", description = "Mettre à jour une session existante")
	public ResponseEntity<Long> updateSession(
		@RequestBody UpdateSessionRequest updateSessionRequest,
		Authentication connectedUser
	) {
		try {
			log.info("Mise à jour de la session ID: {}", updateSessionRequest.getSessionId());
			Long result = sessionService.updateSession(updateSessionRequest, connectedUser);
			return ResponseEntity.ok(result);
		} catch (EntityNotFoundException e) {
			log.warn("Session non trouvée: {}", e.getMessage());
			return ResponseEntity.notFound().build();
		} catch (Exception e) {
			log.error("Erreur lors de la mise à jour: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@GetMapping("/list-details/{id}")
	@Operation(summary = "Détails de session", description = "Récupérer les détails d'une session")
	public ResponseEntity<SessionDetailsListResponse> getSessionDetailsList(
		@Parameter(description = "ID de la session") @PathVariable Long id
	) {
		try {
			log.info("Récupération des détails de la session ID: {}", id);
			SessionDetailsListResponse details = sessionService.getSessionDetailsAsList(id);
			return ResponseEntity.ok(details);
		} catch (EntityNotFoundException e) {
			log.warn("Session non trouvée: {}", e.getMessage());
			return ResponseEntity.notFound().build();
		} catch (Exception e) {
			log.error("Erreur lors de la récupération des détails: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	/**
	 * Désactiver une session (soft delete)
	 */
	@PatchMapping("/deactivate/{sessionId}")
	@Operation(summary = "Désactiver une session", description = "Désactiver une session (soft delete)")
	public ResponseEntity<Void> deactivateSession(
		@Parameter(description = "ID de la session") @PathVariable Long sessionId,
		Authentication connectedUser
	) {
		try {
			log.info("Désactivation de la session ID: {}", sessionId);
			sessionService.deactivateSession(sessionId, connectedUser);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			log.error("Erreur lors de la désactivation: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	/**
	 * Réactiver une session
	 */
	@PatchMapping("/reactivate/{sessionId}")
	@Operation(summary = "Réactiver une session", description = "Réactiver une session désactivée")
	public ResponseEntity<Void> reactivateSession(
		@Parameter(description = "ID de la session") @PathVariable Long sessionId,
		Authentication connectedUser
	) {
		try {
			log.info("Réactivation de la session ID: {}", sessionId);
			sessionService.reactivateSession(sessionId, connectedUser);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			log.error("Erreur lors de la réactivation: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	/**
	 * Supprimer définitivement une session (DELETE mapping)
	 */
	@DeleteMapping("/{sessionId}")
	@Operation(summary = "Supprimer définitivement", description = "Supprimer définitivement une session")
	public ResponseEntity<Void> deleteSessionPermanently(
		@Parameter(description = "ID de la session") @PathVariable Long sessionId,
		Authentication connectedUser
	) {
		try {
			log.info("Suppression définitive de la session ID: {}", sessionId);
			sessionService.deleteSessionPermanently(sessionId, connectedUser);
			return ResponseEntity.noContent().build();
		} catch (Exception e) {
			log.error("Erreur lors de la suppression définitive: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	/**
	 * Récupérer une session par ID
	 */
	@GetMapping("/{sessionId}")
	@Operation(summary = "Récupérer par ID", description = "Récupérer une session par son ID")
	public ResponseEntity<SessionResponse> getSessionById(
		@Parameter(description = "ID de la session") @PathVariable Long sessionId
	) {
		try {
			log.info("Récupération de la session ID: {}", sessionId);
			SessionResponse session = sessionService.getSessionById(sessionId);
			return ResponseEntity.ok(session);
		} catch (EntityNotFoundException e) {
			log.warn("Session non trouvée: {}", e.getMessage());
			return ResponseEntity.notFound().build();
		} catch (Exception e) {
			log.error("Erreur lors de la récupération: {}", e.getMessage(), e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
}

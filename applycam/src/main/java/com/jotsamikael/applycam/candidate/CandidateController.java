package com.jotsamikael.applycam.candidate;

import com.jotsamikael.applycam.common.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("candidate")
@Tag(name = "candidate", description = "API de gestion des candidats")
@Slf4j
public class CandidateController {

    private final CandidateService candidateService;

    /**
     * Récupérer tous les candidats avec pagination
     */
    @GetMapping("/get-all")
    @Operation(summary = "Récupérer tous les candidats", description = "Récupérer tous les candidats avec pagination et tri")
    public ResponseEntity<PageResponse<CandidateResponse>> getAllCandidates(
        @Parameter(description = "Offset de pagination") @RequestParam(defaultValue = "0", required = false) int offset,
        @Parameter(description = "Taille de page") @RequestParam(defaultValue = "10", required = false) int pageSize,
        @Parameter(description = "Champ de tri") @RequestParam(defaultValue = "firstname", required = false) String field,
        @Parameter(description = "Ordre de tri") @RequestParam(defaultValue = "true", required = false) boolean order
    ) {
        try {
            log.info("Récupération de tous les candidats - offset: {}, pageSize: {}", offset, pageSize);
            PageResponse<CandidateResponse> response = candidateService.getAllCandidates(offset, pageSize, field, order);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des candidats: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Trouver un candidat par email
     */
    @GetMapping("/find-by-email")
    @Operation(summary = "Trouver par email", description = "Trouver un candidat par son email")
    public ResponseEntity<CandidateResponse> findCandidateByEmail(
        @Parameter(description = "Email du candidat") @RequestParam(required = false) String email
    ) {
        try {
            log.info("Recherche du candidat par email: {}", email);
            CandidateResponse candidate = candidateService.findCandidateByEmail(email);
            return ResponseEntity.ok(candidate);
        } catch (EntityNotFoundException e) {
            log.warn("Candidat non trouvé: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Erreur lors de la recherche du candidat: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Mettre à jour le profil d'un candidat
     */
    @PatchMapping("/update/{email}")
    @Operation(summary = "Mettre à jour le profil", description = "Mettre à jour le profil d'un candidat")
    public ResponseEntity<String> updateCandidate(
        @Parameter(description = "Email du candidat") @PathVariable String email,
        @RequestBody CandidateRequest request,
        Authentication connectedUser
    ) {
        try {
            log.info("Mise à jour du profil du candidat: {}", email);
            String result = candidateService.updateProfile(email, request, connectedUser);
            return ResponseEntity.ok(result);
        } catch (EntityNotFoundException e) {
            log.warn("Candidat non trouvé: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Erreur lors de la mise à jour: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la mise à jour: " + e.getMessage());
        }
    }
    
    /**
     * Récupérer les candidats d'un promoteur connecté
     */
    @GetMapping("get-promoter-candidates/{year}")
    @Operation(summary = "Candidats du promoteur", description = "Récupérer les candidats d'un promoteur connecté pour une année donnée")
    public ResponseEntity<PageResponse<CandidateResponse>> getCandidatesOfConnectedpromoterid(
        Authentication connectedUser,
        @Parameter(description = "Année") @PathVariable("year") int year,
        @Parameter(description = "Offset de pagination") @RequestParam(defaultValue = "0", required = false) int offset,
        @Parameter(description = "Taille de page") @RequestParam(defaultValue = "10", required = false) int pageSize,
        @Parameter(description = "Champ de tri") @RequestParam(defaultValue = "firstname", required = false) String field,
        @Parameter(description = "Ordre de tri") @RequestParam(defaultValue = "true", required = false) boolean order
    ) {
        try {
            log.info("Récupération des candidats du promoteur pour l'année: {}", year);
            PageResponse<CandidateResponse> response = candidateService.getCandidatesOfConnectedPromoter(
                connectedUser, year, offset, pageSize, field, order);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des candidats du promoteur: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Trouver un candidat par nom dans les centres du promoteur
     */
    @GetMapping("/find")
    @Operation(summary = "Trouver par nom", description = "Trouver un candidat par nom dans les centres du promoteur")
    public ResponseEntity<CandidateResponse> findCandidate(
        @Parameter(description = "ID du promoteur") @RequestParam(required = true) Long promoterId,
        @Parameter(description = "Nom du candidat") @RequestParam(required = true) String name
    ) {
        try {
            log.info("Recherche du candidat '{}' pour le promoteur ID: {}", name, promoterId);
            CandidateResponse candidate = candidateService.findByName(promoterId, name);
            return ResponseEntity.ok(candidate);
        } catch (EntityNotFoundException e) {
            log.warn("Candidat non trouvé: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Erreur lors de la recherche: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Désactiver/réactiver un candidat
     */
    @PatchMapping("toggleCandidate/{email}")
    @Operation(summary = "Changer le statut", description = "Désactiver ou réactiver un candidat")
    public ResponseEntity<Void> toggleCandidate(
        @Parameter(description = "Email du candidat") @PathVariable String email,
        Authentication connectedUser
    ) {
        try {
            log.info("Changement de statut du candidat: {}", email);
            candidateService.toggleCandidate(email, connectedUser);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Erreur lors du changement de statut: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Récupérer un candidat par ID
     */
    @GetMapping("/{candidateId}")
    @Operation(summary = "Récupérer par ID", description = "Récupérer un candidat par son ID")
    public ResponseEntity<CandidateResponse> getCandidateById(
        @Parameter(description = "ID du candidat") @PathVariable Long candidateId
    ) {
        try {
            log.info("Récupération du candidat ID: {}", candidateId);
            CandidateResponse candidate = candidateService.getCandidateById(candidateId);
            return ResponseEntity.ok(candidate);
        } catch (EntityNotFoundException e) {
            log.warn("Candidat non trouvé: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Rechercher des candidats par nom
     */
    @GetMapping("/search")
    @Operation(summary = "Rechercher par nom", description = "Rechercher des candidats par nom ou prénom")
    public ResponseEntity<List<CandidateResponse>> searchCandidatesByName(
        @Parameter(description = "Nom à rechercher") @RequestParam String name
    ) {
        try {
            log.info("Recherche de candidats par nom: {}", name);
            List<CandidateResponse> candidates = candidateService.searchCandidatesByName(name);
            return ResponseEntity.ok(candidates);
        } catch (Exception e) {
            log.error("Erreur lors de la recherche: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Désactiver un candidat (soft delete)
     */
    @PatchMapping("/deactivate/{email}")
    @Operation(summary = "Désactiver un candidat", description = "Désactiver un candidat (soft delete)")
    public ResponseEntity<Void> deactivateCandidate(
        @Parameter(description = "Email du candidat") @PathVariable String email,
        Authentication connectedUser
    ) {
        try {
            log.info("Désactivation du candidat: {}", email);
            candidateService.deactivateCandidate(email, connectedUser);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Erreur lors de la désactivation: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Réactiver un candidat
     */
    @PatchMapping("/reactivate/{email}")
    @Operation(summary = "Réactiver un candidat", description = "Réactiver un candidat désactivé")
    public ResponseEntity<Void> reactivateCandidate(
        @Parameter(description = "Email du candidat") @PathVariable String email,
        Authentication connectedUser
    ) {
        try {
            log.info("Réactivation du candidat: {}", email);
            candidateService.reactivateCandidate(email, connectedUser);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Erreur lors de la réactivation: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Supprimer définitivement un candidat (DELETE mapping)
     */
    @DeleteMapping("/{email}")
    @Operation(summary = "Supprimer définitivement", description = "Supprimer définitivement un candidat")
    public ResponseEntity<Void> deleteCandidatePermanently(
        @Parameter(description = "Email du candidat") @PathVariable String email,
        Authentication connectedUser
    ) {
        try {
            log.info("Suppression définitive du candidat: {}", email);
            candidateService.deleteCandidatePermanently(email, connectedUser);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Erreur lors de la suppression définitive: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

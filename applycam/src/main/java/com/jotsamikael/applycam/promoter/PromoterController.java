package com.jotsamikael.applycam.promoter;

import com.jotsamikael.applycam.common.ContentStatus;
import com.jotsamikael.applycam.common.PageResponse;
import com.jotsamikael.applycam.staff.CreateStaffRequest;
import com.jotsamikael.applycam.staff.StaffResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("promoter")
@Tag(name = "promoter", description = "API de gestion des promoteurs")
@Slf4j
public class PromoterController {
    private final PromoterService promoterService;

    /**
     * Récupérer tous les promoteurs avec pagination
     */
    @GetMapping("/get-all")
    @Operation(summary = "Récupérer tous les promoteurs", description = "Récupérer tous les promoteurs avec pagination et tri")
    public ResponseEntity<PageResponse<PromoterResponse>> getAllStaffs(
        @Parameter(description = "Offset de pagination") @RequestParam(defaultValue = "0", required = false) int offset,
        @Parameter(description = "Taille de page") @RequestParam(defaultValue = "10", required = false) int pageSize,
        @Parameter(description = "Champ de tri") @RequestParam(defaultValue = "firstname", required = false) String field,
        @Parameter(description = "Ordre de tri") @RequestParam(defaultValue = "true", required = false) boolean order
    ) {
        try {
            log.info("Récupération de tous les promoteurs - offset: {}, pageSize: {}", offset, pageSize);
            PageResponse<PromoterResponse> response = promoterService.getAllPromoter(offset, pageSize, field, order);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des promoteurs: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Trouver un promoteur par email
     */
    @GetMapping("/find-by-email")
    @Operation(summary = "Trouver par email", description = "Trouver un promoteur par son email")
    public ResponseEntity<PromoterResponse> findStaffByEmail(
        @Parameter(description = "Email du promoteur") @RequestParam(required = true) String email
    ) {
        try {
            log.info("Recherche du promoteur par email: {}", email);
            PromoterResponse promoter = promoterService.findPromoterByEmail(email);
            return ResponseEntity.ok(promoter);
        } catch (EntityNotFoundException e) {
            log.warn("Promoteur non trouvé: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Erreur lors de la recherche du promoteur: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Mettre à jour le profil d'un promoteur
     */
    @PatchMapping("/update-promoter/{email}")
    @Operation(summary = "Mettre à jour le profil", description = "Mettre à jour le profil d'un promoteur")
    public ResponseEntity<String> updatePromoter(
        @Parameter(description = "Email du promoteur") @PathVariable String email,
        @RequestBody CreatePromoterRequest request,
        Authentication connectedUser
    ) {
        try {
            log.info("Mise à jour du profil du promoteur: {}", email);
            String result = promoterService.updateProfile(email, request, connectedUser);
            return ResponseEntity.ok(result);
        } catch (EntityNotFoundException e) {
            log.warn("Promoteur non trouvé: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Erreur lors de la mise à jour: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la mise à jour: " + e.getMessage());
        }
    }
    
    /**
     * Réinitialiser le mot de passe d'un promoteur
     */
    @PatchMapping("/reset-password/{email}")
    @Operation(summary = "Réinitialiser le mot de passe", description = "Réinitialiser le mot de passe d'un promoteur")
    public ResponseEntity<String> resetPassword(
        @Parameter(description = "Email du promoteur") @PathVariable String email,
        Authentication connectedUser
    ) throws MessagingException {
        try {
            log.info("Réinitialisation du mot de passe pour le promoteur: {}", email);
            String result = promoterService.resetPassword(email, connectedUser);
            return ResponseEntity.ok(result);
        } catch (EntityNotFoundException e) {
            log.warn("Promoteur non trouvé: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (MessagingException e) {
            log.error("Erreur lors de l'envoi de l'email: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de l'envoi de l'email: " + e.getMessage());
        } catch (Exception e) {
            log.error("Erreur lors de la réinitialisation: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la réinitialisation: " + e.getMessage());
        }
    }
    
    /**
     * Désactiver/réactiver un promoteur
     */
    @PatchMapping("togglePromoterActivation/{email}")
    @Operation(summary = "Changer le statut", description = "Désactiver ou réactiver un promoteur")
    public ResponseEntity<Void> togglePromoter(
        @Parameter(description = "Email du promoteur") @PathVariable String email,
        Authentication connectedUser
    ) {
        try {
            log.info("Changement de statut du promoteur: {}", email);
            promoterService.togglePromoter(email, connectedUser);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Erreur lors du changement de statut: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Valider un promoteur
     */
    @PatchMapping("/validate-promoter/{email}")
    @Operation(summary = "Valider un promoteur", description = "Valider un promoteur et envoyer un email de confirmation")
    public ResponseEntity<String> changeStatus(
        @Parameter(description = "Email du promoteur") @PathVariable String email,
        Authentication connectedUser
    ) {
        try {
            log.info("Validation du promoteur: {}", email);
            String result = promoterService.validatePromoter(email, connectedUser);
            return ResponseEntity.ok(result);
        } catch (EntityNotFoundException e) {
            log.warn("Promoteur non trouvé: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Erreur lors de la validation: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la validation: " + e.getMessage());
        }
    }
    
    /**
     * Récupérer un promoteur par ID
     */
    @GetMapping("/{promoterId}")
    @Operation(summary = "Récupérer par ID", description = "Récupérer un promoteur par son ID")
    public ResponseEntity<PromoterResponse> getPromoterById(
        @Parameter(description = "ID du promoteur") @PathVariable Long promoterId
    ) {
        try {
            log.info("Récupération du promoteur ID: {}", promoterId);
            PromoterResponse promoter = promoterService.getPromoterById(promoterId);
            return ResponseEntity.ok(promoter);
        } catch (EntityNotFoundException e) {
            log.warn("Promoteur non trouvé: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Désactiver un promoteur (soft delete)
     */
    @PatchMapping("/deactivate/{email}")
    @Operation(summary = "Désactiver un promoteur", description = "Désactiver un promoteur (soft delete)")
    public ResponseEntity<Void> deactivatePromoter(
        @Parameter(description = "Email du promoteur") @PathVariable String email,
        Authentication connectedUser
    ) {
        try {
            log.info("Désactivation du promoteur: {}", email);
            promoterService.deactivatePromoter(email, connectedUser);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Erreur lors de la désactivation: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Réactiver un promoteur
     */
    @PatchMapping("/reactivate/{email}")
    @Operation(summary = "Réactiver un promoteur", description = "Réactiver un promoteur désactivé")
    public ResponseEntity<Void> reactivatePromoter(
        @Parameter(description = "Email du promoteur") @PathVariable String email,
        Authentication connectedUser
    ) {
        try {
            log.info("Réactivation du promoteur: {}", email);
            promoterService.reactivatePromoter(email, connectedUser);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Erreur lors de la réactivation: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Supprimer définitivement un promoteur (DELETE mapping)
     */
    @DeleteMapping("/{email}")
    @Operation(summary = "Supprimer définitivement", description = "Supprimer définitivement un promoteur")
    public ResponseEntity<Void> deletePromoterPermanently(
        @Parameter(description = "Email du promoteur") @PathVariable String email,
        Authentication connectedUser
    ) {
        try {
            log.info("Suppression définitive du promoteur: {}", email);
            promoterService.deletePromoterPermanently(email, connectedUser);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Erreur lors de la suppression définitive: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

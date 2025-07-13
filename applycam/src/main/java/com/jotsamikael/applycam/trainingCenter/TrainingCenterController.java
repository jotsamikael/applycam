package com.jotsamikael.applycam.trainingCenter;

import com.jotsamikael.applycam.common.ContentStatus;
import com.jotsamikael.applycam.common.PageResponse;
import com.jotsamikael.applycam.promoter.CreatePromoterRequest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("trainingcenter")
@Tag(name = "trainingcenter", description = "API de gestion des centres de formation")
@Slf4j
public class TrainingCenterController {

    private final TrainingCenterService service;

    @PostMapping("create-training-center")
    @Operation(summary = "Créer un centre de formation", description = "Créer un nouveau centre de formation")
    public ResponseEntity<String> createTrainingCenter(
            @RequestBody() @Valid CreateTainingCenterRequest request,
            Authentication connectedUser
    ) {
        try {
            log.info("Création du centre de formation: {}", request.getFullName());
            String result = service.createTrainingCenter(request, connectedUser);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (Exception e) {
            log.error("Erreur lors de la création du centre de formation: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur lors de la création: " + e.getMessage());
        }
    }

    @GetMapping("get-training-by-agreement-number")
    @Operation(summary = "Récupérer par numéro d'accord", description = "Récupérer un centre de formation par son numéro d'accord")
    public ResponseEntity<TrainingCenterResponse> getTrainingCenterByAgreementNumber(
            @Parameter(description = "Numéro d'accord") @RequestParam(required = true) String agreementNumber
    ) {
        try {
            log.info("Récupération du centre de formation par numéro d'accord: {}", agreementNumber);
            TrainingCenterResponse response = service.getTrainingCenterByAgreementNumber(agreementNumber);
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            log.warn("Centre de formation non trouvé: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("get-training-centers-of-connected-promoter")
    @Operation(summary = "Centres du promoteur connecté", description = "Récupérer tous les centres de formation du promoteur connecté")
    public ResponseEntity<List<TrainingCenterResponse>> getTrainingCenterOfConnectedPromoter(
            Authentication connectedUser
    ) {
        try {
            log.info("Récupération des centres de formation du promoteur connecté");
            List<TrainingCenterResponse> response = service.getTrainingCenterOfConnectedPromoter(connectedUser);
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            log.warn("Centres de formation non trouvés: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Erreur lors de la récupération: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("get-all")
    @Operation(summary = "Récupérer tous les centres", description = "Récupérer tous les centres de formation avec pagination et tri")
    public ResponseEntity<PageResponse<TrainingCenterResponse>> getAllTrainingCenters(
            @Parameter(description = "Offset de pagination") @RequestParam(defaultValue = "0", required = false) int offset,
            @Parameter(description = "Taille de page") @RequestParam(defaultValue = "10", required = false) int pageSize,
            @Parameter(description = "Champ de tri") @RequestParam(defaultValue = "fullName", required = false) String field,
            @Parameter(description = "Ordre de tri") @RequestParam(defaultValue = "true", required = false) boolean order
    ) {
        try {
            log.info("Récupération des centres de formation - offset: {}, pageSize: {}", offset, pageSize);
            PageResponse<TrainingCenterResponse> response = service.getAllTrainingCenter(offset, pageSize, field, order);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Erreur lors de la récupération: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping(value="agreement/{agreement-number}", consumes = "multipart/form-data")
    @Operation(summary = "Télécharger un fichier d'accord", description = "Télécharger un fichier d'accord pour un centre de formation")
    public ResponseEntity<?> uploadAgreementFile(
            @Parameter(description = "Numéro d'accord") @PathVariable("agreement-number") String agreementNumber,
            @Parameter(description = "Fichier d'accord à télécharger") @RequestParam MultipartFile file,
            @RequestParam String fileType,
            Authentication connectedUser
    ){
        try {
            log.info("Téléchargement du fichier d'accord pour: {}", agreementNumber);
            service.uploadAgreementFile(file, connectedUser, agreementNumber, fileType);
            return ResponseEntity.accepted().build();
        } catch (Exception e) {
            log.error("Erreur lors du téléchargement: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

   @GetMapping("/getAgreementStatus/{agreement-number}")
   @Operation(summary = "Statut d'accord", description = "Obtenir le statut d'un accord")
   public ResponseEntity<String> getAgreementStatus(
    @Parameter(description = "Numéro d'accord") @PathVariable("agreement-number") String agreementNumber,
    Authentication connectedUser
   ){
        try {
            log.info("Vérification du statut d'accord: {}", agreementNumber);
            String status = service.getAgreementStatus(agreementNumber, connectedUser);
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            log.error("Erreur lors de la vérification du statut: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
   }
   
   @PatchMapping("/update-trainingCenter/{fullname}")
   @Operation(summary = "Mettre à jour un centre", description = "Mettre à jour un centre de formation existant")
   public ResponseEntity<String> updateTrainingCenter(
       @Parameter(description = "Nom complet du centre") @PathVariable String fullname,
       @RequestBody UpdateTrainingCenterRequest request,
       Authentication connectedUser
   ) {
       try {
           log.info("Mise à jour du centre de formation: {}", fullname);
           String result = service.updateTrainingCenter(fullname, request, connectedUser);
           return ResponseEntity.ok(result);
       } catch (EntityNotFoundException e) {
           log.warn("Centre de formation non trouvé: {}", e.getMessage());
           return ResponseEntity.notFound().build();
       } catch (Exception e) {
           log.error("Erreur lors de la mise à jour: {}", e.getMessage(), e);
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
       }
   }
   
   @PatchMapping("/status/{agreementNumber}")
   @Operation(summary = "Changer le statut", description = "Changer le statut d'un centre de formation")
   public ResponseEntity<Map<String, Boolean>> changeStatus(
           @Parameter(description = "Numéro d'accord") @PathVariable String agreementNumber,
           @RequestParam ContentStatus status,
           @RequestParam(required = false) String comment,
           Authentication connectedUser) {
       
       try {
           log.info("Changement de statut du centre de formation: {} vers {}", agreementNumber, status);
           String result;
           if (status == ContentStatus.VALIDATED) {
               result = service.validateTrainingCenter(agreementNumber, connectedUser);
           } else {
               result = service.changeTrainingCenterStatus(agreementNumber, status, comment, connectedUser);
           }
           return ResponseEntity.ok(Collections.singletonMap("success", true));
        } catch (Exception e) {
            log.error("Erreur lors du changement de statut: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("success", false));
        }
   }

    /**
     * Désactiver/réactiver un centre de formation
     */
    @PatchMapping("/delete/{agreementNumber}")
    @Operation(summary = "Changer le statut", description = "Désactiver ou réactiver un centre de formation")
    public ResponseEntity<Void> deleteTrainingCenter(
        @Parameter(description = "Numéro d'accord") @PathVariable String agreementNumber,
        Authentication connectedUser
    ) {
        try {
            log.info("Changement de statut du centre de formation: {}", agreementNumber);
            service.deleteTrainingCenter(agreementNumber, connectedUser);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Erreur lors du changement de statut: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Désactiver un centre de formation (soft delete)
     */
    @PatchMapping("/deactivate/{agreementNumber}")
    @Operation(summary = "Désactiver un centre", description = "Désactiver un centre de formation (soft delete)")
    public ResponseEntity<Void> deactivateTrainingCenter(
        @Parameter(description = "Numéro d'accord") @PathVariable String agreementNumber,
        Authentication connectedUser
    ) {
        try {
            log.info("Désactivation du centre de formation: {}", agreementNumber);
            service.deactivateTrainingCenter(agreementNumber, connectedUser);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Erreur lors de la désactivation: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Réactiver un centre de formation
     */
    @PatchMapping("/reactivate/{agreementNumber}")
    @Operation(summary = "Réactiver un centre", description = "Réactiver un centre de formation désactivé")
    public ResponseEntity<Void> reactivateTrainingCenter(
        @Parameter(description = "Numéro d'accord") @PathVariable String agreementNumber,
        Authentication connectedUser
    ) {
        try {
            log.info("Réactivation du centre de formation: {}", agreementNumber);
            service.reactivateTrainingCenter(agreementNumber, connectedUser);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Erreur lors de la réactivation: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Supprimer définitivement un centre de formation (DELETE mapping)
     */
    @DeleteMapping("/{agreementNumber}")
    @Operation(summary = "Supprimer définitivement", description = "Supprimer définitivement un centre de formation")
    public ResponseEntity<Void> deleteTrainingCenterPermanently(
        @Parameter(description = "Numéro d'accord") @PathVariable String agreementNumber,
        Authentication connectedUser
    ) {
        try {
            log.info("Suppression définitive du centre de formation: {}", agreementNumber);
            service.deleteTrainingCenterPermanently(agreementNumber, connectedUser);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Erreur lors de la suppression définitive: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Récupérer les statistiques des centres de formation
     */
    @GetMapping("/statistics")
    @Operation(summary = "Statistiques", description = "Récupérer les statistiques sur les centres de formation")
    public ResponseEntity<Map<String, Object>> getTrainingCenterStatistics() {
        try {
            log.info("Récupération des statistiques des centres de formation");
            Map<String, Object> statistics = service.getTrainingCenterStatistics();
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            log.error("Erreur lors de la récupération des statistiques: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

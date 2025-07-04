package com.jotsamikael.applycam.file;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jotsamikael.applycam.candidate.Candidate;
import com.jotsamikael.applycam.candidate.CandidateRepository;
import com.jotsamikael.applycam.promoter.Promoter;
import com.jotsamikael.applycam.promoter.PromoterRepository;
import com.jotsamikael.applycam.trainingCenter.TrainingCenter;
import com.jotsamikael.applycam.trainingCenter.TrainingCenterRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("files")
@RequiredArgsConstructor
@Slf4j
public class FileController {

    private final CandidateRepository candidateRepository;
    private final PromoterRepository promoterRepository;
    private final TrainingCenterRepository trainingCenterRepository;

    @GetMapping("/candidate-files/{userId}/{fileType}")
    public ResponseEntity<byte[]> getCanidateFileByType(
            @PathVariable Long userId,
            @PathVariable String fileType) {

        Candidate candidate = candidateRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Candidat introuvable pour l'utilisateur " + userId));

        // Obtenir le bon chemin de fichier selon le type demandé
        String filePath = switch (fileType.toUpperCase()) {
            case "CNI" -> candidate.getNationalIdCardUrl();
            case "PHOTO" -> candidate.getProfilePictureUrl();
            case "BIRTHCERTIFICATE" -> candidate.getBirthCertificateUrl();
            case "DIPLOM" -> candidate.getHighestDiplomatUrl();
            case "CV" -> candidate.getCvUrl();
            case "LETTER" -> candidate.getLetterUrl();
            case "FINANCIAL" -> candidate.getFinancialJustificationUrl();
            case "CERTIFICATE" -> candidate.getStageCertificateUrl();
            case "OLD" -> candidate.getOldApplyanceUrl();
            default -> throw new IllegalArgumentException("Type de fichier non reconnu : " + fileType);
        };

        if (filePath == null || filePath.isBlank()) {
            return ResponseEntity.notFound().build();
        }

        byte[] fileContent = FileUtils.readFileFromLocation(filePath);
        if (fileContent == null) {
            return ResponseEntity.internalServerError().build();
        }

        try {
            Path file = Path.of(filePath);
            String contentType = Files.probeContentType(file);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFileName() + "\"")
                    .contentType(MediaType.parseMediaType(contentType != null ? contentType : "application/octet-stream"))
                    .body(fileContent);

        } catch (IOException e) {
            log.error("Impossible de lire le type MIME du fichier : {}", filePath, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/promoter-files/{promoterId}/{fileType}")
    public ResponseEntity<byte[]> getPromoterFileByType(
            @PathVariable Long promoterId,
            @PathVariable String fileType) {

        Promoter promoter = promoterRepository.findById(promoterId)
                .orElseThrow(() -> new EntityNotFoundException("Promoteur introuvable avec l'ID " + promoterId));

        String filePath = switch (fileType.toUpperCase()) {
            case "CNI" -> promoter.getNationalIdCardUrl();
            case "PHOTO" -> promoter.getPhotoUrl();
           // case "SIGNATURE" -> promoter.getSignatureLetterUrl();
           // case "LOCALISATION" -> promoter.getLocalisationFileUrl();
           // case "REGLEMENT" -> promoter.getInternalRegulationFileUrl();
            default -> throw new IllegalArgumentException("Type de fichier non reconnu : " + fileType);
        };

        if (filePath == null || filePath.isBlank()) {
            return ResponseEntity.notFound().build();
        }

        byte[] fileContent = FileUtils.readFileFromLocation(filePath);
        if (fileContent == null) {
            return ResponseEntity.internalServerError().build();
        }

        try {
            Path file = Path.of(filePath);
            String contentType = Files.probeContentType(file);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFileName() + "\"")
                    .contentType(MediaType.parseMediaType(contentType != null ? contentType : "application/octet-stream"))
                    .body(fileContent);

        } catch (IOException e) {
            log.error("Impossible de lire le type MIME du fichier : {}", filePath, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    
    
    @GetMapping("/centerr-files/{agreementNumber}/{fileType}")
    public ResponseEntity<byte[]> getTrainingCenterFilesByType(
            @PathVariable String agreementNumber,
            @PathVariable String fileType) {

        TrainingCenter trainingCenter = trainingCenterRepository.findByAgreementNumber(agreementNumber)
                .orElseThrow(() -> new EntityNotFoundException("Training center introuvable avec le numero d'agreement " + agreementNumber));

        String filePath = switch (fileType.toUpperCase()) {
            
        case "AGREEMENT" -> trainingCenter.getAgreementFileUrl();
           case "SIGNATURE" -> trainingCenter.getSignatureLetterUrl();
           case "LOCALISATION" -> trainingCenter.getLocalisationFileUrl();
           case "REGLEMENT" -> trainingCenter.getInternalRegulationFileUrl();
            default -> throw new IllegalArgumentException("Type de fichier non reconnu : " + fileType);
        };

        if (filePath == null || filePath.isBlank()) {
            return ResponseEntity.notFound().build();
        }

        byte[] fileContent = FileUtils.readFileFromLocation(filePath);
        if (fileContent == null) {
            return ResponseEntity.internalServerError().build();
        }

        try {
            Path file = Path.of(filePath);
            String contentType = Files.probeContentType(file);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFileName() + "\"")
                    .contentType(MediaType.parseMediaType(contentType != null ? contentType : "application/octet-stream"))
                    .body(fileContent);

        } catch (IOException e) {
            log.error("Impossible de lire le type MIME du fichier : {}", filePath, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    

}


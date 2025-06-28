package com.jotsamikael.applycam.file;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.stereotype.Service;

import com.jotsamikael.applycam.candidate.Candidate;
import com.jotsamikael.applycam.candidate.CandidateRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileService {
	
	private final CandidateRepository candidateRepository;

    public byte[] getCandidateFile(Long userId, String fileType) throws FileNotFoundException {
    	
        Candidate candidate = candidateRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Candidat introuvable pour l'utilisateur " + userId));

        String filePath = switch (fileType.toUpperCase()) {
            case "CNI" -> candidate.getNationalIdCardUrl();
            case "PHOTO" -> candidate.getProfilePictureUrl();
            case "BIRTHCERTIFICATE" -> candidate.getBirthCertificateUrl();
            case "DIPLOM" -> candidate.getHighestDiplomatUrl();
            case "CV" -> candidate.getCvUrl();
            case "LETTER" -> candidate.getLetterUrl();
            default -> throw new IllegalArgumentException("Type de fichier non reconnu : " + fileType);
        };

        if (filePath == null || filePath.isBlank()) {
            throw new FileNotFoundException("Aucun fichier trouvé pour " + fileType + " de l'utilisateur " + userId);
        }

        byte[] fileContent = FileUtils.readFileFromLocation(filePath);
        if (fileContent == null) {
            throw new RuntimeException("Impossible de lire le fichier pour " + fileType);
        }

        return fileContent;
    }

    
    

    

}

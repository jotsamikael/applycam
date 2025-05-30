package com.jotsamikael.applycam.common;

import com.jotsamikael.applycam.trainingCenter.TrainingCenter;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static java.lang.System.currentTimeMillis;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileStorageService {

    @Value("${application.file.upload.files-output-path}")
    private String fileUploadPath;

public String saveFile(@NonNull MultipartFile sourceFile, @NonNull Long idUser){
   final String fileUploadSubPath = "users"+ File.separator+ idUser;

    return uploadFile(sourceFile, fileUploadSubPath);
}

    private String uploadFile(@NonNull MultipartFile sourceFile,
                              @NonNull String fileUploadSubPath) {
    final String finalUploadPath = fileUploadPath+File.separator+ fileUploadSubPath;

    File targetFolder = new File(finalUploadPath);
    if(!targetFolder.exists()){
        boolean folderCreated = targetFolder.mkdirs();
        if(!folderCreated){
            log.warn("Failed to create the target folder");
            return null;

        }
    }

    final String fileExtension = getFileExtension(sourceFile.getOriginalFilename());

    //rename the file to something like ./uploads/users/120/232347851452.pdf
    String targetFilePath = finalUploadPath+File.separator+ currentTimeMillis()+"."+fileExtension;
    Path targetPath = Path.of(targetFilePath);
    try{
        Files.write(targetPath, sourceFile.getBytes());
        log.info("File saved to",targetFilePath);
        return targetFilePath;

    }catch (IOException exception){
        log.error("File not saved",exception);
    }
    return null;
    }

    private String getFileExtension(String originalFilename) {
    if(originalFilename == null || originalFilename.isEmpty()){
       return "";
    }

    int lastDotIndex = originalFilename.lastIndexOf(".");
    if(lastDotIndex == -1){
        return "";
    }
        return originalFilename.substring(lastDotIndex+1).toLowerCase();
    }
}


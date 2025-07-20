package com.jotsamikael.applycam.candidate;

import com.jotsamikael.applycam.trainingCenter.TrainingCenterResponse;
import com.jotsamikael.applycam.examCenter.ExamCenter;
import com.jotsamikael.applycam.hasSchooled.HasSchooled;
import lombok.*;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateFullInfoResponse {
    private CandidateResponse candidate;
    private TrainingCenterResponse trainingCenter;
    private String examCenterName;
    private String examCenterRegion;
    private List<String> schooledYears; // ex: ["2022-2023", "2023-2024"]
    private String profilePictureUrl;
    private String birthCertificateUrl;
    private String nationalIdCardUrl;
    private String highestDiplomatUrl;
    private String cvUrl;
    private String letterUrl;
    private String financialJustificationUrl;
    private String stageCertificateUrl;
    private String oldApplyanceUrl;
    private String contentStatus;
    private boolean isAccountActive;
} 
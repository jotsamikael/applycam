package com.jotsamikael.applycam.promoter;

import com.jotsamikael.applycam.trainingCenter.TrainingCenterResponse;
import lombok.*;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PromoterFullInfoResponse {
    private PromoterResponse promoter;
    private List<TrainingCenterResponse> trainingCenters;
    private String nationalIdCardUrl;
    private String photoUrl;
    private boolean accountLocked;
    private boolean enabled;
    private int numberOfCenters;
} 
package com.jotsamikael.applycam.trainingCenter;


import com.jotsamikael.applycam.campus.Campus;
import com.jotsamikael.applycam.offersSpeciality.OffersSpeciality;
import com.jotsamikael.applycam.promoter.Promoter;
import com.jotsamikael.applycam.trainingCenter.division.Division;
import jakarta.persistence.Column;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TrainingCenterResponse {
    private String fullName;
    private String acronym;
    private String agreementNumber;
    private byte[] agreementFile;
    private LocalDate startDateOfAgreement;
    private LocalDate endDateOfAgreement;
    private boolean isCenterPresentCandidateForCqp;
    private boolean isCenterPresentCandidateForDqp;
    private String division;
    private String promoter;
    private List<OffersSpeciality> offersSpecialityList;
    private List<Campus> campusList;


}

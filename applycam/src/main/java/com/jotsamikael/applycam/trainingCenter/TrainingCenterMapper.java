package com.jotsamikael.applycam.trainingCenter;
import com.jotsamikael.applycam.centerStatus.TrainingCenterStatusHistory;
import com.jotsamikael.applycam.common.ContentStatus;
import com.jotsamikael.applycam.file.FileUtils;
import org.springframework.stereotype.Service;


@Service
public class TrainingCenterMapper {
    public TrainingCenterResponse toTrainingResponse(TrainingCenter trainingCenter){
    	
    	TrainingCenterStatusHistory statusHistory = trainingCenter.getStatus();
        ContentStatus status = (statusHistory != null) ? statusHistory.getStatus() : ContentStatus.DRAFT;
    	
        return TrainingCenterResponse.builder()
                .fullName(trainingCenter.getFullName())
                .promoterName(trainingCenter.getPromoter().getFirstname())
                .acronym(trainingCenter.getAcronym())
                .agreementNumber(trainingCenter.getAgreementNumber())
                .startDateOfAgreement(trainingCenter.getStartDateOfAgreement())
                .endDateOfAgreement(trainingCenter.getEndDateOfAgreement())
                .isCenterPresentCandidateForCqp(trainingCenter.getIsCenterPresentCandidateForCqp())
                .isCenterPresentCandidateForDqp(trainingCenter.getIsCenterPresentCandidateForDqp())
                .division(trainingCenter.getDivision())
                .promoter(trainingCenter.getPromoter().getEmail())
                .offersSpecialityList(trainingCenter.getOffersSpecialityList())
                .campusList(trainingCenter.getCampusList())
                .status(status)
                //.agreementFile(FileUtils.readFileFromLocation(trainingCenter.getAgreementFileUrl()))
        .build();
    }
}

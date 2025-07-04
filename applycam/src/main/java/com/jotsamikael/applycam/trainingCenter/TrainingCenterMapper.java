package com.jotsamikael.applycam.trainingCenter;
import com.jotsamikael.applycam.file.FileUtils;
import org.springframework.stereotype.Service;


@Service
public class TrainingCenterMapper {
    public TrainingCenterResponse toTrainingResponse(TrainingCenter trainingCenter){
        return TrainingCenterResponse.builder()
                .fullName(trainingCenter.getFullName())
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
                .agreementFile(FileUtils.readFileFromLocation(trainingCenter.getAgreementFileUrl()))
        .build();
    }
}

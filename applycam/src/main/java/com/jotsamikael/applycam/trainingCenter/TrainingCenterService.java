package com.jotsamikael.applycam.trainingCenter;

import com.jotsamikael.applycam.common.FileStorageService;
import com.jotsamikael.applycam.common.PageResponse;
import com.jotsamikael.applycam.promoter.Promoter;
import com.jotsamikael.applycam.promoter.PromoterRepository;
import com.jotsamikael.applycam.user.User;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TrainingCenterService {
    private final TrainingCenterRepository trainingCenterRepository;
    private final PromoterRepository promoterRepository;
    private final TrainingCenterMapper mapper;
    private final FileStorageService fileStorageService;



    public String createTrainingCenter(@Valid CreateTainingCenterRequest request, Authentication connectedUser) {
        //get user object from connected user
        User user = ((User) connectedUser.getPrincipal());

        //check connected user is promoter
        Promoter promoter = promoterRepository.findByEmail(user.getEmail()).orElseThrow(() -> new EntityNotFoundException("Not a promoter" + user.getEmail()));

        // create training center
        var trainingCenter = TrainingCenter.builder()
                .fullName(request.getFullName())
                .acronym(request.getAcronym())
                .agreementNumber(request.getAgreementNumber())
                .division(request.getDivision())
                .startDateOfAgreement(request.getStartDateOfAgreement())
                .endDateOfAgreement(request.getEndDateOfAgreement())
                .isCenterPresentCandidateForCqp(request.isCenterPresentCandidateForCqp())
                .isCenterPresentCandidateForDqp(request.isCenterPresentCandidateForDqp())
                .promoter(promoter) //add promoter reference
                .createdBy(user.getIdUser())
                .createdDate(LocalDateTime.now())
                .build();

        trainingCenterRepository.save(trainingCenter);
        //return agreement number
        return trainingCenter.getFullName();
    }

    public TrainingCenterResponse getTrainingCenterByAgreementNumber(String agreementNumber) {
        TrainingCenter trainingCenter = trainingCenterRepository.findByAgreementNumber(agreementNumber).orElseThrow(() -> new EntityNotFoundException("No training center found for agreement number: " + agreementNumber));

        var trainingResponse = TrainingCenterResponse.builder()
                .fullName(trainingCenter.getFullName())
                .acronym(trainingCenter.getAcronym())
                .agreementNumber(agreementNumber)
                .division(trainingCenter.getDivision())
                .isCenterPresentCandidateForDqp(trainingCenter.isCenterPresentCandidateForDqp())
                .isCenterPresentCandidateForCqp(trainingCenter.isCenterPresentCandidateForCqp())
                .startDateOfAgreement(trainingCenter.getStartDateOfAgreement())
                .endDateOfAgreement(trainingCenter.getEndDateOfAgreement())
                .offersSpecialityList(trainingCenter.getOffersSpecialityList())
                .campusList(trainingCenter.getCampusList())
                .promoter(trainingCenter.getPromoter().getEmail())
                .build();

        return trainingResponse;

    }

    public List<TrainingCenterResponse> getTrainingCenterOfConnectedPromoter(Authentication connectedUser) {
        //get user object from connected user
        User user = ((User) connectedUser.getPrincipal());

        //check connected user is promoter
        Promoter promoter = promoterRepository.findByEmail(user.getEmail()).orElseThrow(() -> new EntityNotFoundException("Not a promoter" + user.getEmail()));

       List<TrainingCenter> trainingCenterList = trainingCenterRepository.findByPromoter(promoter).orElseThrow(() -> new EntityNotFoundException("No training center found for" + user.getEmail()));;

        List<TrainingCenterResponse> responses = trainingCenterList.stream().map(mapper::toTrainingResponse).toList();

        return responses;
    }

    public PageResponse<TrainingCenterResponse> getAllTrainingCenter(int offset, int pageSize, String field, boolean order) {

        Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();

        Page<TrainingCenter> list = trainingCenterRepository.getAll(
                PageRequest.of(offset, pageSize, sort));

        List<TrainingCenterResponse> responses = list.stream().map(mapper::toTrainingResponse).toList();
        return new PageResponse<>(
                responses,
                list.getNumber(),
                list.getSize(),
                list.getTotalElements(),
                list.getTotalPages(),
                list.isFirst(),
                list.isLast()
        );
    }

    public void uploadAgreementFile(MultipartFile file, Authentication connectedUser, String agreementNumber) {
        //get user object from connected user
        User user = ((User) connectedUser.getPrincipal());

        //check connected user is promoter
        Promoter promoter = promoterRepository.findByEmail(user.getEmail()).orElseThrow(() -> new EntityNotFoundException("Not a promoter" + user.getEmail()));

        TrainingCenter trainingCenter = trainingCenterRepository.findByAgreementNumber(agreementNumber).orElseThrow(() -> new EntityNotFoundException("Not a training center found for agreement number: " + agreementNumber));
        var agreementFileUrl = fileStorageService.saveFile(file, promoter.getIdUser());
         trainingCenter.setAgreementFileUrl(agreementFileUrl);
         trainingCenterRepository.save(trainingCenter);
    }
}

package com.jotsamikael.applycam.campus;

import com.jotsamikael.applycam.common.PageResponse;
import com.jotsamikael.applycam.promoter.Promoter;
import com.jotsamikael.applycam.promoter.PromoterRepository;
import com.jotsamikael.applycam.trainingCenter.TrainingCenter;
import com.jotsamikael.applycam.trainingCenter.TrainingCenterRepository;
import com.jotsamikael.applycam.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CampusService {
    private final CampusRepository campusRepository;
    private final PromoterRepository promoterRepository;
    private final TrainingCenterRepository trainingCenterRepository;
    private final CampusMapper mapper;


    public String createCampus(CreateCampusRequest request, Authentication connectedUser) {
        //get user object from connected user
        User user = ((User) connectedUser.getPrincipal());

        //check connected user is promoter pr throw exception
        Promoter promoter = promoterRepository.findByEmail(user.getEmail()).orElseThrow(() -> new EntityNotFoundException("Not a promoter" + user.getEmail()));

        //find all training centers linked to this promoter and check if training center in request matches this one
        List<TrainingCenter> centers = trainingCenterRepository.findByPromoter(promoter).orElseThrow(() -> new EntityNotFoundException("No a training center found for promoter" + promoter.getEmail()));

        if (!centers.contains(request.trainingCenter)) {
            throw new EntityNotFoundException("Not a training center of connected promoter");
        }
        //build campus object
        var campus = Campus.builder()
                .name(request.name)
                .capacity(request.capacity)
                .town(request.town)
                .quarter(request.quarter)
                .xCoor(request.xCoor)
                .yCoor(request.yCoor)
                .trainingCenter(request.trainingCenter)
                .build();

        //save object
        return campusRepository.save(campus).getName();

    }

    public List<CampusResponse> findCampusByTrainingCenter(String agreementNumber) {

        TrainingCenter trainingCenter = trainingCenterRepository.findByAgreementNumber(agreementNumber).orElseThrow(() -> new EntityNotFoundException("No training center with agreement num" + agreementNumber));
        List<Campus> campusList = campusRepository.findByTrainingCenter(trainingCenter).orElseThrow(() -> new EntityNotFoundException("No campus with found for training center with agreement Num" + agreementNumber));

        List<CampusResponse> responses = campusList.stream().map(mapper::toCampusResponse).toList();
        return responses;
    }

    public PageResponse<CampusResponse> findCampusByTown(int offset, int pageSize, String field, boolean order) {
        Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();

        Page<Campus> list = campusRepository.getAll(
                PageRequest.of(offset, pageSize, sort));
        List<CampusResponse> responses = list.stream().map(mapper::toCampusResponse).toList();
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
}

package com.jotsamikael.applycam.campus;

import com.jotsamikael.applycam.common.PageResponse;
import com.jotsamikael.applycam.promoter.Promoter;
import com.jotsamikael.applycam.promoter.PromoterRepository;
import com.jotsamikael.applycam.subject.Subject;
import com.jotsamikael.applycam.subject.SubjectResponse;
import com.jotsamikael.applycam.subject.UpdateSubjectRequest;
import com.jotsamikael.applycam.trainingCenter.TrainingCenter;
import com.jotsamikael.applycam.trainingCenter.TrainingCenterRepository;
import com.jotsamikael.applycam.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CampusService {
    private final CampusRepository campusRepository;
    private final PromoterRepository promoterRepository;
    private final TrainingCenterRepository trainingCenterRepository;
    private final CampusMapper mapper;


    public String createCampus(CreateCampusRequest request, Authentication connectedUser) {
    	//check if it created already
    	if (campusRepository.existsByName(request.getName())) {
            throw new DataIntegrityViolationException(" already created");
        }
    	
        //get user object from connected user
        User user = ((User) connectedUser.getPrincipal());

        //check connected user is promoter pr throw exception
        Promoter promoter = promoterRepository.findByEmail(user.getEmail()).orElseThrow(() -> new EntityNotFoundException("Not a promoter" + user.getEmail()));
        
        //find the trainingCenter - handle duplicate agreement numbers
        List<TrainingCenter> trainingCenters = trainingCenterRepository.findAllByAgreementNumber(request.getTrainingCenterAgr());
        if (trainingCenters.isEmpty()) {
            throw new EntityNotFoundException("No training center found for this Agreement number: " + request.getTrainingCenterAgr());
        }
        // Take the first one if there are duplicates (should be fixed in database)
        TrainingCenter trainingCenter = trainingCenters.get(0);
        
        //find all training centers linked to this promoter and check if training center in request matches this one
        List<TrainingCenter> centers = trainingCenterRepository.findByPromoter(promoter).orElseThrow(() -> new EntityNotFoundException("No a training center found for promoter" + promoter.getEmail()));

        if (!centers.contains(trainingCenter)) {
            throw new EntityNotFoundException("Not a training center of connected promoter");
        }
        
        // set default coordinates if null
        Double xCoor = request.getXCoor() != null ? request.getXCoor() : 0.0;
        Double yCoor = request.getYCoor() != null ? request.getYCoor() : 0.0;
        //build campus object
        var campus = Campus.builder()
                .name(request.getName())
                .capacity(request.getCapacity())
                .town(request.getTown())
                .quarter(request.getQuarter())
                .xCoor(xCoor)
                .yCoor(yCoor)
                .trainingCenter(trainingCenter)
                .build();

        //save object
        return campusRepository.save(campus).getName();

    }

    public List<CampusResponse> findCampusByTrainingCenter(String agreementNumber) {

        List<TrainingCenter> trainingCenters = trainingCenterRepository.findAllByAgreementNumber(agreementNumber);
        if (trainingCenters.isEmpty()) {
            throw new EntityNotFoundException("No training center with agreement num: " + agreementNumber);
        }
        // Take the first one if there are duplicates
        TrainingCenter trainingCenter = trainingCenters.get(0);
        
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
    
    public String updateCampus(UpdateCampusRequest updateCampusRequest,  Authentication connectedUser) {
    	
   	 User user = ((User) connectedUser.getPrincipal());
   	 
   	 //check connected user is promoter or throw exception
     Promoter promoter = promoterRepository.findByEmail(user.getEmail()).orElseThrow(() -> new EntityNotFoundException("Not a promoter" + user.getEmail()));

       Campus campus = campusRepository.findByName(updateCampusRequest.getOldName()).orElseThrow(() -> new EntityNotFoundException("Campus not found"));
       
       TrainingCenter trainingCenter= campus.getTrainingCenter();
       
     //find all training centers linked to this promoter and check if training center in request matches this one
       List<TrainingCenter> centers = trainingCenterRepository.findByPromoter(promoter).orElseThrow(() -> new EntityNotFoundException("No a training center found for promoter" + promoter.getEmail()));

       if (!centers.contains(trainingCenter)) {
           throw new EntityNotFoundException("You cannot update others campus or this is not one of your campus");
       
       }
       
       if (!campus.isActived() ) {
       	throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This Campus cannot be updated.");
       }

       campus.setName(updateCampusRequest.getName());
       campus.setCapacity(updateCampusRequest.getCapacity());
       campus.setQuarter(updateCampusRequest.getQuarter());
       campus.setTown(updateCampusRequest.getTown());
       campus.setXCoor(updateCampusRequest.getXCoor());
       campus.setYCoor(updateCampusRequest.getYCoor());
       campus.setLastModifiedBy(user.getIdUser());
       campus.setLastModifiedDate(LocalDateTime.now());

       campusRepository.save(campus);
       return campus.getName();
   }
    
    public CampusResponse findByName(String name, Authentication connectedUser) {
    	
    	 User user = ((User) connectedUser.getPrincipal());
       	 
       	 //check connected user is promoter or throw exception
         Promoter promoter = promoterRepository.findByEmail(user.getEmail()).orElseThrow(() -> new EntityNotFoundException("Not a promoter" + user.getEmail()));
         
        Campus campus = campusRepository.findByName(name).orElseThrow(() -> new EntityNotFoundException("Campus not found"));
        
        TrainingCenter trainingCenter= campus.getTrainingCenter();
        
        //find all training centers linked to this promoter and check if training center in request matches this one
          List<TrainingCenter> centers = trainingCenterRepository.findByPromoter(promoter).orElseThrow(() -> new EntityNotFoundException("No a training center found for promoter" + promoter.getEmail()));

          if (!centers.contains(trainingCenter)) {
              throw new EntityNotFoundException("This is not one of your Campus");
          
          }
        
        if (!campus.isActived()) {
            return CampusResponse.builder()
                .name("this campus is deleted")
                .build();
        }
        
        return CampusResponse.builder()
            .name(campus.getName())
            .capacity(campus.getCapacity())
            .quarter(campus.getQuarter())
            .town(campus.getTown())
            .xCoor(campus.getXCoor())
            .yCoor(campus.getYCoor())
            .build();
    }
    
    public List<CampusResponse> findAllCampusOfPromoter( Authentication connectedUser) {
        User user = ((User) connectedUser.getPrincipal());

        Promoter promoter = promoterRepository.findByEmail(user.getEmail()).orElseThrow(() -> new EntityNotFoundException("Not a promoter" + user.getEmail()));

        List<TrainingCenter> trainingCenters = trainingCenterRepository.findByPromoter(promoter).orElseThrow(() -> new EntityNotFoundException("No a training center found for promoter" + promoter.getEmail()));
        
        List<Campus> allCampuses = new ArrayList<>();
        for (TrainingCenter center : trainingCenters) {
            List<Campus> campuses = campusRepository.findByTrainingCenter(center)
                .orElseThrow(() -> new EntityNotFoundException("No campus found for training center: " + center.getAgreementNumber()));
            allCampuses.addAll(campuses);
        }
          List<CampusResponse> responses = allCampuses.stream().map(campus->CampusResponse.builder()
            .name(campus.getName())
            .capacity(campus.getCapacity())
            .quarter(campus.getQuarter())
            .town(campus.getTown())
            .xCoor(campus.getXCoor())
            .yCoor(campus.getYCoor())
            .build()).toList();
          
          return responses;
        }
        
    public void deleteCampus(String name, Authentication connectedUser){
        User user = ((User) connectedUser.getPrincipal());

        Promoter promoter = promoterRepository.findByEmail(user.getEmail()).orElseThrow(() -> new EntityNotFoundException("Not a promoter" + user.getEmail()));

        Campus campus = campusRepository.findByName(name).orElseThrow(() -> new EntityNotFoundException("Campus not found"));
        
        TrainingCenter trainingCenter = campus.getTrainingCenter();
        
        //find all training centers linked to this promoter and check if training center in request matches this one
        List<TrainingCenter> centers = trainingCenterRepository.findByPromoter(promoter).orElseThrow(() -> new EntityNotFoundException("No a training center found for promoter" + promoter.getEmail()));

        if (!centers.contains(trainingCenter)) {
            throw new EntityNotFoundException("You cannot delete others campus or this is not one of your campus");
        }
        
        if(campus.isActived()){
            campus.setActived(false);
        }else{
            campus.setActived(true);
        }
        campusRepository.save(campus);
    }
    
    public PageResponse<CampusResponse> getAllCampuses(int offset, int pageSize, String field, boolean order) {
        Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();
        Page<Campus> list = campusRepository.getAll(PageRequest.of(offset, pageSize, sort));
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

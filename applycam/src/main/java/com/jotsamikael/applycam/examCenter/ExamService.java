package com.jotsamikael.applycam.examCenter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.jotsamikael.applycam.candidate.Candidate;
import com.jotsamikael.applycam.candidate.CandidateRepository;
import com.jotsamikael.applycam.common.PageResponse;
import com.jotsamikael.applycam.hasSchooled.HasSchooled;
import com.jotsamikael.applycam.session.Session;
import com.jotsamikael.applycam.session.SessionResponse;
import com.jotsamikael.applycam.session.UpdateSessionRequest;
import com.jotsamikael.applycam.trainingCenter.TrainingCenter;
import com.jotsamikael.applycam.user.User;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final CandidateRepository candidateRepository;
    private final ExamCenterRepository examCenterRepository;

    public void assignRandomExamCenterToCandidate(String email) {
    	
        Candidate candidate = candidateRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Candidat introuvable"));

        List<HasSchooled> hasSchooledList = candidate.getHasSchooledList();
        if (hasSchooledList == null || hasSchooledList.isEmpty()) {
            throw new IllegalStateException("Le candidat n'a aucun historique de formation.");
        }

        // Trier les HasSchooled par endYear décroissant (le plus récent en premier)
        hasSchooledList.sort(Comparator.comparing(HasSchooled::getEndYear, Comparator.nullsLast(Comparator.reverseOrder())));

        TrainingCenter trainingCenter = hasSchooledList.get(0).getTrainingCenter();
        if (trainingCenter == null) {
            throw new IllegalStateException("Le dernier centre de formation est introuvable.");
        }

        String region = trainingCenter.getRegion();
        String division = trainingCenter.getDivision();

        // Liste des centres d'examen actifs pour cette région et division
        List<ExamCenter> matchingCenters = examCenterRepository.findByRegionAndDivisionAndIsActivedTrue(region, division);
        if (matchingCenters.isEmpty()) {
            throw new EntityNotFoundException("Aucun centre d'examen actif trouvé pour cette région/division.");
        }

        // Map des affectations existantes (centreId -> nombre de candidats)
        Map<Long, Long> centerIdToCandidateCount = new HashMap<>();
        for (Object[] row : examCenterRepository.countCandidatesPerExamCenter()) {
            Long centerId = (Long) row[0];
            Long count = (Long) row[1];
            centerIdToCandidateCount.put(centerId, count);
        }

        // Ne garder que les centres qui ont encore de la place (capacité > nb affectés)
        List<ExamCenter> eligibleCenters = matchingCenters.stream()
                .filter(center -> {
                    long count = centerIdToCandidateCount.getOrDefault(center.getId(), 0L);
                    return count < center.getCapacity();
                })
                .toList();

        if (eligibleCenters.isEmpty()) {
            throw new IllegalStateException("Tous les centres d'examen sont pleins dans cette région/division.");
        }

        // Trouver les centres les moins chargés parmi les éligibles
        long minCount = Long.MAX_VALUE;
        List<ExamCenter> leastLoadedCenters = new ArrayList<>();

        for (ExamCenter center : eligibleCenters) {
            long count = centerIdToCandidateCount.getOrDefault(center.getId(), 0L);
            if (count < minCount) {
                minCount = count;
                leastLoadedCenters.clear();
                leastLoadedCenters.add(center);
            } else if (count == minCount) {
                leastLoadedCenters.add(center);
            }
        }

        // Sélection aléatoire parmi les moins chargés
        Collections.shuffle(leastLoadedCenters);
        ExamCenter selected = leastLoadedCenters.get(0);

        candidate.setExamCenter(selected);
        candidateRepository.save(candidate);
    }
    
    public String createExamCenter(CreateCenterRequest request, Authentication connectedUser) {
    	
    	User user=(User) connectedUser.getPrincipal();
    	
    	var examCenter= ExamCenter.builder()
    			.name(request.getName())
    			.division(request.getDivision())
    			.region(request.getRegion())
    			.capacity(request.getCapacity())
    			.createdBy(user.getIdUser())
    			.createdDate(LocalDateTime.now())
    			.isActived(true)
    			.build();
    	
    	examCenterRepository.save(examCenter);
    	
    	return"created Succesfuly";
    	
    }
    
    public Long updateExamCenter(UpdateCenterRequest updateCenterRequest, Authentication connectedUser){
        User user=(User) connectedUser.getPrincipal();

        ExamCenter examCenter= examCenterRepository.findById(updateCenterRequest.getExamCenterId()).
        orElseThrow(()-> new EntityNotFoundException("Ce centre d'examen n'existe pas"));
        
        if (!examCenter.isActived() ) {
           	throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This exam center cannot be updated.");
           }

        examCenter.setName(updateCenterRequest.getName());
        examCenter.setDivision(updateCenterRequest.getDivision());
        examCenter.setRegion(updateCenterRequest.getRegion());
        examCenter.setCapacity(updateCenterRequest.getCapacity());
        examCenter.setLastModifiedBy(user.getIdUser());
        examCenter.setLastModifiedDate(LocalDateTime.now());

        examCenterRepository.save(examCenter);

        return updateCenterRequest.getExamCenterId();
    }
    
    public PageResponse<ExamCenterResponse> getAllExamCenter(int offset, int pageSize, String field, boolean order) {
        Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();

        Page<ExamCenter> list= examCenterRepository.findAllExamCenter(PageRequest.of(offset, pageSize, sort));

        List<ExamCenterResponse> responses= list.getContent().stream().map(examCenter->ExamCenterResponse.builder()
        .id(examCenter.getId())
        .name(examCenter.getName())
        .region(examCenter.getRegion())
        .division(examCenter.getDivision())
        .capacity(examCenter.getCapacity())
        .build()).toList();

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
    
    public void deleteExamCenter(Long examCenterId, Authentication connectedUser){
        User user =(User) connectedUser.getPrincipal();
        ExamCenter examCenter= examCenterRepository.findById(examCenterId)
        .orElseThrow(()->new EntityNotFoundException("Exam center Not found"));

        if(examCenter.isActived()){
        	examCenter.setActived(false);
        	examCenter.setArchived(true);
            
        }else{
        	examCenter.setActived(true);
        	examCenter.setArchived(false);
        }
        examCenter.setLastModifiedBy(user.getIdUser());
        examCenter.setLastModifiedDate(LocalDateTime.now());

        examCenterRepository.save(examCenter);
    }
    
    public PageResponse<ExamCenterResponse> findExamCenterByDivision(String division,int offset, int pageSize, String field, boolean order) {
        Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();

        Page<ExamCenter> list= examCenterRepository.findAllByDivision(division,PageRequest.of(offset, pageSize, sort));

        List<ExamCenterResponse> responses= list.getContent().stream().map(examCenter->ExamCenterResponse.builder()
        		.id(examCenter.getId())
                .name(examCenter.getName())
                .region(examCenter.getRegion())
                .division(examCenter.getDivision())
                .capacity(examCenter.getCapacity())
                .build()).toList();

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


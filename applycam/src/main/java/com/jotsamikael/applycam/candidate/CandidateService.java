package com.jotsamikael.applycam.candidate;
import com.jotsamikael.applycam.common.ContentStatus;
import com.jotsamikael.applycam.common.PageResponse;
import com.jotsamikael.applycam.promoter.Promoter;
import com.jotsamikael.applycam.promoter.PromoterRepository;
import com.jotsamikael.applycam.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final CandidateMapper mapper;
    private final PromoterRepository promoterRepository;


    public PageResponse<CandidateResponse> getAllCandidates(int offset, int pageSize, String field, boolean order) {
        Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();

        Page<Candidate> list = candidateRepository.getAllCandidate(
                PageRequest.of(offset, pageSize, sort));

        List<CandidateResponse> responses = list.stream().map(mapper::toCandidateResponse).toList();
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

    public CandidateResponse findCandidateByEmail(String email) {
      Candidate candidate =  candidateRepository.findByEmail(email).orElseThrow(()-> new EntityNotFoundException("No candidate with found email"+ email));
        return mapper.toCandidateResponse(candidate);
    }

    public String updateProfile(String email, CandidateRequest request, Authentication connectedUser) {
        //start by getting the candidate by email or throw an exception
        Candidate candidate = candidateRepository.findByEmail(email).orElseThrow(()-> new EntityNotFoundException("No candidate with found email"+ email));
        
        if (!candidate.isActived() ) {
        	throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This Candidate cannot be updated.");
        }

        //modify the candidate object using the request data
        candidate.setFirstname(request.firstname());
        candidate.setLastname(request.lastname());
        candidate.setDateOfBirth(request.dateOfBirth());
        candidate.setEmail(request.email());
        candidate.setPhoneNumber(request.phoneNumber());
        candidate.setNationalIdNumber(request.nationalIdNumber());
        candidate.setSex(request.sex());
        candidate.setPlaceOfBirth(request.placeOfBirth());
        candidate.setMotherFullName(request.motherFullName());
        candidate.setFatherFullName(request.fatherFullName());
        candidate.setMotherProfession(request.motherProfession());
        candidate.setFatherProfession(request.fatherProfession());
        candidate.setHighestSchoolLevel(request.highestSchoolLevel());
        candidate.setNationality(request.nationality());
        candidate.setTownOfResidence(request.townOfResidence());

        //get connected user and date time for audit purpose
        User user = ((User) connectedUser.getPrincipal());
        candidate.setLastModifiedDate(LocalDateTime.now());
        candidate.setLastModifiedBy(user.getIdUser());

        //save the modified candidate object
        candidateRepository.save(candidate);

        //return
        return email;
    }
    public PageResponse<CandidateResponse> getCandidatesOfConnectedPromoter(Authentication connectedUser, int year, int offset, int pageSize, String field, boolean order) {

        Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();
        
        int currentYear = Year.now().getValue();
        if (year <= 1900 || year > 2100) {
            System.out.println("The year given is not correct (" + year + "). We use the current date : " + currentYear);
            year = currentYear;
        }
        User user = (User) connectedUser.getPrincipal();
        Promoter promoter = promoterRepository.findByEmail(user.getEmail()).orElseThrow(()-> new EntityNotFoundException("You are not a promoter or you are not connected"));


        Page<Candidate> candidates = candidateRepository.findAllBypromoterId(user.getIdUser(), year, PageRequest.of(offset,pageSize,sort));

        List<CandidateResponse> candidateResponses = candidates.getContent().stream()
                                                    .map(candidate->CandidateResponse.builder()
                                                    .firstname(candidate.getFirstname())
                                                    .lastname(candidate.getLastname())
                                                     .dateOfBirth(candidate.getDateOfBirth())
                                                     .contentStatus(candidate.getContentStatus())
                                                     .build())
                                                     .toList();
        
        return new PageResponse<>(
            candidateResponses,
            candidates.getNumber(),
            candidates.getSize(),
            candidates.getTotalElements(),
            candidates.getTotalPages(),
            candidates.isFirst(),
            candidates.isLast()
        );
    }
    
    public CandidateResponse findByName(Long promoterId, String name ){
        Candidate candidate_finded = candidateRepository.findCandidateByName(promoterId,name).orElseThrow(()-> new EntityNotFoundException("the candidate is not in one of your training Center or does not exist"));
        
        if (!candidate_finded.isActived() ) {
        	throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This Candidate has been deleted.");
        }
        
         return mapper.toCandidateResponse(candidate_finded);
    }
    
   
    
    public void toggleCandidate(String email, Authentication connectedUser) {
        Candidate candidate = candidateRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("No promoter found with email: " + email));
        
        User user = (User) connectedUser.getPrincipal();
        if (candidate.isActived()) {
            // Désactivation
        	candidate.setEnabled(false);
        	candidate.setActived(false);
        	candidate.setArchived(true);
        } else {
            // Réactivation
        	candidate.setEnabled(true);
        	candidate.setActived(true);
        	candidate.setArchived(false);
        }
      //get connected user and date time for audit purpose
        candidate.setLastModifiedBy(user.getIdUser());
        candidate.setLastModifiedDate(LocalDateTime.now());
        // saving the promoter and it status
        candidateRepository.save(candidate);
        
        
    }
    
    
    
}

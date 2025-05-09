package com.jotsamikael.applycam.candidate;
import com.jotsamikael.applycam.common.ContentStatus;
import com.jotsamikael.applycam.common.PageResponse;
import com.jotsamikael.applycam.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final CandidateMapper mapper;


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
}

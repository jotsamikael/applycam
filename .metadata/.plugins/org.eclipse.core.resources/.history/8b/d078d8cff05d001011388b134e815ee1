package com.jotsamikael.applycam.session;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.jotsamikael.applycam.common.PageResponse;
import com.jotsamikael.applycam.user.User;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SessionService {
	
	private final SessionRepository sessionRepository;
	
	public String createSession(CreateSessionRequest createSessionRequest, Authentication connectedUser){
		
		
        User user=(User) connectedUser.getPrincipal();
        
        String year = createSessionRequest.getSessionYear();
        String examType = createSessionRequest.getExamType().toUpperCase();

        // Vérifie les limites en fonction du type d'examen
        long count = sessionRepository.countBySessionYearAndExamType(year, examType);

        if (examType.equals("DQP") && count >= 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Une seule session DQP est autorisée pour l'année " + year);
        }

        if (examType.equals("CQP") && count >= 4) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Maximum 4 sessions CQP sont autorisées pour l'année " + year);
        }

        var session = Session.builder()
                .examType(createSessionRequest.getExamType())
                .examDate(createSessionRequest.getExamDate())
                .sessionYear(createSessionRequest.getSessionYear())
                .createdBy(user.getIdUser())
                .createdDate(LocalDateTime.now())
                .isActived(true)
                .build();

        
        sessionRepository.save(session);
        return "session creer pour l'annee" +session.getSessionYear();
    }

    public Long updateSession(UpdateSessionRequest updateSessionRequest, Authentication connectedUser){
        User user=(User) connectedUser.getPrincipal();

        Session session= sessionRepository.findById(updateSessionRequest.getSessionId()).
        orElseThrow(()-> new EntityNotFoundException("Cette session n'existe pas"));
        
        if (!session.isActived() ) {
           	throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This Session cannot be updated.");
           }

        session.setExamType(updateSessionRequest.getExamType());
        session.setExamDate(updateSessionRequest.getExamDate());
        session.setSessionYear(updateSessionRequest.getSessionYear());
        session.setLastModifiedBy(user.getIdUser());
        session.setLastModifiedDate(LocalDateTime.now());

        sessionRepository.save(session);

        return updateSessionRequest.getSessionId();
    }

    public PageResponse<SessionResponse> getAllSession(int offset, int pageSize, String field, boolean order) {
        Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();

        Page<Session> list= sessionRepository.findAllSession(PageRequest.of(offset, pageSize, sort));

        List<SessionResponse> responses= list.getContent().stream().map(session->SessionResponse.builder()
        .examType(session.getExamType())
        .examDate(session.getExamDate())
        .sessionYear(session.getSessionYear())
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

    public List<SessionResponse>findByExamDate(LocalDate examDate){

       List<Session> sessions= sessionRepository.findByExamDate(examDate).
        orElseThrow(()->new EntityNotFoundException("This Session does not exist"));
       
       List<SessionResponse> responses= sessions.stream()
    	        .map(session -> {
    	            if (!session.isActived()) {
    	                return SessionResponse.builder()
    	                        .id(session.getId())
    	                        .examType("This session was deleted.")
    	                        .build();
    	            } else {
    	                return SessionResponse.builder()
    	                        .id(session.getId())
    	                        .examType(session.getExamType())
    	                        .examDate(session.getExamDate())
    	                        .sessionYear(session.getSessionYear())
    	                        .build();
    	            }
    	        })
    	        .toList();
       
       return responses;


    }

    public void deleteSession(Long sessionId, Authentication connectedUser){
        User user =(User) connectedUser.getPrincipal();
        Session session= sessionRepository.findById(sessionId)
        .orElseThrow(()->new EntityNotFoundException("Session Not found"));

        if(session.isActived()){
        	session.setActived(false);
        	session.setArchived(true);
            
        }else{
        	session.setActived(true);
        	session.setArchived(false);
        }
        session.setLastModifiedBy(user.getIdUser());
        session.setLastModifiedDate(LocalDateTime.now());

        sessionRepository.save(session);
    }
    
    public PageResponse<SessionResponse> findSessionByYear(String sessionYear,int offset, int pageSize, String field, boolean order) {
        Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();

        Page<Session> list= sessionRepository.findAllBySessionYear(sessionYear,PageRequest.of(offset, pageSize, sort));

        List<SessionResponse> responses= list.getContent().stream().map(session->SessionResponse.builder()
        .examType(session.getExamType())
        .examDate(session.getExamDate())
        .sessionYear(session.getSessionYear())
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

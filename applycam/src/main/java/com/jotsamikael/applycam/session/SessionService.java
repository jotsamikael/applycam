package com.jotsamikael.applycam.session;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.jotsamikael.applycam.common.PageResponse;
import com.jotsamikael.applycam.course.Course;
import com.jotsamikael.applycam.course.CourseRepository;
import com.jotsamikael.applycam.course.CourseResponse;
import com.jotsamikael.applycam.speciality.Speciality;
import com.jotsamikael.applycam.speciality.SpecialityRepository;
import com.jotsamikael.applycam.speciality.SpecialityResponse;
import com.jotsamikael.applycam.user.User;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SessionService {

	private final SessionRepository sessionRepository;
	private final CourseRepository courseRepository;
	private final SpecialityRepository specialityRepository;

	/**
	 * Créer une nouvelle session avec validation complète
	 */
	@Transactional
	public String createSession(CreateSessionRequest createSessionRequest, Authentication connectedUser) {
		try {
			log.info("Début de création de la session: {}", createSessionRequest.getSessionYear());
			
			User user = validateAndGetUser(connectedUser);
			
			// Validation des données
			validateSessionData(createSessionRequest);
			
			// Vérification de l'unicité
			if (sessionRepository.findBySessionYearAndExamType(
				createSessionRequest.getSessionYear(), createSessionRequest.getExamType()).isPresent()) {
				throw new DataIntegrityViolationException(
					"Une session avec cette année et ce type d'examen existe déjà");
			}

			var session = Session.builder()
				.examType(createSessionRequest.getExamType())
				.examDate(createSessionRequest.getExamDate())
				.sessionYear(createSessionRequest.getSessionYear())
				.createdBy(user.getIdUser())
				.createdDate(LocalDateTime.now())
				.isActived(true)
				.isArchived(false)
				.build();

			sessionRepository.save(session);
			log.info("Session créée avec succès: {}", session.getSessionYear());
			return session.getSessionYear();
			
		} catch (DataIntegrityViolationException e) {
			log.error("Erreur de contrainte lors de la création de la session: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.CONFLICT, 
				"Erreur de contrainte: " + e.getMessage());
		} catch (Exception e) {
			log.error("Erreur lors de la création de la session: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la création de la session: " + e.getMessage());
		}
	}

	/**
	 * Mettre à jour une session avec validation
	 */
	@Transactional
	public Long updateSession(UpdateSessionRequest updateSessionRequest, Authentication connectedUser) {
		try {
			log.info("Début de mise à jour de la session ID: {}", updateSessionRequest.getSessionId());
			
			User user = validateAndGetUser(connectedUser);
			Session session = validateAndGetSession(updateSessionRequest.getSessionId());
			
			// Vérification que la session peut être mise à jour
			if (!session.isActived()) {
				throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
					"Cette session ne peut pas être mise à jour car elle a été supprimée");
			}

			// Validation des données
			validateSessionUpdateData(updateSessionRequest);

			session.setExamType(updateSessionRequest.getExamType());
			session.setExamDate(updateSessionRequest.getExamDate());
			session.setSessionYear(updateSessionRequest.getSessionYear());
			session.setLastModifiedBy(user.getIdUser());
			session.setLastModifiedDate(LocalDateTime.now());

			sessionRepository.save(session);
			log.info("Session mise à jour avec succès: {}", session.getSessionYear());
			return session.getId();
			
		} catch (Exception e) {
			log.error("Erreur lors de la mise à jour de la session: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la mise à jour: " + e.getMessage());
		}
	}

	/**
	 * Récupérer toutes les sessions avec pagination
	 */
	public PageResponse<SessionResponse> getAllSession(int offset, int pageSize, String field, boolean order) {
		try {
			log.info("Récupération des sessions - offset: {}, pageSize: {}", offset, pageSize);
			
			Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();
			Page<Session> sessions = sessionRepository.findAllSession(PageRequest.of(offset, pageSize, sort));

			List<SessionResponse> responses = sessions.getContent().stream()
				.map(session -> {
					if (!session.isActived()) {
						return SessionResponse.builder()
							.id(session.getId())
							.examType("Cette session a été supprimée.")
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

			return new PageResponse<>(
				responses,
				sessions.getNumber(),
				sessions.getSize(),
				sessions.getTotalElements(),
				sessions.getTotalPages(),
				sessions.isFirst(),
				sessions.isLast()
			);
		} catch (Exception e) {
			log.error("Erreur lors de la récupération des sessions: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la récupération des sessions");
		}
	}

	/**
	 * Récupérer toutes les sessions (actives et inactives) pour diagnostic
	 */
	public PageResponse<SessionResponse> getAllSessionsIncludingInactive(int offset, int pageSize, String field, boolean order) {
		try {
			log.info("Récupération de toutes les sessions (incluant inactives) - offset: {}, pageSize: {}", offset, pageSize);
			
			Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();
			Page<Session> sessions = sessionRepository.findAllSessionsIncludingInactive(PageRequest.of(offset, pageSize, sort));

			List<SessionResponse> responses = sessions.getContent().stream()
				.map(session -> SessionResponse.builder()
					.id(session.getId())
					.examType(session.getExamType())
					.examDate(session.getExamDate())
					.sessionYear(session.getSessionYear())
					.build())
				.toList();

			return new PageResponse<>(
				responses,
				sessions.getNumber(),
				sessions.getSize(),
				sessions.getTotalElements(),
				sessions.getTotalPages(),
				sessions.isFirst(),
				sessions.isLast()
			);
		} catch (Exception e) {
			log.error("Erreur lors de la récupération de toutes les sessions: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la récupération de toutes les sessions");
		}
	}

	/**
	 * Trouver des sessions par date d'examen
	 */
	public List<SessionResponse> findByExamDate(LocalDate examDate) {
		try {
			log.info("Recherche des sessions par date d'examen: {}", examDate);
			
			if (examDate == null) {
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La date d'examen est requise");
			}

			List<Session> sessions = sessionRepository.findByExamDate(examDate)
				.orElseThrow(() -> new EntityNotFoundException("Aucune session trouvée pour cette date"));

			List<SessionResponse> responses = sessions.stream()
				.map(session -> {
					if (!session.isActived()) {
						return SessionResponse.builder()
							.id(session.getId())
							.examType("Cette session a été supprimée.")
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
		} catch (EntityNotFoundException e) {
			log.warn("Sessions non trouvées: {}", e.getMessage());
			throw e;
		} catch (Exception e) {
			log.error("Erreur lors de la recherche par date: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la recherche par date");
		}
	}

	/**
	 * Désactiver/réactiver une session
	 */
	@Transactional
	public void deleteSession(Long sessionId, Authentication connectedUser) {
		try {
			log.info("Changement de statut de la session ID: {}", sessionId);
			
			User user = validateAndGetUser(connectedUser);
			Session session = validateAndGetSession(sessionId);
			
			if (session.isActived()) {
				// Désactivation
				session.setActived(false);
				session.setArchived(true);
				log.info("Session désactivée: {}", sessionId);
			} else {
				// Réactivation
				session.setActived(true);
				session.setArchived(false);
				log.info("Session réactivée: {}", sessionId);
			}
			
			// Audit
			session.setLastModifiedBy(user.getIdUser());
			session.setLastModifiedDate(LocalDateTime.now());

			sessionRepository.save(session);
		} catch (Exception e) {
			log.error("Erreur lors du changement de statut de la session: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors du changement de statut: " + e.getMessage());
		}
	}

	/**
	 * Supprimer définitivement une session
	 */
	@Transactional
	public void deleteSessionPermanently(Long sessionId, Authentication connectedUser) {
		try {
			log.info("Suppression définitive de la session ID: {}", sessionId);
			
			User user = validateAndGetUser(connectedUser);
			Session session = validateAndGetSession(sessionId);
			
			// Vérification des droits (seul le STAFF peut supprimer définitivement)
			boolean isStaff = user.getRoles().stream()
				.anyMatch(role -> "STAFF".equals(role.getName()));
			
			if (!isStaff) {
				throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
					"Seuls les membres du staff peuvent supprimer définitivement une session");
			}
			
			// Suppression définitive
			sessionRepository.delete(session);
			log.info("Session supprimée définitivement: {}", sessionId);
		} catch (Exception e) {
			log.error("Erreur lors de la suppression définitive: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la suppression: " + e.getMessage());
		}
	}

	/**
	 * Désactiver une session (soft delete)
	 */
	@Transactional
	public void deactivateSession(Long sessionId, Authentication connectedUser) {
		try {
			log.info("Désactivation de la session ID: {}", sessionId);
			
			User user = validateAndGetUser(connectedUser);
			Session session = validateAndGetSession(sessionId);
			
			// Vérification des droits
			boolean isStaff = user.getRoles().stream()
				.anyMatch(role -> "STAFF".equals(role.getName()));
			
			if (!isStaff) {
				throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
					"Seuls les membres du staff peuvent désactiver une session");
			}
			
			// Désactivation
			session.setActived(false);
			session.setArchived(true);
			session.setLastModifiedBy(user.getIdUser());
			session.setLastModifiedDate(LocalDateTime.now());
			
			sessionRepository.save(session);
			log.info("Session désactivée avec succès: {}", sessionId);
		} catch (Exception e) {
			log.error("Erreur lors de la désactivation: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la désactivation: " + e.getMessage());
		}
	}

	/**
	 * Réactiver une session
	 */
	@Transactional
	public void reactivateSession(Long sessionId, Authentication connectedUser) {
		try {
			log.info("Réactivation de la session ID: {}", sessionId);
			
			User user = validateAndGetUser(connectedUser);
			Session session = validateAndGetSession(sessionId);
			
			// Vérification des droits (seul le STAFF peut réactiver)
			boolean isStaff = user.getRoles().stream()
				.anyMatch(role -> "STAFF".equals(role.getName()));
			
			if (!isStaff) {
				throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
					"Seuls les membres du staff peuvent réactiver une session");
			}
			
			// Réactivation
			session.setActived(true);
			session.setArchived(false);
			session.setLastModifiedBy(user.getIdUser());
			session.setLastModifiedDate(LocalDateTime.now());
			
			sessionRepository.save(session);
			log.info("Session réactivée avec succès: {}", sessionId);
		} catch (Exception e) {
			log.error("Erreur lors de la réactivation: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la réactivation: " + e.getMessage());
		}
	}

	/**
	 * Récupérer une session par ID
	 */
	public SessionResponse getSessionById(Long sessionId) {
		try {
			log.info("Récupération de la session ID: {}", sessionId);
			
			Session session = sessionRepository.findById(sessionId)
				.orElseThrow(() -> new EntityNotFoundException("Session non trouvée avec l'ID: " + sessionId));
				
			return SessionResponse.builder()
				.id(session.getId())
				.examType(session.getExamType())
				.examDate(session.getExamDate())
				.sessionYear(session.getSessionYear())
				.build();
		} catch (EntityNotFoundException e) {
			log.warn("Session non trouvée: {}", e.getMessage());
			throw e;
		} catch (Exception e) {
			log.error("Erreur lors de la récupération de la session: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la récupération de la session");
		}
	}

	/**
	 * Récupérer des sessions par année
	 */
	public PageResponse<SessionResponse> findSessionByYear(String sessionYear, int offset, int pageSize, String field, boolean order) {
		try {
			log.info("Recherche des sessions par année: {}", sessionYear);
			
			if (sessionYear == null || sessionYear.trim().isEmpty()) {
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'année de session est requise");
			}

			Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();
			Page<Session> sessions = sessionRepository.findAllBySessionYear(sessionYear.trim(), PageRequest.of(offset, pageSize, sort));

			List<SessionResponse> responses = sessions.getContent().stream()
				.map(session -> {
					if (!session.isActived()) {
						return SessionResponse.builder()
							.id(session.getId())
							.examType("Cette session a été supprimée.")
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

			return new PageResponse<>(
				responses,
				sessions.getNumber(),
				sessions.getSize(),
				sessions.getTotalElements(),
				sessions.getTotalPages(),
				sessions.isFirst(),
				sessions.isLast()
			);
		} catch (ResponseStatusException e) {
			throw e;
		} catch (Exception e) {
			log.error("Erreur lors de la recherche par année: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la recherche par année");
		}
	}

	/**
	 * Récupérer les détails d'une session
	 */
	public SessionDetailsListResponse getSessionDetailsAsList(Long sessionId) {
		try {
			log.info("Récupération des détails de la session ID: {}", sessionId);
			
			Session session = validateAndGetSession(sessionId);
			
			// Récupération des spécialités et cours liés à cette session
			List<Speciality> specialities = session.getSpeciality();
			List<Course> courses = session.getCourse();

			List<SpecialityResponse> specialityResponses = specialities.stream()
				.map(speciality -> SpecialityResponse.builder()
					.id(speciality.getId())
					.name(speciality.getName())
					.code(speciality.getCode())
					.description(speciality.getDescription())
					.examType(speciality.getExamType())
					.build())
				.toList();

			List<CourseResponse> courseResponses = courses.stream()
				.map(course -> CourseResponse.builder()
					.name(course.getName())
					.code(course.getCode())
					.description(course.getDescription())
					.build())
				.toList();

			return SessionDetailsListResponse.builder()
				.specialities(specialityResponses)
				.courses(courseResponses)
				.build();
		} catch (Exception e) {
			log.error("Erreur lors de la récupération des détails: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la récupération des détails");
		}
	}

	// ==================== MÉTHODES PRIVÉES D'AIDE ====================
	
	private User validateAndGetUser(Authentication connectedUser) {
		if (connectedUser == null || connectedUser.getPrincipal() == null) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur non authentifié");
		}
		return (User) connectedUser.getPrincipal();
	}
	
	private Session validateAndGetSession(Long sessionId) {
		return sessionRepository.findById(sessionId)
			.orElseThrow(() -> new EntityNotFoundException("Session non trouvée avec l'ID: " + sessionId));
	}
	
	private void validateSessionData(CreateSessionRequest request) {
		if (request.getExamType() == null || request.getExamType().trim().isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le type d'examen est requis");
		}
		if (request.getExamDate() == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La date d'examen est requise");
		}
		if (request.getSessionYear() == null || request.getSessionYear().trim().isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'année de session est requise");
		}
	}
	
	private void validateSessionUpdateData(UpdateSessionRequest request) {
		if (request.getExamType() == null || request.getExamType().trim().isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le type d'examen est requis");
		}
		if (request.getExamDate() == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La date d'examen est requise");
		}
		if (request.getSessionYear() == null || request.getSessionYear().trim().isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'année de session est requise");
		}
	}
}

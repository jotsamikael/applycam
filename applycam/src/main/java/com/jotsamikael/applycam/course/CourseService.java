package com.jotsamikael.applycam.course;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.jotsamikael.applycam.trainingCenter.TrainingCenter;

import com.jotsamikael.applycam.activitySector.ActivitySector;
import com.jotsamikael.applycam.activitySector.SectorRepository;
import com.jotsamikael.applycam.common.PageResponse;
import com.jotsamikael.applycam.promoter.Promoter;
import com.jotsamikael.applycam.promoter.PromoterRepository;
import com.jotsamikael.applycam.session.Session;
import com.jotsamikael.applycam.session.SessionRepository;
import com.jotsamikael.applycam.speciality.Speciality;
import com.jotsamikael.applycam.speciality.SpecialityRepository;
import com.jotsamikael.applycam.trainingCenter.TrainingCenterRepository;
import com.jotsamikael.applycam.user.User;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CourseService {

	private final CourseRepository courseRepository;
	private final SpecialityRepository specialityRepository;
	private final SectorRepository activitySectorRepository;
	private final SessionRepository sessionRepository;
	private final TrainingCenterRepository trainingCenterRepository;

	/**
	 * Créer un nouveau cours avec validation complète
	 */
	@Transactional
	public String createCourse(CreateCourseRequest createCourseRequest, Authentication connectedUser) {
		try {
			log.info("Début de création du cours: {}", createCourseRequest.getName());
			
			User user = validateAndGetUser(connectedUser);
			
			// Validation de l'unicité du nom
			if (courseRepository.existsByName(createCourseRequest.getName())) {
				throw new DataIntegrityViolationException("Un cours avec ce nom existe déjà");
			}

			// Validation des données
			validateCourseData(createCourseRequest);
			
			var course = Course.builder()
				.name(createCourseRequest.getName())
				.code(createCourseRequest.getCode())
				.description(createCourseRequest.getDescription())
				.createdBy(user.getIdUser())
				.createdDate(LocalDateTime.now())
				.priceForCqp(createCourseRequest.getPriceForCqp())
				.isActived(true)
				.isArchived(false)
				.build();

			courseRepository.save(course);
			log.info("Cours créé avec succès: {}", course.getName());
			return course.getName();
			
		} catch (DataIntegrityViolationException e) {
			log.error("Erreur de contrainte lors de la création du cours: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.CONFLICT, 
				"Erreur de contrainte: " + e.getMessage());
		} catch (Exception e) {
			log.error("Erreur lors de la création du cours: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la création du cours: " + e.getMessage());
		}
	}
	
	/**
	 * Mettre à jour un cours avec validation
	 */
	@Transactional
	public String updateCourse(CourseRequest courseRequest, Authentication connectedUser) {
		try {
			log.info("Début de mise à jour du cours ID: {}", courseRequest.getId());
			
			User user = validateAndGetUser(connectedUser);
			Course course = validateAndGetCourse(courseRequest.getId());
			
			// Vérification que le cours peut être mis à jour
			if (!course.isActived()) {
				throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
					"Ce cours ne peut pas être mis à jour car il a été supprimé");
			}

			// Validation des données
			validateCourseUpdateData(courseRequest);

			course.setName(courseRequest.getName());
			course.setCode(courseRequest.getCode());
			course.setDescription(courseRequest.getDescription());
			course.setPriceForCqp(courseRequest.getPriceForCqp());
			course.setLastModifiedBy(user.getIdUser());
			course.setLastModifiedDate(LocalDateTime.now());

			courseRepository.save(course);
			log.info("Cours mis à jour avec succès: {}", course.getName());
			return course.getName();
			
		} catch (Exception e) {
			log.error("Erreur lors de la mise à jour du cours: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la mise à jour: " + e.getMessage());
		}
	}
	
	/**
	 * Récupérer tous les cours avec pagination
	 */
	public PageResponse<CourseResponse> getAllCourses(int offset, int pageSize, String field, boolean order) {
		try {
			log.info("Récupération des cours - offset: {}, pageSize: {}", offset, pageSize);
			
			Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();
			Page<Course> courses = courseRepository.findAll(PageRequest.of(offset, pageSize, sort));
			
			List<CourseResponse> courseResponses = courses.getContent().stream()
				.map(course -> CourseResponse.builder()
					.name(course.getName())
					.code(course.getCode())
					.description(course.getDescription())
					.build())
				.toList();

			return new PageResponse<>(
				courseResponses,
				courses.getNumber(),
				courses.getSize(),
				courses.getTotalElements(),
				courses.getTotalPages(),
				courses.isFirst(),
				courses.isLast()
			);
		} catch (Exception e) {
			log.error("Erreur lors de la récupération des cours: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la récupération des cours");
		}
	}
	
	/**
	 * Trouver un cours par nom
	 */
	public CourseResponse findByName(String name) {
		try {
			log.info("Recherche du cours par nom: {}", name);
			
			if (name == null || name.trim().isEmpty()) {
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le nom du cours est requis");
			}
			
			Course course = courseRepository.findByName(name.trim())
				.orElseThrow(() -> new EntityNotFoundException("Cours non trouvé avec le nom: " + name));
			
			if (!course.isActived()) {
				return CourseResponse.builder()
					.name(course.getName())
					.code(course.getCode())
					.description("Ce cours a été supprimé.")
					.build();
			}
			
			return CourseResponse.builder()
				.name(course.getName())
				.code(course.getCode())
				.description(course.getDescription())
				.build();
		} catch (EntityNotFoundException e) {
			log.warn("Cours non trouvé: {}", e.getMessage());
			throw e;
		} catch (Exception e) {
			log.error("Erreur lors de la recherche du cours: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la recherche du cours");
		}
	}
	
	/**
	 * Désactiver/réactiver un cours
	 */
	@Transactional
	public void toggleCourse(String name, Authentication connectedUser) {
		try {
			log.info("Changement de statut du cours: {}", name);
			
			User user = validateAndGetUser(connectedUser);
			Course course = validateAndGetCourseByName(name);
			
			if (course.isActived()) {
				// Désactivation
				course.setActived(false);
				course.setArchived(true);
				log.info("Cours désactivé: {}", name);
			} else {
				// Réactivation
				course.setActived(true);
				course.setArchived(false);
				log.info("Cours réactivé: {}", name);
			}
			
			// Audit
			course.setLastModifiedBy(user.getIdUser());
			course.setLastModifiedDate(LocalDateTime.now());
			
			courseRepository.save(course);
		} catch (Exception e) {
			log.error("Erreur lors du changement de statut du cours: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors du changement de statut: " + e.getMessage());
		}
	}
	
	/**
	 * Supprimer définitivement un cours
	 */
	@Transactional
	public void deleteCoursePermanently(String name, Authentication connectedUser) {
		try {
			log.info("Suppression définitive du cours: {}", name);
			
			User user = validateAndGetUser(connectedUser);
			Course course = validateAndGetCourseByName(name);
			
			// Vérification des droits (seul le STAFF peut supprimer définitivement)
			boolean isStaff = user.getRoles().stream()
				.anyMatch(role -> "STAFF".equals(role.getName()));
			
			if (!isStaff) {
				throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
					"Seuls les membres du staff peuvent supprimer définitivement un cours");
			}
			
			// Suppression définitive
			courseRepository.delete(course);
			log.info("Cours supprimé définitivement: {}", name);
		} catch (Exception e) {
			log.error("Erreur lors de la suppression définitive: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la suppression: " + e.getMessage());
		}
	}
	
	/**
	 * Désactiver un cours (soft delete)
	 */
	@Transactional
	public void deactivateCourse(String name, Authentication connectedUser) {
		try {
			log.info("Désactivation du cours: {}", name);
			
			User user = validateAndGetUser(connectedUser);
			Course course = validateAndGetCourseByName(name);
			
			// Vérification des droits
			boolean isStaff = user.getRoles().stream()
				.anyMatch(role -> "STAFF".equals(role.getName()));
			
			if (!isStaff) {
				throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
					"Seuls les membres du staff peuvent désactiver un cours");
			}
			
			// Désactivation
			course.setActived(false);
			course.setArchived(true);
			course.setLastModifiedBy(user.getIdUser());
			course.setLastModifiedDate(LocalDateTime.now());
			
			courseRepository.save(course);
			log.info("Cours désactivé avec succès: {}", name);
		} catch (Exception e) {
			log.error("Erreur lors de la désactivation: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la désactivation: " + e.getMessage());
		}
	}
	
	/**
	 * Réactiver un cours
	 */
	@Transactional
	public void reactivateCourse(String name, Authentication connectedUser) {
		try {
			log.info("Réactivation du cours: {}", name);
			
			User user = validateAndGetUser(connectedUser);
			Course course = validateAndGetCourseByName(name);
			
			// Vérification des droits (seul le STAFF peut réactiver)
			boolean isStaff = user.getRoles().stream()
				.anyMatch(role -> "STAFF".equals(role.getName()));
			
			if (!isStaff) {
				throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
					"Seuls les membres du staff peuvent réactiver un cours");
			}
			
			// Réactivation
			course.setActived(true);
			course.setArchived(false);
			course.setLastModifiedBy(user.getIdUser());
			course.setLastModifiedDate(LocalDateTime.now());
			
			courseRepository.save(course);
			log.info("Cours réactivé avec succès: {}", name);
		} catch (Exception e) {
			log.error("Erreur lors de la réactivation: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la réactivation: " + e.getMessage());
		}
	}
	
	/**
	 * Récupérer un cours par ID
	 */
	public CourseResponse getCourseById(Long courseId) {
		try {
			log.info("Récupération du cours ID: {}", courseId);
			
			Course course = courseRepository.findById(courseId)
				.orElseThrow(() -> new EntityNotFoundException("Cours non trouvé avec l'ID: " + courseId));
				
			return CourseResponse.builder()
				.name(course.getName())
				.code(course.getCode())
				.description(course.getDescription())
				.build();
		} catch (EntityNotFoundException e) {
			log.warn("Cours non trouvé: {}", e.getMessage());
			throw e;
		} catch (Exception e) {
			log.error("Erreur lors de la récupération du cours: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la récupération du cours");
		}
	}
	
	/**
	 * Rechercher des cours par nom
	 */
	public List<CourseResponse> searchCoursesByName(String name) {
		try {
			log.info("Recherche de cours par nom: {}", name);
			
			if (name == null || name.trim().isEmpty()) {
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le nom est requis");
			}
			
			// Implémentation de la recherche par nom
			List<Course> courses = courseRepository.findByNameContainingIgnoreCase(name.trim());
			
			return courses.stream()
				.map(course -> CourseResponse.builder()
					.name(course.getName())
					.code(course.getCode())
					.description(course.getDescription())
					.build())
				.toList();
		} catch (ResponseStatusException e) {
			throw e;
		} catch (Exception e) {
			log.error("Erreur lors de la recherche par nom: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la recherche par nom");
		}
	}

	/**
	 * Créer un cours et l'assigner à un secteur d'activité
	 */
	@Transactional
	public String createCourseAndAssignToActivitySector(CreateCourseAndAssignRequest request, Authentication connectedUser) {
		try {
			log.info("Création du cours '{}' et assignation au secteur: {}", request.getName(), request.getActivitySectorName());
			
			User user = validateAndGetUser(connectedUser);
			
			ActivitySector sector = activitySectorRepository.findByName(request.getActivitySectorName())
				.orElseThrow(() -> new EntityNotFoundException("Secteur d'activité non trouvé"));

			Course course = Course.builder()
				.name(request.getName())
				.code(request.getCode())
				.description(request.getDescription())
				.priceForCqp(request.getPriceForCqp())
				.activitySector(sector)
				.createdBy(user.getIdUser())
				.createdDate(LocalDateTime.now())
				.build();

			courseRepository.save(course);
			log.info("Cours créé et assigné avec succès: {}", course.getName());
			return "Cours '" + course.getName() + "' créé et assigné au secteur d'activité '" + sector.getName() + "'.";
			
		} catch (Exception e) {
			log.error("Erreur lors de la création et assignation du cours: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la création et assignation: " + e.getMessage());
		}
	}
	
	/**
	 * Ajouter des cours à une session
	 */
	@Transactional
	public String addCoursesToSession(Long sessionId, List<Long> courseIds) {
		try {
			log.info("Ajout de {} cours à la session ID: {}", courseIds.size(), sessionId);
			
			Session session = sessionRepository.findById(sessionId)
				.orElseThrow(() -> new EntityNotFoundException("Session non trouvée"));

			StringBuilder result = new StringBuilder();

			for (Long courseId : courseIds) {
				Course course = courseRepository.findById(courseId)
					.orElseThrow(() -> new EntityNotFoundException("Cours ID " + courseId + " non trouvé"));

				course.setSession(session);
				courseRepository.save(course);
				result.append("Cours '").append(course.getName()).append("' lié à la session.\n");
			}

			log.info("Cours ajoutés à la session avec succès");
			return result.toString();
		} catch (Exception e) {
			log.error("Erreur lors de l'ajout des cours à la session: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de l'ajout des cours: " + e.getMessage());
		}
	}
	
	/**
	 * Ajouter des filières (Courses) à un Training Center
	 */
	@Transactional
	public String addCoursesToTrainingCenter(String agreementNumber, List<Long> courseIds) {
		try {
			log.info("Ajout de {} cours au centre de formation: {}", courseIds.size(), agreementNumber);
			
			TrainingCenter trainingCenter = trainingCenterRepository.findByAgreementNumber(agreementNumber)
				.orElseThrow(() -> new EntityNotFoundException("Centre de formation non trouvé avec l'agrément: " + agreementNumber));

			if (trainingCenter.getCourseList() == null) {
				trainingCenter.setCourseList(new ArrayList<>());
			}

			StringBuilder result = new StringBuilder();

			for (Long courseId : courseIds) {
				Course course = courseRepository.findById(courseId)
					.orElseThrow(() -> new EntityNotFoundException("Cours non trouvé avec l'ID: " + courseId));

				if (trainingCenter.getCourseList().contains(course)) {
					result.append("Cours '").append(course.getName()).append("' déjà lié.\n");
					continue;
				}

				trainingCenter.getCourseList().add(course);

				// Optionnel : ajouter aussi le training center dans course
				if (course.getTrainingCenterList() == null) {
					course.setTrainingCenterList(new ArrayList<>());
				}
				course.getTrainingCenterList().add(trainingCenter);

				result.append("Cours '").append(course.getName()).append("' lié avec succès.\n");
			}

			trainingCenterRepository.save(trainingCenter);
			log.info("Cours ajoutés au centre de formation avec succès");
			return result.toString().trim();
		} catch (Exception e) {
			log.error("Erreur lors de l'ajout des cours au centre: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de l'ajout des cours: " + e.getMessage());
		}
	}

	/**
	 * Supprimer des filières (Courses) d'un Training Center
	 */
	@Transactional
	public String removeCoursesFromTrainingCenter(String agreementNumber, List<Long> courseIds) {
		try {
			log.info("Suppression de {} cours du centre de formation: {}", courseIds.size(), agreementNumber);
			
			TrainingCenter trainingCenter = trainingCenterRepository.findByAgreementNumber(agreementNumber)
				.orElseThrow(() -> new EntityNotFoundException("Centre de formation non trouvé avec l'agrément: " + agreementNumber));

			if (trainingCenter.getCourseList() == null || trainingCenter.getCourseList().isEmpty()) {
				return "Aucun cours associé à ce centre de formation.";
			}

			StringBuilder result = new StringBuilder();

			for (Long courseId : courseIds) {
				Course course = courseRepository.findById(courseId)
					.orElseThrow(() -> new EntityNotFoundException("Cours non trouvé avec l'ID: " + courseId));

				if (!trainingCenter.getCourseList().contains(course)) {
					result.append("Cours '").append(course.getName()).append("' non lié à ce centre.\n");
					continue;
				}

				trainingCenter.getCourseList().remove(course);
				if (course.getTrainingCenterList() != null) {
					course.getTrainingCenterList().remove(trainingCenter);
				}

				result.append("Cours '").append(course.getName()).append("' supprimé avec succès.\n");
			}

			trainingCenterRepository.save(trainingCenter);
			log.info("Cours supprimés du centre de formation avec succès");
			return result.toString().trim();
		} catch (Exception e) {
			log.error("Erreur lors de la suppression des cours du centre: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la suppression des cours: " + e.getMessage());
		}
	}

	// ==================== MÉTHODES PRIVÉES D'AIDE ====================
	
	private User validateAndGetUser(Authentication connectedUser) {
		if (connectedUser == null || connectedUser.getPrincipal() == null) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur non authentifié");
		}
		return (User) connectedUser.getPrincipal();
	}
	
	private Course validateAndGetCourse(Long courseId) {
		return courseRepository.findById(courseId)
			.orElseThrow(() -> new EntityNotFoundException("Cours non trouvé avec l'ID: " + courseId));
	}
	
	private Course validateAndGetCourseByName(String name) {
		return courseRepository.findByName(name)
			.orElseThrow(() -> new EntityNotFoundException("Cours non trouvé avec le nom: " + name));
	}
	
	private void validateCourseData(CreateCourseRequest request) {
		if (request.getName() == null || request.getName().trim().isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le nom du cours est requis");
		}
		if (request.getCode() == null || request.getCode().trim().isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le code du cours est requis");
		}
		if (request.getPriceForCqp() == null || request.getPriceForCqp() <= 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le prix doit être positif");
		}
	}
	
	private void validateCourseUpdateData(CourseRequest request) {
		if (request.getName() == null || request.getName().trim().isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le nom du cours est requis");
		}
		if (request.getCode() == null || request.getCode().trim().isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le code du cours est requis");
		}
		if (request.getPriceForCqp() == null || request.getPriceForCqp() <= 0) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le prix doit être positif");
		}
	}
}

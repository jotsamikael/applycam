package com.jotsamikael.applycam.staff;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

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
import com.jotsamikael.applycam.user.User;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class StaffService {

	private final StaffRepository staffRepository;
	private final StaffMapper staffMapper;

	/**
	 * Créer un nouveau membre du staff avec validation complète
	 */
	@Transactional
	public String createStaff(StaffRequest staffRequest, Authentication connectedUser) {
		try {
			log.info("Début de création du membre du staff: {}", staffRequest.getFirstname());
			
			User user = validateAndGetUser(connectedUser);
			
			// Validation des données
			validateStaffData(staffRequest);
			
			// Vérification de l'unicité
			if (staffRepository.existsByEmail(staffRequest.getEmail())) {
				throw new DataIntegrityViolationException(
					"Un membre du staff avec cet email existe déjà");
			}

			var staff = Staff.builder()
				.firstname(staffRequest.getFirstname())
				.lastname(staffRequest.getLastname())
				.email(staffRequest.getEmail())
				.phoneNumber(staffRequest.getPhoneNumber())
				.nationalIdNumber(staffRequest.getNationalIdNumber())
				.positionName(staffRequest.getPositionName())
				.dateOfBirth(LocalDate.parse(staffRequest.getDateOfBirth()))
				.createdBy(user.getIdUser())
				.createdDate(LocalDateTime.now())
				.actived(true)
				.enabled(true)
				.accountLocked(false)
				.archived(false)
				.build();

			staffRepository.save(staff);
			log.info("Membre du staff créé avec succès: {}", staff.getEmail());
			return staff.getEmail();
			
		} catch (DataIntegrityViolationException e) {
			log.error("Erreur de contrainte lors de la création du staff: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.CONFLICT, 
				"Erreur de contrainte: " + e.getMessage());
		} catch (Exception e) {
			log.error("Erreur lors de la création du staff: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la création du staff: " + e.getMessage());
		}
	}

	/**
	 * Mettre à jour un membre du staff avec validation
	 */
	@Transactional
	public Long updateStaff(StaffRequest staffRequest, Authentication connectedUser) {
		try {
			log.info("Début de mise à jour du membre du staff ID: {}", staffRequest.getId());
			
			User user = validateAndGetUser(connectedUser);
			Staff staff = validateAndGetStaff(staffRequest.getId());
			
			// Vérification que le staff peut être mis à jour
			if (!staff.isActived()) {
				throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
					"Ce membre du staff ne peut pas être mis à jour car il a été supprimé");
			}

			// Validation des données
			validateStaffUpdateData(staffRequest);

			staff.setFirstname(staffRequest.getFirstname());
			staff.setLastname(staffRequest.getLastname());
			staff.setEmail(staffRequest.getEmail());
			staff.setPhoneNumber(staffRequest.getPhoneNumber());
			staff.setNationalIdNumber(staffRequest.getNationalIdNumber());
			staff.setPositionName(staffRequest.getPositionName());
			staff.setDateOfBirth(LocalDate.parse(staffRequest.getDateOfBirth()));
			staff.setLastModifiedBy(user.getIdUser());
			staff.setLastModifiedDate(LocalDateTime.now());

			staffRepository.save(staff);
			log.info("Membre du staff mis à jour avec succès: {}", staff.getEmail());
			return staff.getIdUser();
			
		} catch (Exception e) {
			log.error("Erreur lors de la mise à jour du staff: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la mise à jour: " + e.getMessage());
		}
	}

	/**
	 * Récupérer tous les membres du staff avec pagination
	 */
	public PageResponse<StaffResponse> getAllStaff(int offset, int pageSize, String field, boolean order) {
		try {
			log.info("Récupération des membres du staff - offset: {}, pageSize: {}", offset, pageSize);
			
			Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();
			Page<Staff> staffMembers = staffRepository.findAll(PageRequest.of(offset, pageSize, sort));

			List<StaffResponse> responses = staffMembers.getContent().stream()
				.map(staff -> {
					if (!staff.isActived()) {
						return StaffResponse.builder()
							.firstname("Ce membre du staff a été supprimé.")
							.build();
					} else {
						return staffMapper.toStaffResponse(staff);
					}
				})
				.toList();

			return new PageResponse<>(
				responses,
				staffMembers.getNumber(),
				staffMembers.getSize(),
				staffMembers.getTotalElements(),
				staffMembers.getTotalPages(),
				staffMembers.isFirst(),
				staffMembers.isLast()
			);
		} catch (Exception e) {
			log.error("Erreur lors de la récupération des membres du staff: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la récupération des membres du staff");
		}
	}

	/**
	 * Rechercher des membres du staff par nom
	 */
	public List<StaffResponse> searchStaffByName(String name) {
		try {
			log.info("Recherche des membres du staff par nom: {}", name);
			
			if (name == null || name.trim().isEmpty()) {
				throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le nom de recherche est requis");
			}

			List<Staff> staffMembers = staffRepository.findByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCase(
				name.trim(), name.trim());

			List<StaffResponse> responses = staffMembers.stream()
				.filter(staff -> staff.isActived())
				.map(staffMapper::toStaffResponse)
				.toList();

			return responses;
		} catch (ResponseStatusException e) {
			throw e;
		} catch (Exception e) {
			log.error("Erreur lors de la recherche par nom: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la recherche par nom");
		}
	}

	/**
	 * Désactiver/réactiver un membre du staff
	 */
	@Transactional
	public void deleteStaff(Long staffId, Authentication connectedUser) {
		try {
			log.info("Changement de statut du membre du staff ID: {}", staffId);
			
			User user = validateAndGetUser(connectedUser);
			Staff staff = validateAndGetStaff(staffId);
			
			if (staff.isActived()) {
				// Désactivation
				staff.setActived(false);
				staff.setArchived(true);
				log.info("Membre du staff désactivé: {}", staffId);
			} else {
				// Réactivation
				staff.setActived(true);
				staff.setArchived(false);
				log.info("Membre du staff réactivé: {}", staffId);
			}
			
			// Audit
			staff.setLastModifiedBy(user.getIdUser());
			staff.setLastModifiedDate(LocalDateTime.now());

			staffRepository.save(staff);
		} catch (Exception e) {
			log.error("Erreur lors du changement de statut du staff: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors du changement de statut: " + e.getMessage());
		}
	}

	/**
	 * Supprimer définitivement un membre du staff
	 */
	@Transactional
	public void deleteStaffPermanently(Long staffId, Authentication connectedUser) {
		try {
			log.info("Suppression définitive du membre du staff ID: {}", staffId);
			
			User user = validateAndGetUser(connectedUser);
			Staff staff = validateAndGetStaff(staffId);
			
			// Vérification des droits (seul le STAFF peut supprimer définitivement)
			boolean isStaff = user.getRoles().stream()
				.anyMatch(role -> "STAFF".equals(role.getName()));
			
			if (!isStaff) {
				throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
					"Seuls les membres du staff peuvent supprimer définitivement un membre du staff");
			}
			
			// Suppression définitive
			staffRepository.delete(staff);
			log.info("Membre du staff supprimé définitivement: {}", staffId);
		} catch (Exception e) {
			log.error("Erreur lors de la suppression définitive: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la suppression: " + e.getMessage());
		}
	}

	/**
	 * Désactiver un membre du staff (soft delete)
	 */
	@Transactional
	public void deactivateStaff(Long staffId, Authentication connectedUser) {
		try {
			log.info("Désactivation du membre du staff ID: {}", staffId);
			
			User user = validateAndGetUser(connectedUser);
			Staff staff = validateAndGetStaff(staffId);
			
			// Vérification des droits
			boolean isStaff = user.getRoles().stream()
				.anyMatch(role -> "STAFF".equals(role.getName()));
			
			if (!isStaff) {
				throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
					"Seuls les membres du staff peuvent désactiver un membre du staff");
			}
			
			// Désactivation
			staff.setActived(false);
			staff.setArchived(true);
			staff.setLastModifiedBy(user.getIdUser());
			staff.setLastModifiedDate(LocalDateTime.now());
			
			staffRepository.save(staff);
			log.info("Membre du staff désactivé avec succès: {}", staffId);
		} catch (Exception e) {
			log.error("Erreur lors de la désactivation: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la désactivation: " + e.getMessage());
		}
	}

	/**
	 * Réactiver un membre du staff
	 */
	@Transactional
	public void reactivateStaff(Long staffId, Authentication connectedUser) {
		try {
			log.info("Réactivation du membre du staff ID: {}", staffId);
			
			User user = validateAndGetUser(connectedUser);
			Staff staff = validateAndGetStaff(staffId);
			
			// Vérification des droits (seul le STAFF peut réactiver)
			boolean isStaff = user.getRoles().stream()
				.anyMatch(role -> "STAFF".equals(role.getName()));
			
			if (!isStaff) {
				throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
					"Seuls les membres du staff peuvent réactiver un membre du staff");
			}
			
			// Réactivation
			staff.setActived(true);
			staff.setArchived(false);
			staff.setLastModifiedBy(user.getIdUser());
			staff.setLastModifiedDate(LocalDateTime.now());
			
			staffRepository.save(staff);
			log.info("Membre du staff réactivé avec succès: {}", staffId);
		} catch (Exception e) {
			log.error("Erreur lors de la réactivation: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la réactivation: " + e.getMessage());
		}
	}

	/**
	 * Récupérer un membre du staff par ID
	 */
	public StaffResponse getStaffById(Long staffId) {
		try {
			log.info("Récupération du membre du staff ID: {}", staffId);
			
			Staff staff = staffRepository.findById(staffId)
				.orElseThrow(() -> new EntityNotFoundException("Membre du staff non trouvé avec l'ID: " + staffId));
				
			return staffMapper.toStaffResponse(staff);
		} catch (EntityNotFoundException e) {
			log.warn("Membre du staff non trouvé: {}", e.getMessage());
			throw e;
		} catch (Exception e) {
			log.error("Erreur lors de la récupération du membre du staff: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la récupération du membre du staff");
		}
	}

	/**
	 * Récupérer des statistiques sur les membres du staff
	 */
	public Map<String, Object> getStaffStatistics() {
		try {
			log.info("Récupération des statistiques du staff");
			
			long totalStaff = staffRepository.count();
			long activeStaff = staffRepository.countByActivedTrue();
			long inactiveStaff = staffRepository.countByActivedFalse();
			
			Map<String, Object> statistics = new HashMap<>();
			statistics.put("totalStaff", totalStaff);
			statistics.put("activeStaff", activeStaff);
			statistics.put("inactiveStaff", inactiveStaff);
			statistics.put("activationRate", totalStaff > 0 ? (double) activeStaff / totalStaff * 100 : 0);
			
			return statistics;
		} catch (Exception e) {
			log.error("Erreur lors de la récupération des statistiques: {}", e.getMessage(), e);
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
				"Erreur lors de la récupération des statistiques");
		}
	}

	// ==================== MÉTHODES PRIVÉES D'AIDE ====================
	
	private User validateAndGetUser(Authentication connectedUser) {
		if (connectedUser == null || connectedUser.getPrincipal() == null) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur non authentifié");
		}
		return (User) connectedUser.getPrincipal();
	}
	
	private Staff validateAndGetStaff(Long staffId) {
		return staffRepository.findById(staffId)
			.orElseThrow(() -> new EntityNotFoundException("Membre du staff non trouvé avec l'ID: " + staffId));
	}
	
	private void validateStaffData(StaffRequest request) {
		if (request.getFirstname() == null || request.getFirstname().trim().isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le prénom est requis");
		}
		if (request.getLastname() == null || request.getLastname().trim().isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le nom de famille est requis");
		}
		if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'email est requis");
		}
		if (request.getPhoneNumber() == null || request.getPhoneNumber().trim().isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le numéro de téléphone est requis");
		}
		if (request.getNationalIdNumber() == null || request.getNationalIdNumber().trim().isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le numéro d'identité nationale est requis");
		}
		if (request.getPositionName() == null || request.getPositionName().trim().isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le nom du poste est requis");
		}
		if (request.getDateOfBirth() == null || request.getDateOfBirth().trim().isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La date de naissance est requise");
		}
	}
	
	private void validateStaffUpdateData(StaffRequest request) {
		if (request.getId() == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "L'ID du membre du staff est requis");
		}
		validateStaffData(request);
	}
}

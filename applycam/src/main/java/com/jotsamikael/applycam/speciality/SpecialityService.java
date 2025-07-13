package com.jotsamikael.applycam.speciality;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.jotsamikael.applycam.common.PageResponse;
import com.jotsamikael.applycam.course.Course;
import com.jotsamikael.applycam.course.CourseRepository;
import com.jotsamikael.applycam.course.CourseRequest;
import com.jotsamikael.applycam.course.CourseResponse;
import com.jotsamikael.applycam.offersSpeciality.OffersSpeciality;
import com.jotsamikael.applycam.offersSpeciality.OffersSpecialityRepository;
import com.jotsamikael.applycam.payment.Payment;
import com.jotsamikael.applycam.payment.PaymentRepository;
import com.jotsamikael.applycam.session.Session;
import com.jotsamikael.applycam.session.SessionRepository;
import com.jotsamikael.applycam.trainingCenter.TrainingCenter;
import com.jotsamikael.applycam.trainingCenter.TrainingCenterRepository;
import com.jotsamikael.applycam.user.User;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SpecialityService {

    private final SpecialityRepository specialityRepository;
    private final TrainingCenterRepository trainingCenterRepository;
    private final CourseRepository courseRepository;
    private final OffersSpecialityRepository offersSpecialityRepository;
    private final PaymentRepository paymentRepository;
    private final SessionRepository sessionRepository;

    public String addSpecialitiesToTrainingCenter(String agreementNumber, List<Long> specialityIds) {

        TrainingCenter trainingCenter = trainingCenterRepository.findByAgreementNumber(agreementNumber)
                .orElseThrow(() -> new EntityNotFoundException("Training center not found"));

        StringBuilder result = new StringBuilder();

        for (Long specialityId : specialityIds) {
            Speciality speciality = specialityRepository.findById(specialityId)
                    .orElseThrow(() -> new EntityNotFoundException("Speciality not found with ID: " + specialityId));

           

            boolean alreadyLinked = trainingCenter.getOffersSpecialityList().stream()
                    .anyMatch(os -> os.getSpeciality().equals(speciality));

            if (alreadyLinked) {
                result.append("Speciality ").append(speciality.getName()).append(" is already linked.\n");
                continue;
            }

            OffersSpeciality offer = new OffersSpeciality();
            offer.setTrainingCenter(trainingCenter);
            offer.setSpeciality(speciality);
            offersSpecialityRepository.save(offer);

            result.append("Speciality ").append(speciality.getName()).append(" linked successfully.\n");
        }

        return result.toString().trim();
    }

    public PageResponse<SpecialityResponse> getallSpecialityOfTrainingCenter(Long trainingCenterId,int offset, int pageSize, String field, boolean order) {
        Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();

        Page<Speciality> list = specialityRepository.findAllByTrainingCenterIdAndIsActivedTrue(trainingCenterId, PageRequest.of(offset, pageSize, sort));

        List<SpecialityResponse> specialityResponses = list.getContent().stream().map(speciality->SpecialityResponse.builder()
        .id(speciality.getId())
        .name(speciality.getName())
        .description(speciality.getDescription())
        .examType(speciality.getExamType())
        .build()).toList();

       
        return new PageResponse<>(
            specialityResponses,
            list.getNumber(),
            list.getSize(),
            list.getTotalElements(),
            list.getTotalPages(),
            list.isFirst(),
            list.isLast()
        );
    }

    public String createSpeciality(CreateSpecialityRequest createSpecialityRequest, Authentication connectedUser) {
    	
    	User user = ((User) connectedUser.getPrincipal());
    	
        var speciality = Speciality.builder()
        .name(createSpecialityRequest.getName())
        .description(createSpecialityRequest.getDescription())
        .examType(createSpecialityRequest.getExamType())
        .createdBy(user.getIdUser())
	    .createdDate(LocalDateTime.now())
	    .isActived(false)
        .isArchived(true)
        .build();
        specialityRepository.save(speciality);
        return speciality.getName();
    }

    public PageResponse<SpecialityResponse> getAllSpeciality( int offset, int pageSize, String field, boolean order) {
        Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();
        Page<Speciality> specialities = specialityRepository.findAll(PageRequest.of(offset, pageSize, sort));
        
       
        List<SpecialityResponse> specialityResponses = specialities.getContent().stream()
                .map(speciality -> {
                    Double amount = 25000.0; // valeur par défaut
                    if (speciality.getPayment() != null ) {
                        amount = speciality.getPayment().getAmount();
                    }
                    return SpecialityResponse.builder()
                        .id(speciality.getId())
                        .name(speciality.getName())
                        .description(speciality.getDescription())
                        .examType(speciality.getExamType())
                        .paymentAmount(amount)
                        .build();
                })
                .toList();

        return new PageResponse<>(
            specialityResponses,
            specialities.getNumber(),
            specialities.getSize(),
            specialities.getTotalElements(),
            specialities.getTotalPages(),
            specialities.isFirst(),
            specialities.isLast()
        );
    }
    
    public String addSpecialityToCourse(AddSpecialityRequest addSpecialityRequest) {
        // Récupération du cours existant
        Course course = courseRepository.findByName(addSpecialityRequest.getCourseName())
                .orElseThrow(() -> new EntityNotFoundException("Course not listed"));

        // Récupération de la spécialité existante
        Speciality speciality = specialityRepository.findByName(addSpecialityRequest.getSpecialityName())
                .orElseThrow(() -> new EntityNotFoundException("Speciality doesn't exist"));
        
        if (!speciality.isActived() ) {
           	throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This Speciality cannot be added it has been disabled.");
           }

        // Vérifier si la liste des spécialités est null, sinon ajouter
        if (course.getSpecialityList() == null) {
            course.setSpecialityList(new ArrayList<>());
        }

        // Éviter les doublons
        if (course.getSpecialityList().contains(speciality)) {
        	throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This Speciality cannot be added it was already added.");
            
        }
        
        course.getSpecialityList().add(speciality);

        // Sauvegarder le cours mis à jour
        courseRepository.save(course);
        speciality.setCourse(course);
        specialityRepository.save(speciality);

        return "Speciality added to course successfully.";
    }
    
    public PageResponse<SpecialityResponse> getAllSpecialityOfCourse(Long courseId,int offset, int pageSize, String field, boolean order){
    	Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();
    	
    	Page<Speciality> list = specialityRepository.findAllByCourseId(courseId, PageRequest.of(offset, pageSize, sort));
    	
    	 List<SpecialityResponse> specialityResponses = list.getContent().stream().map(speciality->SpecialityResponse.builder()
    		        .id(speciality.getId())
    		        .name(speciality.getName())
    		        .description(speciality.getDescription())
    		        .examType(speciality.getExamType())
    		        .build()).toList();

    		       
    		        return new PageResponse<>(
    		            specialityResponses,
    		            list.getNumber(),
    		            list.getSize(),
    		            list.getTotalElements(),
    		            list.getTotalPages(),
    		            list.isFirst(),
    		            list.isLast()
    		        );
    }
    
    public void toggleSpeciality(String name, Authentication connectedUser) {
    	
    	User user =(User) connectedUser.getPrincipal();
        Speciality speciality = specialityRepository.findByName(name).orElseThrow(() -> new EntityNotFoundException("Course not found"));
        
        if(speciality.isActived()){
        	speciality.setActived(false);
        	speciality.setArchived(true);
            
        }else{
        	speciality.setActived(true);
        	speciality.setArchived(false);
        }
        speciality.setLastModifiedBy(user.getIdUser());
        speciality.setLastModifiedDate(LocalDateTime.now());
        specialityRepository.save(speciality);
    }
    public String updateSpeciality(UpdateSpecialityRequest updateSpecialityRequest,  Authentication connectedUser) {
    	
   	 User user = ((User) connectedUser.getPrincipal());

   	Speciality speciality = specialityRepository.findById(updateSpecialityRequest.getId()).orElseThrow(() -> new EntityNotFoundException("Course not found"));
       
       if (!speciality.isActived() ) {
       	throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This Speciality cannot be updated.");
       }

       speciality.setName(updateSpecialityRequest.getName());
       speciality.setCode(updateSpecialityRequest.getCode());
       speciality.setDescription(updateSpecialityRequest.getDescription());
       speciality.setExamType(updateSpecialityRequest.getExamType());
       speciality.setLastModifiedBy(user.getIdUser());
       speciality.setLastModifiedDate(LocalDateTime.now());
       
       speciality.setDqpPrice(updateSpecialityRequest.getAmount());
          
          
       specialityRepository.save(speciality);
       return speciality.getName();
   }
    public SpecialityResponse findByName(String name) {
        Speciality speciality = specialityRepository.findByName(name).orElseThrow(() -> new EntityNotFoundException("Speciality not found"));
        
        if (!speciality.isActived()) {
            return SpecialityResponse.builder()
            	.id(speciality.getId())
                .name(speciality.getName())
                .code(speciality.getCode())
                .description("This Course was already deleted.")
                .build();
        }
        
        return SpecialityResponse.builder()
        	.id(speciality.getId())
            .name(speciality.getName())
            .code(speciality.getCode())
            .description(speciality.getDescription())
            .examType(speciality.getExamType())
            .build();
    }
    
    public PageResponse<SpecialityResponse> findAllByExamType(String examType,int offset, int pageSize, String field, boolean order){
    	
    	Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();
    	
    	
    	Page<Speciality> list = specialityRepository.findAllByExamType(examType, PageRequest.of(offset, pageSize, sort));
    	
    	List<SpecialityResponse> specialityResponses = list.getContent().stream().map(speciality->{
            Double amount = 25000.0; // valeur par défaut
            if (speciality.getPayment() != null ) {
                amount = speciality.getPayment().getAmount();
            }
            return SpecialityResponse.builder()
                .id(speciality.getId())
                .name(speciality.getName())
                .description(speciality.getDescription())
                .examType(speciality.getExamType())
                .paymentAmount(amount)
                .build();
        })
        .toList();
    	
    	return new PageResponse<>(
	            specialityResponses,
	            list.getNumber(),
	            list.getSize(),
	            list.getTotalElements(),
	            list.getTotalPages(),
	            list.isFirst(),
	            list.isLast()
	        );
    	
    }
    
    public void activateAndAssignSpecialityToSession(ActivateSpecialityRequest request,Authentication connectedUser) {
    	
    	 User user = ((User) connectedUser.getPrincipal());
        Speciality speciality = specialityRepository.findByName(request.getSpecialityName())
            .orElseThrow(() -> new EntityNotFoundException("Speciality not found with name " ));

        Session session = sessionRepository.findByexamTypeAndExamDate(request.getExamType(),request.getExamDate())
            .orElseThrow(() -> new EntityNotFoundException("Session not found with  " ));

        // Activer la spécialité et lui assigner une session
        speciality.setDqpPrice(request.getDqpPrice());
        speciality.setActived(true);
        speciality.setSession(session);
        speciality.setLastModifiedBy(user.getIdUser());
        speciality.setLastModifiedDate(LocalDateTime.now());

        // Sauvegarder les changements
        specialityRepository.save(speciality);
    }
    
    public String createAndLinkSpecialityToTrainingCenter(CreateSpecialityRequest request, Authentication connectedUser,String agreementNumber,String courseName) {
        
       // User user = ((User) connectedUser.getPrincipal());

        // Étape 1 : Créer la spécialité
        Speciality speciality = Speciality.builder()
                .name(request.getName())
                .description(request.getDescription())
                .examType(request.getExamType())
                .isActived(false)
                .isArchived(true)
                .createdBy(1)
                .createdDate(LocalDateTime.now())
                .build();

        specialityRepository.save(speciality);

        // Étape 2 : Récupérer le TrainingCenter
        TrainingCenter trainingCenter = trainingCenterRepository.findByAgreementNumber(agreementNumber)
                .orElseThrow(() -> new EntityNotFoundException("Training center not found  " ));

        // Étape 3 : Créer le lien
        OffersSpeciality offer = new OffersSpeciality();
        offer.setTrainingCenter(trainingCenter);
        offer.setSpeciality(speciality);

        offersSpecialityRepository.save(offer);
        
        // Recherche de la filière avec gestion d'erreur améliorée
        Course course = null;
        String originalCourseName = courseName;
        
        try {
            // Essai 1: Recherche exacte
            course = courseRepository.findByName(courseName).orElse(null);
            if (course != null) {
                System.out.println("Filière trouvée avec le nom exact: " + courseName);
            }
            
            // Essai 2: Recherche flexible avec variations
            if (course == null) {
                String nameWithSpaces = courseName.replace("-", " ");
                String nameWithDashes = courseName.replace(" ", "-");
                
                course = courseRepository.findByNameFlexible(courseName, nameWithSpaces, nameWithDashes).orElse(null);
                if (course != null) {
                    System.out.println("Filière trouvée avec recherche flexible: " + course.getName());
                }
            }
            
            // Essai 3: Recherche manuelle si nécessaire
            if (course == null) {
                // Lister toutes les filières pour debug
                List<Course> allCourses = courseRepository.findAll();
                System.out.println("Toutes les filières disponibles:");
                for (Course c : allCourses) {
                    System.out.println("- ID: " + c.getId() + ", Nom: '" + c.getName() + "'");
                }
                
                // Recherche par similarité
                for (Course c : allCourses) {
                    if (c.getName().equalsIgnoreCase(courseName) || 
                        c.getName().equalsIgnoreCase(courseName.replace("-", " ")) ||
                        c.getName().equalsIgnoreCase(courseName.replace(" ", "-"))) {
                        course = c;
                        System.out.println("Filière trouvée par similarité: " + c.getName());
                        break;
                    }
                }
            }
            
            if (course == null) {
                // Lister toutes les filières pour debug
                List<Course> allCourses = courseRepository.findAll();
                StringBuilder availableCourses = new StringBuilder();
                availableCourses.append("Available courses: ");
                for (Course c : allCourses) {
                    availableCourses.append("'").append(c.getName()).append("', ");
                }
                if (!allCourses.isEmpty()) {
                    availableCourses.setLength(availableCourses.length() - 2); // Enlever la dernière virgule
                }
                
                throw new EntityNotFoundException("Course not found with name: '" + originalCourseName + 
                    "'. Tried variations: '" + courseName + "', '" + courseName.replace("-", " ") + 
                    "', '" + courseName.replace(" ", "-") + "'. " + availableCourses.toString());
            }
            
        } catch (Exception e) {
            System.err.println("Erreur lors de la recherche de filière: " + e.getMessage());
            throw new EntityNotFoundException("Course not found with name: " + originalCourseName + ". Error: " + e.getMessage());
        }

        // Récupération de la spécialité existante
        

        // Vérifier si la liste des spécialités est null, sinon ajouter
        if (course.getSpecialityList() == null) {
            course.setSpecialityList(new ArrayList<>());
        }

        // Éviter les doublons
        if (course.getSpecialityList().contains(speciality)) {
        	throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This Speciality cannot be added it was already added.");
            
        }
        
        course.getSpecialityList().add(speciality);

        // Sauvegarder le cours mis à jour
        courseRepository.save(course);
        speciality.setCourse(course);
        specialityRepository.save(speciality);

        return "Speciality '" + speciality.getName() + "' created and linked to training center successfully.";
    }
    
    
    public String addSpecialitiesToSession(Long sessionId, List<Long> specialityIds) {
    	
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new EntityNotFoundException("Session not found"));

        StringBuilder result = new StringBuilder();

        for (Long id : specialityIds) {
            Speciality speciality = specialityRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Speciality ID " + id + " not found"));

            speciality.setSession(session);
            specialityRepository.save(speciality);
            result.append("Speciality '").append(speciality.getName()).append("' assigned to session.\n");
        }

        return result.toString();
    }
    
    public String removeSpecialitiesFromTrainingCenter(String agreementNumber, List<Long> specialityIds) {

        TrainingCenter trainingCenter = trainingCenterRepository.findByAgreementNumber(agreementNumber)
                .orElseThrow(() -> new EntityNotFoundException("Training center not found"));

        StringBuilder result = new StringBuilder();

        for (Long specialityId : specialityIds) {
            Speciality speciality = specialityRepository.findById(specialityId)
                    .orElseThrow(() -> new EntityNotFoundException("Speciality not found with ID: " + specialityId));

            // Cherche l'association OffersSpeciality à supprimer
            Optional<OffersSpeciality> offerOptional = trainingCenter.getOffersSpecialityList()
                    .stream()
                    .filter(os -> os.getSpeciality().equals(speciality))
                    .findFirst();

            if (offerOptional.isPresent()) {
                offersSpecialityRepository.delete(offerOptional.get());
                result.append("Speciality ").append(speciality.getName()).append(" removed successfully.\n");
            } else {
                result.append("Speciality ").append(speciality.getName()).append(" was not linked.\n");
            }
        }

        return result.toString().trim();
    }
    
    public List<CourseWithSpecialitiesResponse> getCoursesWithSpecialitiesForTrainingCenter(String agreementNumber) {
        TrainingCenter trainingCenter = trainingCenterRepository.findByAgreementNumber(agreementNumber)
                .orElseThrow(() -> new EntityNotFoundException("Training center not found"));

        // Obtenir les spécialités offertes par ce centre
        List<Speciality> specialities = trainingCenter.getOffersSpecialityList().stream()
                .map(OffersSpeciality::getSpeciality)
                .filter(Objects::nonNull)
                .toList();

        // Grouper par filière (Course)
        Map<Course, List<Speciality>> groupedByCourse = specialities.stream()
                .filter(s -> s.getCourse() != null)
                .collect(Collectors.groupingBy(Speciality::getCourse));

        // Mapper vers la réponse attendue
        return groupedByCourse.entrySet().stream()
                .map(entry -> {
                    Course course = entry.getKey();
                    List<Speciality> specList = entry.getValue();

                    List<SpecialityResponse> specialityResponses = specList.stream()
                            .map(speciality -> new SpecialityResponse(speciality.getId(), speciality.getName(), speciality.getCode(), 
                            		speciality.getDescription(), speciality.getExamType(), speciality.getDqpPrice()))
                            .toList();

                    return new CourseWithSpecialitiesResponse(course.getId(), course.getName(), specialityResponses);
                })
                .toList();
    }

    public PageResponse<CourseWithSpecialitiesResponse> getAllCoursesWithSpecialitiesPaged(int offset, int pageSize, String field, boolean order) {
        Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();
        PageRequest pageRequest = PageRequest.of(offset, pageSize, sort);

        Page<Course> page = courseRepository.findAll(pageRequest);

        List<CourseWithSpecialitiesResponse> content = page.getContent().stream()
                .map(course -> {
                    List<SpecialityResponse> specialityResponses = course.getSpecialityList().stream()
                            .map(speciality -> new SpecialityResponse(speciality.getId(), speciality.getName(),speciality.getCode(), 
                            		speciality.getDescription(), speciality.getExamType(), speciality.getDqpPrice()))
                            .toList();

                    return new CourseWithSpecialitiesResponse(course.getId(), course.getName(), specialityResponses);
                })
                .toList();

        return new PageResponse<>(
                content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast()
        );
    }


    
    
    

    
}


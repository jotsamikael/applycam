package com.jotsamikael.applycam.promoter;

import com.jotsamikael.applycam.auth.RegistrationResponse;
import com.jotsamikael.applycam.common.FileStorageService;
import com.jotsamikael.applycam.common.PageResponse;
import com.jotsamikael.applycam.email.EmailService;
import com.jotsamikael.applycam.email.EmailTemplateName;
import com.jotsamikael.applycam.exception.OperationNotPermittedException;
import com.jotsamikael.applycam.role.Role;
import com.jotsamikael.applycam.role.RoleRepository;
import com.jotsamikael.applycam.staff.*;
import com.jotsamikael.applycam.trainingCenter.CreateTainingCenterRequest;
import com.jotsamikael.applycam.trainingCenter.TrainingCenter;
import com.jotsamikael.applycam.trainingCenter.TrainingCenterRepository;
import com.jotsamikael.applycam.user.Token;
import com.jotsamikael.applycam.user.TokenRepository;
import com.jotsamikael.applycam.user.User;
import com.jotsamikael.applycam.user.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor



public class PromoterService {
    private final PromoterRepository repository;
    private final TrainingCenterRepository trainingCenterRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final PromoterMapper mapper;
    private final TokenRepository tokenRepository;
    private final FileStorageService fileStorageService;

    @Value("${application.mailing.frontend.activation-url}")
    String activationUrl;

    public void createPromoter(
            Authentication connectedUser,
            @Valid CreatePromoterRequest promoterRequest,
            @Valid CreateTainingCenterRequest centerRequest,
            MultipartFile nationalIdCard,
            MultipartFile agreementFile,
            MultipartFile promoterPhoto,
            MultipartFile signLetter,
            MultipartFile localisationFile,
            MultipartFile internalRegulation,
            LocalDate validUntil,
            LocalDate validFrom,
            LocalDate validTo
    ) throws MessagingException {

    	// ✅ 1. Récupération du rôle "PROMOTER"
        Role userRole = roleRepository.findByName("PROMOTER")
                .orElseThrow(() -> new IllegalStateException("ROLE PROMOTER was not initialized"));

        // ✅ 2. Vérification des unicités (email, téléphone, CNI, numéro agrément)
        validateUniqueness(promoterRequest, centerRequest);

        // ✅ 3. Validation de la date de validité de la CNI
        validateCardValidityDate(validUntil);
        
        // . Validation of the agreement date
        validateAgreementDate(validTo,validFrom);

        //  4. Construction de l'objet Promoter
        Promoter promoter = buildPromoter(promoterRequest, userRole);

        //  5. Construction du Training Center
        TrainingCenter trainingCenter = buildTrainingCenter(centerRequest, promoter,validTo,validFrom);
        promoter.getTrainingCenterList().add(trainingCenter);

        //  6. Sauvegarde des entités
        repository.save(promoter);
        trainingCenter.setCreatedBy(promoter.getIdUser());
        trainingCenterRepository.save(trainingCenter);

        //  7. Sauvegarde des fichiers
        handleFileUploads(trainingCenter,promoter, nationalIdCard,"CNI");
        handleFileUploads(trainingCenter,promoter, agreementFile,"AGREEMENT");
        handleFileUploads(trainingCenter,promoter, promoterPhoto,"PHOTO");
        handleFileUploads(trainingCenter,promoter, signLetter,"SIGNATURE");
        handleFileUploads(trainingCenter,promoter, localisationFile,"LOCALISATION");
        handleFileUploads(trainingCenter,promoter, internalRegulation,"REGULATION");

        // ✅ 8. Envoi d'email
        sendValidationEmail(promoter);
    }
        // create the Promoter
       

    private void validateUniqueness(CreatePromoterRequest promoter, CreateTainingCenterRequest center) {
        if (userRepository.existsByEmail(promoter.getEmail())) {
            throw new DataIntegrityViolationException("Email already taken");
        }
        if (userRepository.existsByPhoneNumber(promoter.getPhoneNumber())) {
            throw new DataIntegrityViolationException("Phone number already taken");
        }
        if (userRepository.existsByNationalIdNumber(promoter.getNationalIdNumber())) {
            throw new DataIntegrityViolationException("National Id number already taken");
        }
        if (trainingCenterRepository.existsByAgreementNumber(center.getAgreementNumber())) {
            throw new DataIntegrityViolationException("Agreement number already taken");
        }
    }

    private void validateCardValidityDate(LocalDate validUntil) {
        LocalDate currentDate = LocalDate.now();
        if (validUntil == null || !validUntil.isAfter(currentDate)) {
            throw new IllegalArgumentException("Your id Card is not Valid");
        }
    }
    
    private void validateAgreementDate(LocalDate validTo,LocalDate validFrom) {
        LocalDate currentDate = LocalDate.now();
        if (validTo == null ||  validFrom == null || !validFrom.isAfter(currentDate)) {
            throw new IllegalArgumentException("The agreement date is not valid");
        }
    }

    private Promoter buildPromoter(CreatePromoterRequest req,Role userRole) {
    	
    	
        return Promoter.builder()
                .firstname(req.getFirstname())
                .lastname(req.getLastname())
                .email(req.getEmail())
                .SchoolLevel(req.getSchoolLevel())
                .dateOfBirth(LocalDate.parse(req.getDateOfBirth()))
                .phoneNumber(req.getPhoneNumber())
                .nationalIdNumber(req.getNationalIdNumber())
                .address(req.getAddress())
                .sex(req.getSex())
                .createdDate(LocalDateTime.now())
                .roles(List.of(userRole))
                .enabled(false)
                .accountLocked(false)
                .password(passwordEncoder.encode(req.getPassword()))
                .trainingCenterList(new ArrayList<>())
                .build();
    }

    private TrainingCenter buildTrainingCenter(CreateTainingCenterRequest req, Promoter promoter,LocalDate validTo,LocalDate validFrom) {
        return TrainingCenter.builder()
                .fullName(req.getFullName())
                .acronym(req.getAcronym())
                .agreementNumber(req.getAgreementNumber())
                .division(req.getDivision())
                .fullAddress(req.getFullAddress())
                .startDateOfAgreement(req.getStartDateOfAgreement())
                .endDateOfAgreement(req.getEndDateOfAgreement())
                .isCenterPresentCandidateForCqp(req.getIsCenterPresentCandidateForCqp())
                .isCenterPresentCandidateForDqp(req.getIsCenterPresentCandidateForDqp())
                .promoter(promoter)
                .createdDate(LocalDateTime.now())
                .endDateOfAgreement(validTo)
                .startDateOfAgreement(validFrom)
                .build();
    }

    private void handleFileUploads(TrainingCenter trainingCenter,Promoter promoter, MultipartFile file,String fileType) {
        if (file != null && !file.isEmpty()) {
            String url = fileStorageService.saveFile(file, promoter.getIdUser());
            switch (fileType) {
            case "CNI" -> promoter.setNationalIdCardUrl(url);
            case "AGREEMENT" -> trainingCenter.setAgreementFileUrl(url);
            case "PHOTO" -> promoter.setPhotoUrl(url);
            case "SIGNATURE" -> promoter.setSignatureLetterUrl(url);
            case "LOCALISATION" -> promoter.setLocalisationFileUrl(url);
            case "REGULATION" -> promoter.setInternalRegulationFileUrl(url);
            default -> throw new IllegalArgumentException("we do not handel this folder.");
        }
           // repository.save(promoter); // met à jour le promoteur
        } else {
            throw new IllegalArgumentException("missing file");
        }
    }
    

    public PageResponse<PromoterResponse> getAllPromoter(int offset, int pageSize, String field, boolean order) {
        Sort sort = order ? Sort.by(field).ascending() : Sort.by(field).descending();

        Page<Promoter> list = repository.getAllPromoters(
                PageRequest.of(offset, pageSize, sort));

        List<PromoterResponse> responses = list.stream().map(mapper::toPromoterResponse).toList();
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

    public PromoterResponse findPromoterByEmail(String email) {
        //get promoter by email of throw exception
        Promoter promoter = repository.findByEmail(email).orElseThrow(()-> new EntityNotFoundException("No Promoter Member found with email: "+email));
        return mapper.toPromoterResponse(promoter);
    }

    public String updateProfile(String email, CreatePromoterRequest request, Authentication connectedUser) {
        //start by getting the staff by email or throw an exception
        Promoter promoter = repository.findByEmail(email).orElseThrow(()-> new EntityNotFoundException("No promoter with found email"+ email));

        //modify the staff object using the request data
        promoter.setFirstname(request.getFirstname());
        promoter.setLastname(request.getLastname());
        promoter.setDateOfBirth(LocalDate.parse(request.getDateOfBirth()));
        promoter.setPhoneNumber(request.getPhoneNumber());
        promoter.setNationalIdNumber(request.getNationalIdNumber());
        promoter.setAddress(request.getAddress());
        promoter.setLastModifiedDate(LocalDateTime.now());


        //get connected user and date time for audit purpose
        User user = ((User) connectedUser.getPrincipal());
        promoter.setLastModifiedBy(user.getIdUser());

        //save the modified candidate object
        repository.save(promoter);

        //return
        return email;
    }


    private String generateActivationCode(int length) {
        String characters = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();//to transform to string
        SecureRandom secureRandom = new SecureRandom(); //cryptographically secured
        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(characters.length()); //0..9
            codeBuilder.append(characters.charAt(randomIndex));//append the caracter sercurily and ramdomly created
        }
        return codeBuilder.toString();
    }

    private String generateAndSaveActivationToken(User user) {
        //generate a token
        String generatedToken = generateActivationCode(6);//generate a 6 digit code
        var token = Token.builder()
                .token(generatedToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .user(user)
                .build();
        tokenRepository.save(token);


        return generatedToken;
    }

    private void sendValidationEmail(User user) throws MessagingException {
        var newToken = generateAndSaveActivationToken(user);
        //send email
        emailService.sendEmail( //use the service to send the email
                user.getEmail(),
                user.getFirstname(),
                EmailTemplateName.ACTIVATE_ACCOUNT,
                activationUrl,
                newToken,
                "Account activation"
        );

    }
    public String resetPassword(String email, Authentication connectedUser) throws MessagingException {

        //start by getting the promoter by email or throw an exception
        Promoter promoter = repository.findByEmail(email).orElseThrow(()-> new EntityNotFoundException("No promoter with found email"+ email));
        //generate new password
        String activationCode = generateActivationCode(8);//generate a random password

        //modify the promoter's password
        promoter.setPassword(passwordEncoder.encode(activationCode)); //set a random password

        //get connected user and date time for audit purpose
        User user = ((User) connectedUser.getPrincipal());
        promoter.setLastModifiedBy(user.getIdUser());
        promoter.setLastModifiedDate(LocalDateTime.now());

        //save the modified candidate object
        repository.save(promoter);

        //send email with new password
        sendResetPasswordEmail(email, activationCode);
        return repository.save(promoter).getEmail();
    }

    private void sendResetPasswordEmail(String email, String newPassword) throws MessagingException {
        emailService.sendEmail(
                email,
                email,
                EmailTemplateName.ACTIVATE_ACCOUNT,
                newPassword,
                null,
                "Account activation"
        );
    }
    public void togglePromoter(String email, Authentication connectedUser) {
        Promoter promoter = repository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("No promoter found with email: " + email));
        
        User user = (User) connectedUser.getPrincipal();
        if (promoter.isActived()) {
            // Désactivation
            promoter.setEnabled(false);
            promoter.setActived(false);
            promoter.setArchived(true);
        } else {
            // Réactivation
            promoter.setEnabled(true);
            promoter.setActived(true);
            promoter.setArchived(false);
        }
      //get connected user and date time for audit purpose
        promoter.setLastModifiedBy(user.getIdUser());
        promoter.setLastModifiedDate(LocalDateTime.now());
        // saving the promoter and it status
        repository.save(promoter);
        
        
    }
    
    /*public void nationalIdCardFileUpload(MultipartFile file, Authentication connectedUser,LocalDate validUntil,String nationalIdNumber) {
    	
    	// to See if the Current Date is not Empty or Null	
    	 LocalDate currentDate = LocalDate.now();
    	    if (validUntil == null || !validUntil.isAfter(currentDate)) {
    	        throw new IllegalArgumentException("La date de validité de la carte doit être postérieure à la date actuelle.");
    	    }
    	    
    	    //to Verify that the id is uniaue
    	    if (userRepository.existsByNationalIdNumber(nationalIdNumber)) {
    	        throw new IllegalArgumentException("Ce numéro de carte nationale est déjà utilisé.");
    	    }
        //get user object from connected user
        User user = ((User) connectedUser.getPrincipal());

        //check connected user is promoter
        Promoter promoter = repository.findByEmail(user.getEmail()).orElseThrow(() -> new EntityNotFoundException("Not a promoter" + user.getEmail()));

        
        var nationalIdCardUrl = fileStorageService.saveFile(file, promoter.getIdUser());
         promoter.setNationalIdCardUrl(nationalIdCardUrl);//set the nationalId card url of the promoter
         repository.save(promoter);*/
    }
    
    


		
	


package com.jotsamikael.applycam.promoter;

import com.jotsamikael.applycam.auth.RegistrationResponse;
import com.jotsamikael.applycam.common.PageResponse;
import com.jotsamikael.applycam.email.EmailService;
import com.jotsamikael.applycam.email.EmailTemplateName;
import com.jotsamikael.applycam.role.RoleRepository;
import com.jotsamikael.applycam.staff.*;
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

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PromoterService {
    private final PromoterRepository repository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final PromoterMapper mapper;
    private final TokenRepository tokenRepository;

    @Value("${application.mailing.frontend.activation-url}")
    String activationUrl;

    public void createPromoter(@Valid CreatePromoterRequest request) throws MessagingException {

        var userRole = roleRepository.findByName("PROMOTER")
                //todo - better exception handling
                .orElseThrow(() -> new IllegalStateException("ROLE PROMOTER was not initialized"));
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DataIntegrityViolationException("Email already taken");
        }
        // Check if phone number already exists
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new DataIntegrityViolationException("Phone number already taken");
        }

        // Check if nationalId number already exists
        if (userRepository.existsByNationalIdNumber(request.getNationalIdNumber())) {
            throw new DataIntegrityViolationException("National Id number already taken");
        }

        var promoter = Promoter.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .SchoolLevel(request.getSchoolLevel())
                .dateOfBirth(LocalDate.parse(request.getDateOfBirth()))
                .phoneNumber(request.getPhoneNumber())
                .nationalIdNumber(request.getNationalIdNumber())
                .address(request.getAddress())
                .createdDate(LocalDateTime.now())
                .roles(List.of(userRole))
                .enabled(false)
                .accountLocked(false)
               .password(passwordEncoder.encode(request.getPassword())) //set a random password
                .build();
         repository.save(promoter);

        //send email
        sendValidationEmail(promoter);
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
        StringBuilder codeBuilder = new StringBuilder();
        SecureRandom secureRandom = new SecureRandom(); //cryptographically secured
        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(characters.length()); //0..9
            codeBuilder.append(characters.charAt(randomIndex));
        }
        return codeBuilder.toString();
    }

    private String generateAndSaveActivationToken(User user) {
        //generate a token
        String generatedToken = generateActivationCode(6);
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
        emailService.sendEmail(
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
        String activationCode = generateActivationCode(8);

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
}

package com.jotsamikael.applycam.auth;


import com.jotsamikael.applycam.candidate.Candidate;
import com.jotsamikael.applycam.email.EmailService;
import com.jotsamikael.applycam.email.EmailTemplateName;
import com.jotsamikael.applycam.role.RoleRepository;
import com.jotsamikael.applycam.security.JwtService;
import com.jotsamikael.applycam.user.Token;
import com.jotsamikael.applycam.user.TokenRepository;
import com.jotsamikael.applycam.user.User;
import com.jotsamikael.applycam.user.UserRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Value("${application.mailing.frontend.activation-url}")
    String activationUrl;

    public void register(CandidateRegistrationRequest request) throws MessagingException {
        var userRole = roleRepository.findByName("CANDIDATE")
                //todo - better exception handling
                .orElseThrow(() -> new IllegalStateException("ROLE CANDIDATE was not initialized"));

        var candidate = Candidate.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .sex(request.getSex())
                .nationalIdNumber(request.getNationalIdNumber())
                .password(passwordEncoder.encode(request.getPassword()))
                .accountLocked(false)
                .enabled(false)
                .roles(List.of(userRole))
                .createdDate(LocalDateTime.now())
                .build();
        userRepository.save(candidate);
        sendValidationEmail(candidate);
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

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var claims = new HashMap<String, Object>();
        var user = ((User) auth.getPrincipal());
        claims.put("full name", user.fullName());
        var jwtToken = jwtService.generateToken(claims, user);
        return AuthenticationResponse.builder()
                .token(jwtToken).build();
    }


    public void activateAccount(String token) throws MessagingException {
        Token savedToken = tokenRepository.findByToken(token)
                //todo exception has to be defined
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (LocalDateTime.now().isAfter(savedToken.getExpiresAt())) {
            sendValidationEmail(savedToken.getUser());
            throw new RuntimeException("Activation token has expired, A new token has been send");
        }
        var user = userRepository.findById(savedToken.getUser().getIdUser())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setEnabled(true);
        userRepository.save(user);
        savedToken.setValidatedAt(LocalDateTime.now());
        tokenRepository.save(savedToken);
    }

}

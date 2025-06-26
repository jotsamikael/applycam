package com.jotsamikael.applycam.user;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {


    public UserResponse  getInfoUser(Authentication connectedUser) {

        User user = ((User) connectedUser.getPrincipal());

        return UserResponse.builder()
       
        .firstname(user.getFirstname())
        .lastname(user.getLastname())
        .email(user.getEmail())
        .dateOfBirth(user.getDateOfBirth())
        .sex(user.getSex())
        .phoneNumber(user.getPhoneNumber())
        .nationalIdNumber(user.getNationalIdNumber())
        .build();
        
    }


}

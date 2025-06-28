package com.jotsamikael.applycam.user;

import java.time.LocalDate;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class UserResponse {

    private Long id;
    private String firstname;
    private String lastname;
    private String email;
    private LocalDate dateOfBirth;
    private String sex;
    private String phoneNumber;
    private String nationalIdNumber;
}
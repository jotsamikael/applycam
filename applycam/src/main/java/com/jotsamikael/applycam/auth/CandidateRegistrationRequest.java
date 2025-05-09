package com.jotsamikael.applycam.auth;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;



@Getter
@Setter
@Builder
public class CandidateRegistrationRequest {

    @NotEmpty(message = "Firstname is mandatory")
    @NotNull(message = "Firstname is mandatory")
    private String firstname;

    @NotEmpty(message = "Lastname is mandatory")
    @NotNull(message = "Lastname can not be blank")
    private String lastname;

    @NotEmpty(message = "Sex is mandatory")
    @NotNull(message = "Sex can not be blank")
    private String sex;


    @NotEmpty(message = "email is mandatory")
    @NotNull(message = "email can not be blank")
    @Email(message = "email is not formatted")
    private String email;

    @NotEmpty(message = "phone number is mandatory")
    @NotNull(message = "phone number can not be blank")
    @Size(min = 9, message = "Phone number must be 9 character minimum")
    private String phoneNumber;


    @NotEmpty(message = "national Id number is mandatory")
    @NotNull(message = "national Id  number can not be blank")
    @Size(min = 9, message = "national Id  number must be 9 character minimum")
    private String nationalIdNumber;


    @Size(min = 8, message = "Password should be 8 character minimum")
    private String password;
}

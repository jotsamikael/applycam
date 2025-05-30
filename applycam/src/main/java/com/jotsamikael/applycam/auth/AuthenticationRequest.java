package com.jotsamikael.applycam.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AuthenticationRequest {
    @NotEmpty(message = "email is mandatory")
    @NotBlank(message = "email can not be blank")
    @Email(message = "email is not formatted")
    private String email;


    @NotEmpty(message = "password is mandatory")
    @NotBlank(message = "password can not be blank")
    @Size(min = 8, message = "Password should be 8 character minimum")
    private String password;
}

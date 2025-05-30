package com.jotsamikael.applycam.promoter;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
/*This is a request to get All the information to create a promoter*/
@Getter
@Setter
@Builder
public class CreatePromoterRequest {
    @NotEmpty(message = "Firstname is mandatory")
    @NotNull(message = "Firstname is mandatory")
    private String firstname;

    @NotEmpty(message = "Lastname is mandatory")
    @NotNull(message = "Lastname can not be blank")
    private String lastname;


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


    @NotEmpty(message = "School Level name is mandatory")
    @NotNull(message = "School Level name can not be blank")
    private String schoolLevel;

    @NotEmpty(message = "date of birth is mandatory")
    @NotNull(message = "date of birth can not be blank")
    private String dateOfBirth;


    @NotEmpty(message = "Address is mandatory")
    @NotNull(message = "Address can not be blank")
    private String address;
    
    @NotEmpty(message = "sex is mandatory")
    @NotNull(message = "sex can not be blank")
    private String sex;

    @Size(min = 8, message = "Password should be 8 character minimum")
    private String password;

}

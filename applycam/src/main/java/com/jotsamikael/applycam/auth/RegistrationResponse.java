package com.jotsamikael.applycam.auth;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class RegistrationResponse {
    private  String email;
}

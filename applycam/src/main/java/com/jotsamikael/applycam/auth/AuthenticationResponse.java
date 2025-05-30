package com.jotsamikael.applycam.auth;

import com.jotsamikael.applycam.role.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class AuthenticationResponse {
    private String token;
}

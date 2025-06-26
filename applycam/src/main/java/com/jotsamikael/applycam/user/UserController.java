package com.jotsamikael.applycam.user;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/info")
    public ResponseEntity<UserResponse> getAuthenticatedUserInfo(Authentication authentication) {
        UserResponse userResponse = userService.getInfoUser(authentication);
        return ResponseEntity.ok(userResponse);
    }
}

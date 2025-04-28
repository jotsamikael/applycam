package com.jotsamikael.applycam.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jotsamikael.applycam.handler.ExceptionResponse;
import io.jsonwebtoken.ExpiredJwtException;
import io.micrometer.common.lang.NonNull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/*@Service
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {

        if (request.getServletPath().contains("/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String jwt;
        final String userEmail;

        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                System.out.println("Not auth api called");

                return;
            }
            System.out.println("Authenticated api called");

            jwt = authHeader.substring(7);
            userEmail = jwtService.extractUsername(jwt);

            //check wether the userEmail is not null and the user is not authenticated
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authenticationToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            }

            filterChain.doFilter(request, response);
        }catch (ExpiredJwtException ex) {
                handleJwtException(response, ex);
            }

    }


    private void handleJwtException(HttpServletResponse response, ExpiredJwtException ex) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        ExceptionResponse exceptionResponse = ExceptionResponse.builder()
                .businessErrorCode(398)
                .businessErrorDescription("Token expired")
                .error("Error occurred")
                .build();
        response.getWriter().write(new ObjectMapper().writeValueAsString(exceptionResponse));
    }
}*/


@Service
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    List<String> PROTECTED_ENDPOINTS = new ArrayList<>();

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        // Skip authentication for auth endpoints
        if (request.getServletPath().contains("/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String jwt;
        final String userEmail;

        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                System.out.println("Not auth api called");
                return;
            }

            System.out.println("Authenticated api called");
            jwt = authHeader.substring(7);
            userEmail = jwtService.extractUsername(jwt);
            UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authenticationToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    System.out.println("Yes is valid token");
                    System.out.println("Servlet path is "+request.getServletPath());

                    // Add role validation
                    /*if (requiresRoleValidation(request.getServletPath())) {
                        validateRole(request, userDetails);

                    }*/

                }
            }

            // Continue with the filter chain
            filterChain.doFilter(request, response);
        } catch (ExpiredJwtException ex) {
            handleJwtException(response, ex);
        }
    }
    private boolean requiresRoleValidation(String path) {
        boolean requiresRole;
         if(path.contains("/promoter/")){
             requiresRole = true;
         }else {
             requiresRole = false;

         }
        return requiresRole;
    }

    private void validateRole(HttpServletRequest request, UserDetails userDetails) throws AccessDeniedException {
        String requiredRole = extractRequiredRole(request.getServletPath());
        System.out.println("required role is: "+requiredRole);
        System.out.println("user is: "+userDetails.getUsername());
        if (requiredRole != null && !userDetails.getAuthorities()
                .stream()
                .anyMatch(auth -> auth.getAuthority().contains(requiredRole))) {
            throw new AccessDeniedException("Access denied - insufficient role");
        }
        logger.info("user is allowed");

    }

    private String extractRequiredRole(String path) {
        // Implement your role extraction logic here
        // For example:
        if (path.contains("/admin/")) return "ROLE_ADMIN";
        if (path.contains("/user/")) return "ROLE_USER";
        if (path.contains("/promoter/")) return "PROMOTER,STAFF";
        return null;
    }

    private void handleJwtException(HttpServletResponse response, ExpiredJwtException ex) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        ExceptionResponse exceptionResponse = ExceptionResponse.builder()
                .businessErrorCode(398)
                .businessErrorDescription("Token expired")
                .error("Error occurred")
                .build();
        response.getWriter().write(new ObjectMapper().writeValueAsString(exceptionResponse));
    }
}

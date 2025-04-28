package com.jotsamikael.applycam.staff;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StaffResponse {
    private String firstname;
    private String lastname;
    private LocalDate dateOfBirth;
    private String email;
    private String phoneNumber;
    private String nationalIdNumber;
    private boolean accountLocked;
    private boolean enabled;
}

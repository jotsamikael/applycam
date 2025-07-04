package com.jotsamikael.applycam.promoter;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PromoterResponse {
	private Long idUser;
    private String firstname;
    private String lastname;
    private LocalDate dateOfBirth;
    private String email;
    private String phoneNumber;
    private String nationalIdNumber;
    private boolean accountLocked;
    private boolean enabled;
}

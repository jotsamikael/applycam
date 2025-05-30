package com.jotsamikael.applycam.promoter;

import org.springframework.stereotype.Service;

@Service
public class PromoterMapper {
    public PromoterResponse toPromoterResponse(Promoter promoter) {
        return PromoterResponse.builder()
                .firstname(promoter.getFirstname())
                .lastname(promoter.getLastname())
                .dateOfBirth(promoter.getDateOfBirth())
                .email(promoter.getEmail())
                .phoneNumber(promoter.getPhoneNumber())
                .nationalIdNumber(promoter.getNationalIdNumber())
                .accountLocked(promoter.isAccountLocked())
                .enabled(promoter.isEnabled())
                .build();
    }
}

package com.jotsamikael.applycam.session;

import java.time.LocalDate;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SessionResponse {
    
    private Long id;
    private String examType;
    private LocalDate examDate;
    private String sessionYear;


}


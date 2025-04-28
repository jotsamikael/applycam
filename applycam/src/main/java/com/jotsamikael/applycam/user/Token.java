package com.jotsamikael.applycam.user;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "token_entity")
public class Token {

    @Id
    @GeneratedValue
    private Long idToken;
    private String token;

    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;

    private LocalDateTime validatedAt;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user;

}

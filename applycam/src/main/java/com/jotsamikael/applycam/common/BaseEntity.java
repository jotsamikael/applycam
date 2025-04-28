package com.jotsamikael.applycam.common;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@Setter
@SuperBuilder //an annotation in Spring Boot's Lombok library that simplifies building and creating objects.
@AllArgsConstructor//  is a Lombok annotation that:Automatically generates a constructor with parameters for all fields.
@NoArgsConstructor //a Lombok annotation that: Automatically generates a no-argument constructor.
@MappedSuperclass // a JPA (Java Persistence API) annotation that:Marks a class as a parent class for entities.Allows sharing common attributes and mappings.Not an entity itself, but provides common attributes.
@EntityListeners(AuditingEntityListener.class) // listens to entity events (e.g., creation, modification) and updates the entity's auditing information accordingly.
public class BaseEntity {
    @Id
    @GeneratedValue
    private long id;

    private boolean isActived;

    private boolean isArchived;

    @CreatedDate
    @Column(nullable = false)
    private LocalDateTime createdDate;

    @LastModifiedDate
    @Column(insertable = false)
    private LocalDateTime lastModifiedDate;

    @CreatedBy
    @Column(nullable = false, updatable = false)
    private long createdBy;

    @CreatedBy
    @Column(insertable = true)
    private long lastModifiedBy;


}

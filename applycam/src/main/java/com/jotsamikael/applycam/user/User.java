package com.jotsamikael.applycam.user;

import com.jotsamikael.applycam.role.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.DiscriminatorOptions;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
@Inheritance(strategy = InheritanceType.JOINED)// Will create distinct tables in db for various children classes
@Table(name = "_user")
@DiscriminatorOptions(force = false) // ← Diable discriminator since we use joined inheritance strategy
@EntityListeners(AuditingEntityListener.class)
public class User implements UserDetails, Principal {

    @Id
    @GeneratedValue
    private Long idUser;

    private String firstname;
    private String lastname;
    private LocalDate dateOfBirth;
    private String sex;

    @Column(unique = true)
    private String email;
    

    @Column(unique = true)
    private String phoneNumber;
    

    @Column(unique = true)
    private String nationalIdNumber;

    private String password;
    private boolean accountLocked;
    private boolean enabled;
    private boolean actived;
    private boolean archived;

    @ManyToMany(fetch = FetchType.EAGER) //meaning when we get a user, we Eagerly fetch roles
    private List<Role> roles;


    @CreatedDate
    @Column(nullable = false, unique = false)
    private LocalDateTime createdDate;

    @LastModifiedDate
    @Column(insertable = false)
    private LocalDateTime lastModifiedDate;

    @CreatedBy
    @Column(nullable = false, updatable = false)
    private long createdBy;

    @CreatedBy
    @Column(nullable = false, updatable = false)
    private long lastModifiedBy;


    @Override
    public String getName() {
        return email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.roles
                .stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !accountLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    public String fullName(){
        return firstname +" "+ lastname;
    }
}

package com.jotsamikael.applycam.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
   Optional<User> findByEmail(String email);

   boolean existsByEmail(String email);
   boolean existsByNationalIdNumber(String nationalIdNumber);
   boolean existsByPhoneNumber(String phoneNumber);

}

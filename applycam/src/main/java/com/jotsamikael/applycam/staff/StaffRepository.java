package com.jotsamikael.applycam.staff;

import com.jotsamikael.applycam.candidate.Candidate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff,Long> {
    @Query(
            """ 
              SELECT v
              FROM Staff v
            """
    )
    Page<Staff> getAllStaff(Pageable pageable);

    Optional<Staff> findByEmail(String email);
}

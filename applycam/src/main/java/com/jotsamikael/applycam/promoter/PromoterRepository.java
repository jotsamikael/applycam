package com.jotsamikael.applycam.promoter;

import com.jotsamikael.applycam.staff.Staff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PromoterRepository extends JpaRepository<Promoter, Long> {
    @Query(
            """ 
              SELECT v
              FROM Promoter v
            """
    )
    Page<Promoter> getAllPromoters(Pageable pageable);

    Optional<Promoter> findByEmail(String email);
    
    


}

package com.jotsamikael.applycam.trainingCenter;

import com.jotsamikael.applycam.promoter.Promoter;
import com.jotsamikael.applycam.staff.Staff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrainingCenterRepository extends JpaRepository<TrainingCenter, Long> {


    @Query(
            """ 
              SELECT v
              FROM TrainingCenter v
            """
    )
    Page<TrainingCenter> getAll(Pageable pageable);

    Optional<TrainingCenter> findByAgreementNumber(String agreementNumber);

    Optional<List<TrainingCenter>> findByPromoter(Promoter promoter);
    
        
    boolean existsByAgreementNumber(String agreementNumber);
}

package com.jotsamikael.applycam.campus;

import com.jotsamikael.applycam.trainingCenter.TrainingCenter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CampusRepository extends JpaRepository<Campus, Long> {

    Optional<List<Campus>> findByTrainingCenter(TrainingCenter trainingCenter);

    @Query(
            """ 
              SELECT v
              FROM Campus v
            """
    )
    Page<Campus> getAll(Pageable pageable);
}

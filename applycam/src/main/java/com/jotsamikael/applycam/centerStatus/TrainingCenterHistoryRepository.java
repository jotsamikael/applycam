package com.jotsamikael.applycam.centerStatus;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jotsamikael.applycam.candidate.Candidate;
import com.jotsamikael.applycam.trainingCenter.TrainingCenter;

public interface TrainingCenterHistoryRepository extends JpaRepository<TrainingCenterStatusHistory, Long>{
	
	 Optional<TrainingCenterStatusHistory> findByTrainingCenter(TrainingCenter trainingCenter);

}

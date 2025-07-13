package com.jotsamikael.applycam.session;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.jotsamikael.applycam.trainingCenter.TrainingCenter;

public interface SessionRepository  extends JpaRepository<Session, Long>{
	
	 	Optional<List<Session>> findByExamDate(LocalDate examDate);
	 	
	 	
	 	@Query(
	            """ 
	              SELECT se
	              FROM Session se
	              WHERE se.isActived = true
	              ORDER BY se.sessionYear DESC, se.examType ASC
	            """
	    )
	    Page<Session> findAllSession(Pageable pageable);

	@Query(
	            """ 
	              SELECT se
	              FROM Session se
	              ORDER BY se.sessionYear DESC, se.examType ASC
	            """
	    )
	    Page<Session> findAllSessionsIncludingInactive(Pageable pageable);

	    Page<Session> findAllBySessionYear(String sessionYear,Pageable pageable);
	    
	    Optional<Session> findBySessionYearAndExamType(String sessionYear, String examType);


		Optional<Session> findByexamTypeAndExamDate(String examType, LocalDate examDate);
		
		long countBySessionYearAndExamType(String sessionYear, String examType);


}

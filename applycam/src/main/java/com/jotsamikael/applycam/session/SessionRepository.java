package com.jotsamikael.applycam.session;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SessionRepository  extends JpaRepository<Session, Long>{
	
	 	Optional<List<Session>> findByExamDate(LocalDate examDate);
	 	
	 	
	 	@Query(
	            """ 
	              SELECT se
	              FROM Session se
	            """
	    )
	    Page<Session> findAllSession(Pageable pageable);

	    Page<Session> findAllBySessionYear(String sessionYear,Pageable pageable);

}

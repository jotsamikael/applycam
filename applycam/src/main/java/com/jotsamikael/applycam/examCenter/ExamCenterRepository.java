package com.jotsamikael.applycam.examCenter;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.jotsamikael.applycam.session.Session;

public interface ExamCenterRepository extends JpaRepository<ExamCenter, Long> {
	
	@Query("""
		    SELECT c.examCenter.id, COUNT(c)
		    FROM Candidate c
		    WHERE c.examCenter IS NOT NULL
		    GROUP BY c.examCenter.id
		""")
		List<Object[]> countCandidatesPerExamCenter();
		
		 List<ExamCenter> findByRegionAndDivisionAndIsActivedTrue(String region, String division);

		 @Query(
		            """ 
		              SELECT ec
		              FROM ExamCenter ec
		            """
		    )
		  Page<ExamCenter> findAllExamCenter(Pageable pageable);
		 
		 Page<ExamCenter> findAllByDivision(String division,Pageable pageable);
}

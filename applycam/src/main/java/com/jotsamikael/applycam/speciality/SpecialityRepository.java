package com.jotsamikael.applycam.speciality;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SpecialityRepository extends JpaRepository<Speciality, Long> {
	
	Optional<Speciality> findByName(String name);
	
	@Query("""
		    SELECT s FROM Speciality s
		    JOIN s.offersSpecialityList os
		    WHERE os.trainingCenter.id = :trainingCenterId
		""")
		Page<Speciality> findAllByTrainingCenterId(@Param("trainingCenterId") Long trainingCenterId, Pageable pageable);
	
	
	Page<Speciality> findAllByCourseId( Long courseId,Pageable pageable);

}

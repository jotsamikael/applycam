package com.jotsamikael.applycam.activitySector;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.jotsamikael.applycam.campus.Campus;
import com.jotsamikael.applycam.course.Course;

public interface SectorRepository extends JpaRepository<ActivitySector, Long>  {
	
	Optional<ActivitySector> findByName(String name);
	
	boolean existsByName(String name);
	
	@Query(
            """ 
              SELECT s
              FROM ActivitySector s
            """
    )
    Page<ActivitySector> getAll(Pageable pageable);

	

}

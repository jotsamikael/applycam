package com.jotsamikael.applycam.course;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CourseRepository extends JpaRepository<Course, Long>{
	
	 
   // @Query("SELECT c FROM Course c JOIN c.specialityList s WHERE s.id = :specialityId")
   // Page<Course> findBySpecialityId( Long specialityId, Pageable pageable);
	Page<Course> findAll(Pageable pageable);

	Optional<Course> findByName(String name);
	
	boolean existsByName(String name);
}

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
	
	// Méthode pour rechercher une filière de manière flexible
	@Query("SELECT c FROM Course c WHERE LOWER(c.name) = LOWER(:name) OR LOWER(c.name) = LOWER(:nameWithSpaces) OR LOWER(c.name) = LOWER(:nameWithDashes)")
	Optional<Course> findByNameFlexible(@Param("name") String name, 
	                                   @Param("nameWithSpaces") String nameWithSpaces, 
	                                   @Param("nameWithDashes") String nameWithDashes);
	
	/**
	 * Rechercher des cours par nom contenant le texte (insensible à la casse)
	 */
	List<Course> findByNameContainingIgnoreCase(String name);
}

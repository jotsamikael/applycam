package com.jotsamikael.applycam.subject;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;



public interface SubjectRepository extends JpaRepository<Subject, Long> {
	
	Optional<Subject> findByName(String name);
	
	 @Query("SELECT s FROM Subject s JOIN s.specialityList sp WHERE sp.id = :specialityId")
	Page<Subject> findAllBySpecialityId(@Param("specialityId") Long trainingCenterId, Pageable Pageable);
	 
	 boolean existsByName(String name);

}

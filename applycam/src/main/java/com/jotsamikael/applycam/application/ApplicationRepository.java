package com.jotsamikael.applycam.application;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.jotsamikael.applycam.candidate.Candidate;
import com.jotsamikael.applycam.common.ContentStatus;
import com.jotsamikael.applycam.promoter.Promoter;
import com.jotsamikael.applycam.trainingCenter.TrainingCenter;



public interface ApplicationRepository  extends JpaRepository<Application, Long> {

	 @Query(
	            """ 
	              SELECT a
	              FROM Application a
	              LEFT JOIN FETCH a.candidate
	              LEFT JOIN FETCH a.speciality
	              LEFT JOIN FETCH a.session
	              LEFT JOIN FETCH a.payment
	              WHERE a.isActived = true
	              ORDER BY a.createdDate DESC
	            """
	    )
	    Page<Application> getAllApplications(Pageable pageable);
	 
	 // Méthode temporaire pour debug - récupère toutes les applications sans filtre isActived
	 @Query(
	            """ 
	              SELECT a
	              FROM Application a
	              LEFT JOIN FETCH a.candidate
	              LEFT JOIN FETCH a.speciality
	              LEFT JOIN FETCH a.session
	              LEFT JOIN FETCH a.payment
	              ORDER BY a.createdDate DESC
	            """
	    )
	    Page<Application> getAllApplicationsDebug(Pageable pageable);
	 
	 // Méthode pour récupérer toutes les applications (actives et inactives)
	 @Query(
	            """ 
	              SELECT a
	              FROM Application a
	              LEFT JOIN FETCH a.candidate
	              LEFT JOIN FETCH a.speciality
	              LEFT JOIN FETCH a.session
	              LEFT JOIN FETCH a.payment
	              ORDER BY a.createdDate DESC
	            """
	    )
	    Page<Application> getAllApplicationsIncludingInactive(Pageable pageable);
	 
	 // Méthode pour récupérer toutes les applications d'un candidat (actives et inactives)
	 @Query("SELECT a FROM Application a " +
	           "LEFT JOIN FETCH a.candidate " +
	           "LEFT JOIN FETCH a.speciality " +
	           "LEFT JOIN FETCH a.session " +
	           "LEFT JOIN FETCH a.payment " +
	           "WHERE a.candidate = :candidate " +
	           "ORDER BY a.createdDate DESC")
	    Page<Application> findByCandidateIncludingInactive(@Param("candidate") Candidate candidate, Pageable pageable);
	 
	 @Query(
	            """ 
	              SELECT a
	              FROM Application a
	              LEFT JOIN FETCH a.candidate
	              LEFT JOIN FETCH a.speciality
	              LEFT JOIN FETCH a.session
	              LEFT JOIN FETCH a.payment
	              WHERE a.isActived = true
	              AND (:status IS NULL OR a.status = :status)
	              AND (:examType IS NULL OR a.session.examType = :examType)
	              AND (:region IS NULL OR a.applicationRegion = :region)
	              AND (:year IS NULL OR a.applicationYear = :year)
	              ORDER BY a.createdDate DESC
	            """
	    )
	    Page<Application> getAllApplicationsWithFilters(
	        @Param("status") ContentStatus status,
	        @Param("examType") String examType,
	        @Param("region") String region,
	        @Param("year") String year,
	        Pageable pageable
	    );
	 
	 @Query("SELECT a FROM Application a " +
	           "LEFT JOIN FETCH a.candidate " +
	           "LEFT JOIN FETCH a.speciality " +
	           "LEFT JOIN FETCH a.session " +
	           "LEFT JOIN FETCH a.payment " +
	           "WHERE a.isActived = true " +
	           "AND LOWER(CONCAT(a.candidate.firstname, ' ', a.candidate.lastname)) LIKE LOWER(CONCAT('%', :name, '%'))")
	    List<Application> findByCandidateNameContainingIgnoreCase(@Param("name") String name);
	 
	 Optional<List<Application>> findByCandidate(Candidate candidate);
	 
	 @Query("SELECT COUNT(a) FROM Application a WHERE a.status = :status AND a.isActived = true")
	 Long countByStatus(@Param("status") ContentStatus status);
	 
	 @Query("SELECT a.applicationRegion, COUNT(a) FROM Application a " +
	        "WHERE a.isActived = true " +
	        "GROUP BY a.applicationRegion " +
	        "ORDER BY COUNT(a) DESC")
	 List<Object[]> getApplicationsByRegion();
}


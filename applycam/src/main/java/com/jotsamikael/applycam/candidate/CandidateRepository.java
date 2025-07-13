package com.jotsamikael.applycam.candidate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {

    @Query(
                    """ 
                      SELECT v
                      FROM Candidate v
                    """
    )
    Page<Candidate> getAllCandidate(Pageable pageable);

    Optional<Candidate> findByEmail(String email);
    
    @Query("""
    	    SELECT c FROM Candidate c
    	    JOIN c.hasSchooledList hs
    	    WHERE hs.trainingCenter.promoter.id = :promoterId
    	    AND FUNCTION('YEAR', hs.startYear) <= :year
    		AND FUNCTION('YEAR', hs.endYear) >= :year
    	""")
    	Page<Candidate> findAllBypromoterId(@Param("promoterId") Long promoterId, @Param("year") int year, Pageable pageable);
    
    @Query("""
    	    SELECT c FROM Candidate c
    	    JOIN c.hasSchooledList hs
    	    WHERE hs.trainingCenter.promoter.id = :promoterId
    	    AND c.firstname = :name
    	    """)
    	Optional<Candidate> findCandidateByName(
    	    @Param("promoterId") Long promoterId, 
    	    @Param("name") String name);
    
    /**
     * Rechercher des candidats par nom ou prénom
     */
    @Query("SELECT c FROM Candidate c WHERE " +
           "LOWER(c.firstname) LIKE LOWER(CONCAT('%', :name, '%')) OR " +
           "LOWER(c.lastname) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Candidate> findByFirstnameContainingIgnoreCaseOrLastnameContainingIgnoreCase(
        @Param("name") String name, @Param("name") String name2);
}

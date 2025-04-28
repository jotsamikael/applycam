package com.jotsamikael.applycam.candidate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

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
}

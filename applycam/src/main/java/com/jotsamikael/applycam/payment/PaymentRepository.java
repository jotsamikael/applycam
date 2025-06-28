package com.jotsamikael.applycam.payment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.jotsamikael.applycam.promoter.Promoter;

public interface PaymentRepository extends JpaRepository<Payment, Long>{
	
	@Query(
            """ 
              SELECT p
              FROM Payment p
            """
    )
	 Page<Payment> findAllPayments(Pageable pageable);

}

package com.jotsamikael.applycam.payment;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jotsamikael.applycam.common.PageResponse;
import com.jotsamikael.applycam.promoter.PromoterService;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("payment")
@Tag(name = "payment")
public class PaymentController {
	
	private final PaymentService paymentService;
	
	@PostMapping("/create-payment")
    public ResponseEntity<String> createPayment(
            @RequestBody @Valid CreatePaymenRequest request,
            Authentication connectedUser) {
        
        String response = paymentService.toPay(connectedUser, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/update-payment/{id}")
    public ResponseEntity<String> updatePayment(
            @PathVariable Long id,
            @RequestBody @Valid CreatePaymenRequest request,
            Authentication connectedUser) {
        
        String response = paymentService.updatePayment(id, request, connectedUser);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("get-all")
    public ResponseEntity<PageResponse<PaymentResponse>> getAllPayments(
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "id") String field,
            @RequestParam(defaultValue = "true") boolean order) {
        
        PageResponse<PaymentResponse> response = paymentService.getAllPyment(offset, pageSize, field, order);
        return ResponseEntity.ok(response);
    }

}

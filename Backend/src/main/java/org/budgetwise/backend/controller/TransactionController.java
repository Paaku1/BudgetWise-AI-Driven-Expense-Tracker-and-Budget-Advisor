package org.budgetwise.backend.controller;

import org.budgetwise.backend.dto.TransactionDTO;
import org.budgetwise.backend.model.Transaction;
import org.budgetwise.backend.service.TransactionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // ✅ Add a new transaction
    @PostMapping("/{userId}")
    public ResponseEntity<TransactionDTO> addTransaction(
            @PathVariable int userId,
            @RequestBody Transaction transaction
    ) {
        return ResponseEntity.ok(transactionService.addTransaction(userId, transaction));
    }

    // ✅ Edit transaction
    @PutMapping("/{id}")
    public ResponseEntity<TransactionDTO> editTransaction(
            @PathVariable int id,
            @RequestBody Transaction updatedTransaction
    ) {
        return ResponseEntity.ok(transactionService.editTransaction(id, updatedTransaction));
    }

    // ✅ Delete transaction
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable int id) {
        transactionService.deleteTransaction(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // ✅ Use 204 No Content
    }

    // ✅ Get transactions by user
    @GetMapping("/{userId}")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByUser(@PathVariable int userId) {
        return ResponseEntity.ok(transactionService.getTransactionsByUser(userId));
    }

    @GetMapping("/{userId}/category")
    public ResponseEntity<List<String>> getCategories(@PathVariable int userId){
        return ResponseEntity.ok(transactionService.getCategories(userId));
    }

}

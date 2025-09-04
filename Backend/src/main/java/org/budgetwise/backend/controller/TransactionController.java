package org.budgetwise.backend.controller;

import org.budgetwise.backend.dto.TransactionDTO;
import org.budgetwise.backend.model.Transaction;
import org.budgetwise.backend.service.TransactionService;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<String> deleteTransaction(@PathVariable int id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.ok("Transaction deleted successfully");
    }

    // ✅ Get transactions by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TransactionDTO>> getTransactionsByUser(@PathVariable int userId) {
        return ResponseEntity.ok(transactionService.getTransactionsByUser(userId));
    }
}

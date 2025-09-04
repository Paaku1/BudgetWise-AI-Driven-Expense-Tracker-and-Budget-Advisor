package org.budgetwise.backend.service;

import org.budgetwise.backend.dto.TransactionDTO;
import org.budgetwise.backend.model.Transaction;
import org.budgetwise.backend.model.User;
import org.budgetwise.backend.repository.TransactionRepository;
import org.budgetwise.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionService(TransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    public TransactionDTO addTransaction(int userId, Transaction transaction) {
        User user = userRepository.findById(userId).orElseThrow();
        transaction.setUser(user);
        return TransactionDTO.fromEntity(transactionRepository.save(transaction));
    }

    public TransactionDTO editTransaction(int id, Transaction updatedTransaction) {
        Transaction existing = transactionRepository.findById(id).orElseThrow();

        existing.setType(updatedTransaction.getType());
        existing.setAmount(updatedTransaction.getAmount());
        existing.setCategory(updatedTransaction.getCategory());
        existing.setDescription(updatedTransaction.getDescription());
        existing.setDate(updatedTransaction.getDate());
        existing.setUpdatedAt(updatedTransaction.getUpdatedAt());

        return TransactionDTO.fromEntity(transactionRepository.save(existing));
    }

    public void deleteTransaction(int id) {
        transactionRepository.deleteById(id);
    }

    public List<TransactionDTO> getTransactionsByUser(int userId) {
        return transactionRepository.findByUserId(userId)
                .stream()
                .map(TransactionDTO::fromEntity)
                .toList();
    }
}

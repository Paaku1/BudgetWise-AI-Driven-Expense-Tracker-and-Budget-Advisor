package org.budgetwise.backend.service;

import org.budgetwise.backend.dto.TransactionDTO;
import org.budgetwise.backend.model.*;
import org.budgetwise.backend.repository.BudgetRepository; // Import BudgetRepository
import org.budgetwise.backend.repository.SavingGoalRepository;
import org.budgetwise.backend.repository.TransactionRepository;
import org.budgetwise.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Import Transactional

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final BudgetRepository budgetRepository; // Inject BudgetRepository
    private final SavingGoalRepository savingGoalRepository;

    public TransactionService(TransactionRepository transactionRepository, UserRepository userRepository, BudgetRepository budgetRepository, SavingGoalRepository savingGoalRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.budgetRepository = budgetRepository; // Add to constructor
        this.savingGoalRepository = savingGoalRepository;
    }

    @Transactional
    public TransactionDTO addTransaction(int userId, Transaction transaction) {
        User user = userRepository.findById(userId).orElseThrow();
        transaction.setUser(user);
        Transaction savedTransaction = transactionRepository.save(transaction);

        // ✅ Update budget or savings goal based on transaction type
        if (savedTransaction.getType() == TransactionType.EXPENSE) {
            updateBudgetForCategory(userId, savedTransaction.getCategory());
        } else if (savedTransaction.getType() == TransactionType.INCOME) {
            updateSavingGoalForCategory(userId, savedTransaction.getCategory());
        }

        return TransactionDTO.fromEntity(savedTransaction);
    }

    @Transactional
    public TransactionDTO editTransaction(int id, Transaction updatedTransaction) {
        Transaction existing = transactionRepository.findById(id).orElseThrow();
        String oldCategory = existing.getCategory();

        existing.setType(updatedTransaction.getType());
        existing.setAmount(updatedTransaction.getAmount());
        existing.setCategory(updatedTransaction.getCategory());
        existing.setDescription(updatedTransaction.getDescription());
        existing.setDate(updatedTransaction.getDate());

        Transaction savedTransaction = transactionRepository.save(existing);

        // Update budget for the new category
        updateBudgetForCategory(savedTransaction.getUser().getId(), savedTransaction.getCategory());

        // If the category was changed, update the old budget as well
        if (!oldCategory.equals(savedTransaction.getCategory())) {
            updateBudgetForCategory(savedTransaction.getUser().getId(), oldCategory);
        }

        return TransactionDTO.fromEntity(savedTransaction);
    }

    @Transactional
    public void deleteTransaction(int id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        int userId = transaction.getUser().getId();
        String category = transaction.getCategory();
        TransactionType type = transaction.getType();

        transactionRepository.deleteById(id);

        // ✅ Update budget or savings goal after deletion
        if (type == TransactionType.EXPENSE) {
            updateBudgetForCategory(userId, category);
        } else if (type == TransactionType.INCOME) {
            updateSavingGoalForCategory(userId, category);
        }
    }

    private void updateBudgetForCategory(int userId, String category) {
        Optional<Budget> budgetOpt = budgetRepository.findByUserIdAndCategory(userId, category);
        if (budgetOpt.isPresent()) {
            Budget budget = budgetOpt.get();
            BigDecimal totalSpent = transactionRepository.calculateTotalSpentForCategory(userId, category);
            budget.setSpentAmount(totalSpent.doubleValue());
            budgetRepository.save(budget);
        }
    }

    public List<TransactionDTO> getTransactionsByUser(int userId) {
        return transactionRepository.findByUserId(userId)
                .stream()
                .map(TransactionDTO::fromEntity)
                .toList();
    }

    public List<String> getCategories(int userId) {
        return transactionRepository.findDistinctCategoriesByUserId(userId);
    }

    // ✅ Add a new private method to update savings goals
    private void updateSavingGoalForCategory(int userId, String category) {
        Optional<SavingGoal> savingGoalOpt = savingGoalRepository.findByUserIdAndCategory(userId, category);
        if (savingGoalOpt.isPresent()) {
            SavingGoal savingGoal = savingGoalOpt.get();
            BigDecimal totalSaved = transactionRepository.calculateTotalSavedForCategory(userId, category);
            savingGoal.setSavedAmount(totalSaved.doubleValue());
            savingGoalRepository.save(savingGoal);
        }
    }
}
package org.budgetwise.backend.service;

import org.budgetwise.backend.dto.TransactionDTO;
import org.budgetwise.backend.model.*;
import org.budgetwise.backend.repository.BudgetRepository; // Import BudgetRepository
import org.budgetwise.backend.repository.SavingGoalRepository;
import org.budgetwise.backend.repository.TransactionRepository;
import org.budgetwise.backend.repository.UserRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Import Transactional

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final BudgetRepository budgetRepository;
    private final SavingGoalRepository savingGoalRepository;

    public TransactionService(TransactionRepository transactionRepository, UserRepository userRepository, BudgetRepository budgetRepository, SavingGoalRepository savingGoalRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.budgetRepository = budgetRepository;
        this.savingGoalRepository = savingGoalRepository;
    }

    @Transactional
    public TransactionDTO addTransaction(int userId, Transaction transaction) {
        User user = userRepository.findById(userId).orElseThrow();
        transaction.setUser(user);
        Transaction savedTransaction = transactionRepository.save(transaction);

        if (savedTransaction.getType() == TransactionType.EXPENSE) {
            updateBudgetForCategory(userId, savedTransaction.getCategory());
        } else if (savedTransaction.getType() == TransactionType.SAVINGS) {
            updateSavingGoalForCategory(userId, savedTransaction.getCategory());
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

        if (type == TransactionType.EXPENSE) {
            updateBudgetForCategory(userId, category);
        } else if (type == TransactionType.SAVINGS) {
            updateSavingGoalForCategory(userId, category);
        }
    }

    @Transactional
    public void importTransactions(int userId, List<Transaction> transactions) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));


        for (Transaction t : transactions) {
            t.setUser(user);
        }
        transactionRepository.saveAll(transactions);


        Set<String> expenseCategories = transactions.stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .map(Transaction::getCategory)
                .collect(Collectors.toSet());

        Set<String> incomeCategories = transactions.stream()
                .filter(t -> t.getType() == TransactionType.INCOME)
                .map(Transaction::getCategory)
                .collect(Collectors.toSet());

        expenseCategories.forEach(category -> updateBudgetForCategory(userId, category));
        incomeCategories.forEach(category -> updateSavingGoalForCategory(userId, category));
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


        updateBudgetForCategory(savedTransaction.getUser().getId(), savedTransaction.getCategory());

        if (!oldCategory.equals(savedTransaction.getCategory())) {
            updateBudgetForCategory(savedTransaction.getUser().getId(), oldCategory);
        }

        return TransactionDTO.fromEntity(savedTransaction);
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

    private void updateSavingGoalForCategory(int userId, String category) {
        Optional<SavingGoal> savingGoalOpt = savingGoalRepository.findByUserIdAndCategory(userId, category);
        if (savingGoalOpt.isPresent()) {
            SavingGoal savingGoal = savingGoalOpt.get();
            BigDecimal totalSaved = transactionRepository.calculateTotalSavedForCategory(userId, category);
            savingGoal.setSavedAmount(totalSaved.doubleValue());
            savingGoalRepository.save(savingGoal);
        }
    }

    public List<TransactionDTO> getFilteredTransactions(int userId, TransactionType type, String category, LocalDate startDate, LocalDate endDate) {
        Specification<Transaction> spec = (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("user").get("id"), userId);

        if (type != null) {
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("type"), type));
        }
        if (category != null && !category.isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.like(criteriaBuilder.lower(root.get("category")), "%" + category.toLowerCase() + "%"));
        }
        if (startDate != null) {
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.greaterThanOrEqualTo(root.get("date"), startDate));
        }
        if (endDate != null) {
            spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.lessThanOrEqualTo(root.get("date"), endDate));
        }

        return transactionRepository.findAll(spec).stream()
                .map(TransactionDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
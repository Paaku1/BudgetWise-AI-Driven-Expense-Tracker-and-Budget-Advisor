package org.budgetwise.backend.repository;

import org.budgetwise.backend.model.Transaction;
import org.budgetwise.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    // custom queries can be added here
    List<Transaction> findByUser(User user);

    List<Transaction> findByUserId(int userId);

    @Query("SELECT DISTINCT t.category FROM Transaction t WHERE t.user.id = :userId")
    List<String> findDistinctCategoriesByUserId(@Param("userId") int userId);

    // ✅ Add this method to sum expenses for a category
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user.id = :userId AND t.category = :category AND t.type = 'EXPENSE'")
    BigDecimal calculateTotalSpentForCategory(@Param("userId") int userId, @Param("category") String category);

    // ✅ Add this new method
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user.id = :userId AND t.category = :category AND t.type = 'INCOME'")
    BigDecimal calculateTotalSavedForCategory(@Param("userId") int userId, @Param("category") String category);

}


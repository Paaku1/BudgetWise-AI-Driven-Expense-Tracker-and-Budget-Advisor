package org.budgetwise.backend.repository;

import org.budgetwise.backend.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BudgetRepository extends JpaRepository<Budget, Integer> {
    List<Budget> findByUserId(int userId);
}

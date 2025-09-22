package org.budgetwise.backend.repository;

import org.budgetwise.backend.model.SavingGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavingGoalRepository extends JpaRepository<SavingGoal, Integer> {
    List<SavingGoal> findByUserId(int userId);
}
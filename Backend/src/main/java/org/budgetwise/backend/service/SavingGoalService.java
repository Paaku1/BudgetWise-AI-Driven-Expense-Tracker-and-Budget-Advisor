package org.budgetwise.backend.service;

import org.budgetwise.backend.dto.SavingGoalDTO;
import org.budgetwise.backend.model.SavingGoal;
import org.budgetwise.backend.model.User;
import org.budgetwise.backend.repository.SavingGoalRepository;
import org.budgetwise.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SavingGoalService {

    private final SavingGoalRepository savingGoalRepository;
    private final UserRepository userRepository;

    public SavingGoalService(SavingGoalRepository savingGoalRepository, UserRepository userRepository) {
        this.savingGoalRepository = savingGoalRepository;
        this.userRepository = userRepository;
    }

    public SavingGoalDTO createSavingGoal(int userId, SavingGoal savingGoal) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        savingGoal.setUser(user);
        SavingGoal savedGoal = savingGoalRepository.save(savingGoal);
        return SavingGoalDTO.fromEntity(savedGoal);
    }

    public List<SavingGoalDTO> getSavingGoalsByUser(int userId) {
        return savingGoalRepository.findByUserId(userId)
                .stream()
                .map(SavingGoalDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public SavingGoalDTO updateSavingGoal(int goalId, SavingGoal updatedSavingGoal) {
        SavingGoal existing = savingGoalRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("Saving goal not found"));

        existing.setCategory(updatedSavingGoal.getCategory());
        existing.setTargetAmount(updatedSavingGoal.getTargetAmount());
        existing.setSavedAmount(updatedSavingGoal.getSavedAmount());
        existing.setDeadline(updatedSavingGoal.getDeadline());

        SavingGoal savedGoal = savingGoalRepository.save(existing);
        return SavingGoalDTO.fromEntity(savedGoal);
    }

    public void deleteSavingGoal(int goalId) {
        savingGoalRepository.deleteById(goalId);
    }
}
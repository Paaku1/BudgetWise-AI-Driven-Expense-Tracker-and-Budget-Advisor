package org.budgetwise.backend.service;

import org.budgetwise.backend.dto.ProfileDTO;
import org.budgetwise.backend.dto.TransactionDTO;
import org.budgetwise.backend.model.Profile;
import org.budgetwise.backend.model.Transaction;
import org.budgetwise.backend.model.User;
import org.budgetwise.backend.repository.ProfileRepository;
import org.budgetwise.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ProfileService {
    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final AuthService authService;
    private final AnalysisService analysisService;

    public ProfileService(ProfileRepository profileRepository, UserRepository userRepository, AuthService authService, AnalysisService analysisService) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.authService = authService;
        this.analysisService = analysisService;
    }

    public Profile createProfile(int userId, Profile request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (profileRepository.findByUserId(userId).isPresent()) {
            throw new RuntimeException("Profile already exists for this user");
        }

        request.setUser(user);
        return profileRepository.save(request);
    }

    public ProfileDTO getProfileByUserId(int userId) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found for user"));

        ProfileDTO dto = ProfileDTO.fromEntity(profile);

        // ✅ Get the monthly spend and add it to the DTO
        double totalSpend = analysisService.getExpenseSummary(userId).getTotalSpendThisMonth();
        dto.setTotalSpendThisMonth(totalSpend);

        return dto;
    }

    @Transactional
    public ProfileDTO updateProfile(int userId, ProfileDTO profileDTO) {
        Profile existingProfile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found for user with ID: " + userId));

        // Update the fields from the DTO
        existingProfile.setIncome(profileDTO.getIncome());
        existingProfile.setSavings(profileDTO.getSavings());
        existingProfile.setTargetExpenses(profileDTO.getTargetExpenses());

        // Save the updated profile and return it as a DTO
        Profile savedProfile = profileRepository.save(existingProfile);
        return ProfileDTO.fromEntity(savedProfile);
    }


}

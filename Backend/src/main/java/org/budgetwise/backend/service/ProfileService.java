package org.budgetwise.backend.service;

import org.budgetwise.backend.dto.ProfileDTO;
import org.budgetwise.backend.model.Profile;
import org.budgetwise.backend.model.User;
import org.budgetwise.backend.repository.ProfileRepository;
import org.budgetwise.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ProfileService {
    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final AuthService authService;

    public ProfileService(ProfileRepository profileRepository, UserRepository userRepository, AuthService authService) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.authService = authService;
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

    public Profile getProfile(int userId) {
        return profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    public ProfileDTO getProfileByUserId(int userId) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        // ✅ Convert the Profile entity to a ProfileDTO
        return new ProfileDTO(
                profile.getUserId(),
                profile.getIncome(),
                profile.getSavings(),
                profile.getTargetExpenses(),
                profile.getUser().getUsername() // ✅ Get the username from the User entity
        );
    }

}

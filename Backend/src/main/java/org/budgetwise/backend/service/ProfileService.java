package org.budgetwise.backend.service;

import org.budgetwise.backend.model.Profile;
import org.budgetwise.backend.model.User;
import org.budgetwise.backend.repository.ProfileRepository;
import org.budgetwise.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {
    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    public ProfileService(ProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
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

}

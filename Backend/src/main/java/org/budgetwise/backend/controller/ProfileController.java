package org.budgetwise.backend.controller;

import org.budgetwise.backend.model.Profile;
import org.budgetwise.backend.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<Profile> createProfile(
            @PathVariable int userId,
            @RequestBody Profile profileRequest) {
        return ResponseEntity.ok(profileService.createProfile(userId, profileRequest));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Profile> getProfile(@PathVariable int userId) {
        return ResponseEntity.ok(profileService.getProfile(userId));
    }
}


package org.budgetwise.backend.controller;


import org.budgetwise.backend.model.AuthenticationResponse;
import org.budgetwise.backend.model.User;
import org.budgetwise.backend.repository.UserRepository;
import org.budgetwise.backend.service.AuthService;
import org.budgetwise.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserService userService, UserRepository userRepository) {
        this.authService = authService;
        this.userService = userService;
        this.userRepository = userRepository;
    }
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody User request){
        return ResponseEntity.ok(authService.register(request));
    }


    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody User request){
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @GetMapping("/home")
    public ResponseEntity<Optional<User>> home(){
        return ResponseEntity.ok(userRepository.findUserByUsername("paaku"));
    }

}

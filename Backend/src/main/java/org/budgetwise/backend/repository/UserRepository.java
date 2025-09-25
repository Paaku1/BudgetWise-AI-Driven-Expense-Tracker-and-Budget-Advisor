package org.budgetwise.backend.repository;

import ch.qos.logback.core.net.SMTPAppenderBase;
import org.budgetwise.backend.model.User;
import org.budgetwise.backend.service.AuthService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findUserByUsername(String username);

    boolean existsByUsername(String username);

    User findUsersById(int userId);

    Optional<User> findByUsername(String username);
}

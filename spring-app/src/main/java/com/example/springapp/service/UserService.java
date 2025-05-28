package com.example.springapp.service;

import com.example.springapp.entity.User;
import com.example.springapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getLoggedUser() {
        JwtAuthenticationToken token = (JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();

        String email = String.valueOf(token.getTokenAttributes().get("email"));
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Error while fetching user"));
    }

    public User getUserByPublicLink(String publicLink) {
        return userRepository.findByPublicLink(publicLink)
                .orElseThrow(() -> new EntityNotFoundException("User not found with public link: " + publicLink));
    }

    public void syncUser(User user) {
        if (user == null) {
            throw new EntityNotFoundException("Error while user sync");
        }

        Optional<User> optionalUser = userRepository.findByEmail(user.getEmail());
        User saveUser = optionalUser.orElse(user);

        // Обновляем только базовую информацию
        saveUser.setFirstname(user.getFirstname());
        saveUser.setLastname(user.getLastname());
        saveUser.setGender(user.getGender());

        // Сохраняем существующие данные, если они есть
        if (user.getAvatarUrl() != null && !user.getAvatarUrl().isBlank()) {
            saveUser.setAvatarUrl(user.getAvatarUrl());
        }
        if (user.getPublicLink() != null && !user.getPublicLink().isBlank()) {
            saveUser.setPublicLink(user.getPublicLink());
        }
        if (user.getBalance() != null) {
            saveUser.setBalance(user.getBalance());
        }

        // Добавляем publicLink если его ещё нет
        if (saveUser.getPublicLink() == null || saveUser.getPublicLink().isBlank()) {
            saveUser.setPublicLink(generateUniquePublicLink());
        }

        // Инициализируем баланс если он null
        if (saveUser.getBalance() == null) {
            saveUser.setBalance(0.0);
        }

        userRepository.save(saveUser);
    }

    private String generateUniquePublicLink() {
        String link;
        do {
            link = UUID.randomUUID().toString().substring(0, 8);
        } while (userRepository.existsByPublicLink(link));
        return link;
    }

    public void updatePublicLink(String email, String newLink) {
        if (newLink == null || newLink.isBlank()) {
            throw new IllegalArgumentException("Public link cannot be empty");
        }

        if (userRepository.existsByPublicLink(newLink)) {
            throw new IllegalArgumentException("Public link already in use");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        user.setPublicLink(newLink);
        userRepository.save(user);
    }

    public void addBalance(String email, Double amount) {
        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException("Amount must be greater than 0");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        user.setBalance(user.getBalance() + amount);
        userRepository.save(user);
    }

    public List<User> searchUsers(String query) {
        if (query == null || query.trim().isEmpty()) {
            return Collections.emptyList();
        }
        return userRepository.findByPublicLinkContainingIgnoreCase(query.trim());
    }

}

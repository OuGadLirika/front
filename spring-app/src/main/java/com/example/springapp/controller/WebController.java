package com.example.springapp.controller;

import com.example.springapp.dto.PublicLinkUpdateRequest;
import com.example.springapp.entity.User;
import com.example.springapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class WebController {

    private static final Logger logger = LoggerFactory.getLogger(WebController.class);

    private final UserService userService;

    @GetMapping(path = "/userInfo1")
    public String getUserInfo1() {
        User user = userService.getLoggedUser();
        String avatarUrl = user.getAvatarUrl();
        if (avatarUrl == null || avatarUrl.isBlank()) {
            avatarUrl = "/api/avatars/default.png";
        }
        logger.info("User avatar URL: {}", avatarUrl);
        return "UserInfo1: " + user.getFirstname() + " " + user.getLastname() + ", " + user.getEmail() + ", " + user.getPublicLink() + ", " + user.getBalance() + ", " + avatarUrl;
    }

    @GetMapping("/userInfo2")
    public String getUserInfo2(JwtAuthenticationToken auth) {
        String firstname = auth.getTokenAttributes().get("given_name").toString();
        String lastname = auth.getTokenAttributes().get("family_name").toString();
        String email = auth.getTokenAttributes().get("email").toString();
        String authorities = auth.getAuthorities().toString();

        return "UserInfo2: " + firstname + " " + lastname + ", " + email + ", " + authorities ;
    }

    @GetMapping("/profile/link")
    public ResponseEntity<String> getPublicLink() {
        User user = userService.getLoggedUser();
        return ResponseEntity.ok(user.getPublicLink());
    }

    @PutMapping("/profile/link")
    public ResponseEntity<?> updatePublicLink(@RequestBody PublicLinkUpdateRequest request,
                                              JwtAuthenticationToken auth) {
        String email = String.valueOf(auth.getTokenAttributes().get("email"));

        try {
            userService.updatePublicLink(email, request.getNewLink());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/profile/balance")
    public ResponseEntity<?> addBalance(@RequestBody Double amount, JwtAuthenticationToken auth) {
        String email = String.valueOf(auth.getTokenAttributes().get("email"));
        try {
            userService.addBalance(email, amount);
            User user = userService.getLoggedUser();
            return ResponseEntity.ok("UserInfo1: " + user.getFirstname() + " " + user.getLastname() + ", " + user.getEmail() + ", " + user.getPublicLink() + ", " + user.getBalance());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/users/search")
    public ResponseEntity<?> searchUsers(@RequestParam String query) {
        try {
            List<User> users = userService.searchUsers(query);
            List<Map<String, String>> response = users.stream()
                .map(user -> {
                    Map<String, String> userMap = new HashMap<>();
                    userMap.put("publicLink", user.getPublicLink());
                    userMap.put("name", user.getFirstname() + " " + user.getLastname());
                    return userMap;
                })
                .collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/profile/avatar")
    public ResponseEntity<?> updateAvatar(@RequestBody Map<String, String> request,
                                        JwtAuthenticationToken auth) {
        String email = String.valueOf(auth.getTokenAttributes().get("email"));
        String avatarUrl = request.get("avatarUrl");

        if (avatarUrl == null || avatarUrl.isBlank()) {
            return ResponseEntity.badRequest().body("Avatar URL cannot be empty");
        }

        try {
            User user = userService.getLoggedUser();
            logger.info("Updating avatar for user {} to {}", email, avatarUrl);
            user.setAvatarUrl(avatarUrl);
            userService.syncUser(user);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error updating avatar: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/avatars/{filename}")
    public ResponseEntity<Resource> getAvatar(@PathVariable String filename) {
        try {
            Resource resource = new ClassPathResource("static/avatars/" + filename);
            if (resource.exists()) {
                return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}

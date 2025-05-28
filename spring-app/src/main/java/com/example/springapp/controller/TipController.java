package com.example.springapp.controller;

import com.example.springapp.dto.TipRequest;
import com.example.springapp.dto.TipResponse;
import com.example.springapp.dto.UserResponse;
import com.example.springapp.entity.Tip;
import com.example.springapp.entity.User;
import com.example.springapp.service.TipService;
import com.example.springapp.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/tips")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class TipController {

    private static final Logger log = LoggerFactory.getLogger(TipController.class);
    private final TipService tipService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> createTip(@RequestBody TipRequest request) {
        try {
            log.info("Received tip request: {}", request);
            
            User sender = userService.getLoggedUser();
            log.info("Found sender: {}", sender.getEmail());
            
            User receiver = userService.getUserByPublicLink(request.receiverLink());
            log.info("Found receiver: {}", receiver.getEmail());
            
            Tip tip = Tip.builder()
                    .sender(sender)
                    .receiver(receiver)
                    .amount(request.amount())
                    .message(request.message())
                    .build();
            
            Tip savedTip = tipService.saveTip(tip);
            log.info("Successfully saved tip: {}", savedTip);
            
            return ResponseEntity.ok(mapToResponse(savedTip));
        } catch (EntityNotFoundException e) {
            log.error("User not found: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalStateException e) {
            log.error("Balance error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Error creating tip: ", e);
            return ResponseEntity.internalServerError().body("Error creating tip: " + e.getMessage());
        }
    }

    @GetMapping("/received")
    public ResponseEntity<?> getReceivedTips() {
        try {
            User user = userService.getLoggedUser();
            List<Tip> tips = tipService.getReceivedTips(user);
            return ResponseEntity.ok(tips.stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList()));
        } catch (Exception e) {
            log.error("Error getting received tips: ", e);
            return ResponseEntity.internalServerError().body("Error getting received tips: " + e.getMessage());
        }
    }

    @GetMapping("/sent")
    public ResponseEntity<?> getSentTips() {
        try {
            User user = userService.getLoggedUser();
            List<Tip> tips = tipService.getSentTips(user);
            return ResponseEntity.ok(tips.stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList()));
        } catch (Exception e) {
            log.error("Error getting sent tips: ", e);
            return ResponseEntity.internalServerError().body("Error getting sent tips: " + e.getMessage());
        }
    }

    private TipResponse mapToResponse(Tip tip) {
        return new TipResponse(
            tip.getId(),
            mapToUserResponse(tip.getSender()),
            mapToUserResponse(tip.getReceiver()),
            tip.getAmount(),
            tip.getMessage(),
            tip.getCreatedAt(),
            tip.getTimestamp()
        );
    }

    private UserResponse mapToUserResponse(User user) {
        return new UserResponse(
            user.getEmail(),
            user.getFirstname(),
            user.getLastname(),
            user.getPublicLink(),
            user.getBalance(),
            user.getAvatarUrl()
        );
    }
} 
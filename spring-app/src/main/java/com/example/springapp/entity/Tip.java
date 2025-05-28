package com.example.springapp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Tip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        timestamp = LocalDateTime.now();
        if (sender != null) {
            userEmail = sender.getEmail();
        }
    }
    // Геттеры
    public Long getId() { return id; }
    public User getSender() { return sender; }
    public User getReceiver() { return receiver; }
    public BigDecimal getAmount() { return amount; }
    public String getMessage() { return message; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public String getUserEmail() { return userEmail; }

    // Сеттеры
    public void setId(Long id) { this.id = id; }
    public void setSender(User sender) { this.sender = sender; }
    public void setReceiver(User receiver) { this.receiver = receiver; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public void setMessage(String message) { this.message = message; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
}

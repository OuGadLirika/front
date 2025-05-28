package com.example.springapp.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TipResponse(
    Long id,
    UserResponse sender,
    UserResponse receiver,
    BigDecimal amount,
    String message,
    LocalDateTime createdAt,
    LocalDateTime timestamp
) {} 
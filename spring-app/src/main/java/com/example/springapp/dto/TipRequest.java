package com.example.springapp.dto;

import java.math.BigDecimal;

public record TipRequest(
    String receiverLink,
    BigDecimal amount,
    String message
) {} 
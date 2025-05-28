package com.example.springapp.dto;

public record UserResponse(
    String email,
    String firstname,
    String lastname,
    String publicLink,
    Double balance,
    String avatarUrl
) {} 
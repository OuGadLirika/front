package com.example.springapp.security;

import com.example.springapp.entity.User;
import com.example.springapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;

public class JwtUserSyncFilter extends OncePerRequestFilter {

    @Autowired
    private UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Пропускаем запросы к аватарам (как для /avatars/, так и для /api/avatars/)
        if (request.getRequestURI().startsWith("/avatars/") || request.getRequestURI().startsWith("/api/avatars/")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            JwtAuthenticationToken token = (JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();

            String firstname = String.valueOf(token.getTokenAttributes().get("given_name"));
            String lastname = String.valueOf(token.getTokenAttributes().get("family_name"));
            String email = String.valueOf(token.getTokenAttributes().get("email"));
            User.Gender gender = token.getTokenAttributes().get("gender") == null ? null :
                    User.Gender.valueOf(String.valueOf(token.getTokenAttributes().get("gender")).toUpperCase());

            // Получаем существующего пользователя или создаем нового
            User existingUser = userService.getLoggedUser();
            User user = User.builder()
                    .firstname(firstname)
                    .lastname(lastname)
                    .email(email)
                    .gender(gender)
                    .avatarUrl(existingUser.getAvatarUrl()) // Сохраняем существующий аватар
                    .publicLink(existingUser.getPublicLink()) // Сохраняем существующий publicLink
                    .balance(existingUser.getBalance()) // Сохраняем существующий баланс
                    .build();

            userService.syncUser(user);
        } catch (Exception e) {
            throw new IllegalArgumentException("Unable to auth user");
        }

        filterChain.doFilter(request, response);
    }

}

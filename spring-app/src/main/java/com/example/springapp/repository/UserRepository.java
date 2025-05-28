package com.example.springapp.repository;

import com.example.springapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    Optional<User> findByPublicLink(String publicLink);
    boolean existsByEmail(String email);
    boolean existsByPublicLink(String publicLink);
    List<User> findByPublicLinkContainingIgnoreCase(String query);
}

package com.example.springapp.repository;

import com.example.springapp.entity.Tip;
import com.example.springapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TipRepository extends JpaRepository<Tip, Long> {
    @Query("SELECT t FROM Tip t LEFT JOIN FETCH t.sender LEFT JOIN FETCH t.receiver WHERE t.receiver = :receiver")
    List<Tip> findByReceiver(User receiver);

    @Query("SELECT t FROM Tip t LEFT JOIN FETCH t.sender LEFT JOIN FETCH t.receiver WHERE t.sender = :sender")
    List<Tip> findBySender(User sender);
} 
package com.example.springapp.service;

import com.example.springapp.entity.Tip;
import com.example.springapp.entity.User;
import com.example.springapp.repository.TipRepository;
import com.example.springapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TipService {

    private final TipRepository tipRepository;
    private final UserRepository userRepository;

    @Transactional
    public Tip saveTip(Tip tip) {
        // Проверяем баланс отправителя
        if (tip.getSender().getBalance() < tip.getAmount().doubleValue()) {
            throw new IllegalStateException("Insufficient balance");
        }

        // Списываем сумму с баланса отправителя
        User sender = tip.getSender();
        sender.setBalance(sender.getBalance() - tip.getAmount().doubleValue());
        userRepository.save(sender);

        // Добавляем сумму на баланс получателя
        User receiver = tip.getReceiver();
        receiver.setBalance(receiver.getBalance() + tip.getAmount().doubleValue());
        userRepository.save(receiver);

        return tipRepository.save(tip);
    }

    @Transactional(readOnly = true)
    public List<Tip> getReceivedTips(User user) {
        return tipRepository.findByReceiver(user);
    }

    @Transactional(readOnly = true)
    public List<Tip> getSentTips(User user) {
        return tipRepository.findBySender(user);
    }
} 
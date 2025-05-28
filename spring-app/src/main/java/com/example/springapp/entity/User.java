package com.example.springapp.entity;

import lombok.*;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "USER_")
@Getter @Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @Column(unique = true, nullable = false)
    private String email;

    @Column
    private String firstname;

    @Column
    private String lastname;

    @Column
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(length = 512)
    private String bio;

    @Column(unique = true, nullable = false)
    private String publicLink;

    @Column
    private String avatarUrl;

    @Column(columnDefinition = "DECIMAL(10,2)")
    private Double balance;

    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Tip> receivedTips;

    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Tip> sentTips;

    public enum Gender {
        MALE, FEMALE
    }

    // Геттеры
    public String getEmail() { return email; }
    public String getFirstname() { return firstname; }
    public String getLastname() { return lastname; }
    public Gender getGender() { return gender; }
    public String getBio() { return bio; }
    public String getPublicLink() { return publicLink; }
    public String getAvatarUrl() { return avatarUrl; }
    public Double getBalance() { return balance; }
    public List<Tip> getReceivedTips() { return receivedTips; }
    public List<Tip> getSentTips() { return sentTips; }

    // Сеттеры
    public void setEmail(String email) { this.email = email; }
    public void setFirstname(String firstname) { this.firstname = firstname; }
    public void setLastname(String lastname) { this.lastname = lastname; }
    public void setGender(Gender gender) { this.gender = gender; }
    public void setBio(String bio) { this.bio = bio; }
    public void setPublicLink(String publicLink) { this.publicLink = publicLink; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public void setBalance(Double balance) { this.balance = balance; }
    public void setReceivedTips(List<Tip> receivedTips) { this.receivedTips = receivedTips; }
    public void setSentTips(List<Tip> sentTips) { this.sentTips = sentTips; }
}

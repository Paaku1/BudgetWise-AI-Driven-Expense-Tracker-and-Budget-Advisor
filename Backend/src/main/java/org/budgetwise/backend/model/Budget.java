package org.budgetwise.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "budgets")
@Data
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String category; // e.g. Food, Transport, etc.

    @Column(nullable = false)
    private double limitAmount; // max budget set by user

    @Column(nullable = false)
    private double spentAmount = 0; // how much already spent

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate EndDate;
}


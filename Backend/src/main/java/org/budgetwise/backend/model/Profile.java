package org.budgetwise.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name="profile")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private Double income;
    private Double savings;
    private Double targetExpenses;

    @OneToOne
    @JoinColumn(name = "id", referencedColumnName = "id")
    private User user;

}

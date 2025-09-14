package org.budgetwise.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfileDTO {
    private int id;
    private double income;
    private double savings;
    private double targetExpenses;
    private String username;

}


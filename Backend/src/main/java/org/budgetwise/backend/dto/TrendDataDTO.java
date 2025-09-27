package org.budgetwise.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class TrendDataDTO {
    private List<String> labels; // e.g., ["April", "May", "June"]
    private List<Double> incomeData;
    private List<Double> expenseData;
}
package org.budgetwise.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.budgetwise.backend.model.Profile;
import org.springframework.security.core.parameters.P;

@Data
@AllArgsConstructor
public class ProfileDTO {
    private int id;
    private double income;
    private double savings;
    private double targetExpenses;
    private String username;
    private String firstName; // ✅ Add this
    private String lastName;  // ✅ Add this

    public static ProfileDTO fromEntity(Profile p) {
        return new ProfileDTO(
                p.getUserId(),
                p.getIncome(),
                p.getTargetExpenses(),
                p.getSavings(),
                p.getUser().getUsername(),
                p.getUser().getFirstName(), // ✅ Get the first name
                p.getUser().getLastName()   // ✅ Get the last name
        );
    }
}


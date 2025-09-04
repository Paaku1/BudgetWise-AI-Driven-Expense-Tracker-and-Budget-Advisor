package org.budgetwise.backend.dto;

import org.budgetwise.backend.model.Transaction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record TransactionDTO(
        int id,
        String type,
        BigDecimal amount,
        String category,
        String description,
        LocalDate date,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    // ✅ Convert Entity → DTO
    public static TransactionDTO fromEntity(Transaction t) {
        return new TransactionDTO(
                t.getId(),
                t.getType().name(),
                t.getAmount(),
                t.getCategory(),
                t.getDescription(),
                t.getDate(),
                t.getCreatedAt(),
                t.getUpdatedAt()
        );
    }
}

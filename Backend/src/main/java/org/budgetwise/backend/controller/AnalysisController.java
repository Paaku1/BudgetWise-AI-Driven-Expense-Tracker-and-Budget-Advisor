package org.budgetwise.backend.controller;

import lombok.RequiredArgsConstructor;
import org.budgetwise.backend.dto.*;
import org.budgetwise.backend.service.AnalysisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analysis")
@RequiredArgsConstructor
public class AnalysisController {

    private final AnalysisService analysisService;

    @GetMapping("/expense-summary/{userId}")
    public ResponseEntity<ExpenseSummaryDTO> getExpenseSummary(@PathVariable int userId) {
        return ResponseEntity.ok(analysisService.getExpenseSummary(userId));
    }

    @GetMapping("/expense-by-category/{userId}")
    public ResponseEntity<List<CategorySpendingDTO>> getExpenseByCategory(@PathVariable int userId) {
        return ResponseEntity.ok(analysisService.getExpenseByCategory(userId));
    }

    @GetMapping("/expense-summary-by-category/{userId}")
    public ResponseEntity<ExpenseSummaryDTO> getExpenseSummaryForCategory(
            @PathVariable int userId,
            @RequestParam String category) {
        return ResponseEntity.ok(analysisService.getExpenseSummaryForCategory(userId, category));
    }

    @GetMapping("/income-summary/{userId}")
    public ResponseEntity<IncomeSummaryDTO> getIncomeSummary(@PathVariable int userId) {
        return ResponseEntity.ok(analysisService.getIncomeSummary(userId));
    }

    @GetMapping("/income-by-category/{userId}")
    public ResponseEntity<List<CategorySpendingDTO>> getIncomeByCategory(@PathVariable int userId) {
        return ResponseEntity.ok(analysisService.getIncomeByCategory(userId));
    }

    @GetMapping("/savings-summary/{userId}")
    public ResponseEntity<SavingsSummaryDTO> getSavingsSummary(@PathVariable int userId) {
        return ResponseEntity.ok(analysisService.getSavingsSummary(userId));
    }

    @GetMapping("/income-summary-by-category/{userId}")
    public ResponseEntity<IncomeSummaryDTO> getIncomeSummaryForCategory(
            @PathVariable int userId,
            @RequestParam String category) {
        return ResponseEntity.ok(analysisService.getIncomeSummaryForCategory(userId, category));
    }

    @GetMapping("/cash-flow/{userId}")
    public ResponseEntity<CashFlowDTO> getCashFlowSummary(@PathVariable int userId) {
        return ResponseEntity.ok(analysisService.getCashFlowSummary(userId));
    }

    @GetMapping("/income-expense-trend/{userId}")
    public ResponseEntity<TrendDataDTO> getIncomeVsExpenseTrend(@PathVariable int userId) {
        return ResponseEntity.ok(analysisService.getIncomeVsExpenseTrend(userId));
    }

    @GetMapping("/top-expense-categories/{userId}")
    public ResponseEntity<List<CategorySpendingDTO>> getTopExpenseCategories(@PathVariable int userId) {
        return ResponseEntity.ok(analysisService.getTopExpenseCategories(userId));
    }

    @GetMapping("/savings-by-category/{userId}")
    public ResponseEntity<List<CategorySpendingDTO>> getSavingsByCategory(@PathVariable int userId) {
        return ResponseEntity.ok(analysisService.getSavingsByCategory(userId));
    }

    @GetMapping("/expense-heatmap/{userId}")
    public ResponseEntity<Map<LocalDate, Double>> getExpenseHeatMapData(
            @PathVariable int userId,
            @RequestParam int year,
            @RequestParam int month) {
        return ResponseEntity.ok(analysisService.getExpenseHeatMapData(userId, year, month));
    }
}

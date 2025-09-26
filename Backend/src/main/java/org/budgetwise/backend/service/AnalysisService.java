package org.budgetwise.backend.service;

import lombok.RequiredArgsConstructor;
import org.budgetwise.backend.dto.*;
import org.budgetwise.backend.model.Profile;
import org.budgetwise.backend.model.SavingGoal;
import org.budgetwise.backend.model.Transaction;
import org.budgetwise.backend.model.TransactionType;
import org.budgetwise.backend.repository.ProfileRepository;
import org.budgetwise.backend.repository.SavingGoalRepository;
import org.budgetwise.backend.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalysisService {

    private final TransactionRepository transactionRepository;
    private final SavingGoalRepository savingGoalRepository;
    private final ProfileRepository profileRepository;

    public ExpenseSummaryDTO getExpenseSummary(int userId) {
        LocalDate today = getLocalDate();
        LocalDate startOfMonth = today.withDayOfMonth(1);

        List<Transaction> monthlyExpenses = transactionRepository.findByUserIdAndTypeAndDateBetween(
                userId, TransactionType.EXPENSE, startOfMonth, today
        );

        double totalSpend = monthlyExpenses.stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();

        double averageDailySpend = totalSpend / today.getDayOfMonth();

        String highestSpendingCategory = monthlyExpenses.stream()
                .collect(Collectors.groupingBy(
                        Transaction::getCategory,
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)
                ))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");

        return new ExpenseSummaryDTO(totalSpend, averageDailySpend, highestSpendingCategory);
    }

    public List<CategorySpendingDTO> getExpenseByCategory(int userId) {
        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);
        List<Transaction> monthlyExpenses = transactionRepository.findByUserIdAndTypeAndDateBetween(
                userId, TransactionType.EXPENSE, startOfMonth, today);

        return monthlyExpenses.stream()
                .collect(Collectors.groupingBy(
                        Transaction::getCategory,
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)
                ))
                .entrySet().stream()
                .map(entry -> new CategorySpendingDTO(entry.getKey(), entry.getValue().doubleValue()))
                .collect(Collectors.toList());
    }

    public ExpenseSummaryDTO getExpenseSummaryForCategory(int userId, String category) {
        LocalDate today = getLocalDate();
        LocalDate startOfMonth = today.withDayOfMonth(1);

        List<Transaction> monthlyExpensesForCategory = transactionRepository
                .findByUserIdAndTypeAndCategoryAndDateBetween(userId, TransactionType.EXPENSE, category, startOfMonth, today);

        double totalSpend = monthlyExpensesForCategory.stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();


        long transactionCount = monthlyExpensesForCategory.size();
        double averageTransactionAmount = (transactionCount > 0)
                ? BigDecimal.valueOf(totalSpend / transactionCount).setScale(2, RoundingMode.HALF_UP).doubleValue()
                : 0;


        return new ExpenseSummaryDTO(totalSpend, averageTransactionAmount, category);
    }

    public IncomeSummaryDTO getIncomeSummary(int userId) {
        LocalDate today = getLocalDate();
        LocalDate startOfMonth = today.withDayOfMonth(1);

        List<Transaction> monthlyIncome = transactionRepository.findByUserIdAndTypeAndDateBetween(
                userId, TransactionType.INCOME, startOfMonth, today
        );

        double totalIncome = monthlyIncome.stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();

        String highestIncomeCategory = monthlyIncome.stream()
                .collect(Collectors.groupingBy(
                        Transaction::getCategory,
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)
                ))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");

        return new IncomeSummaryDTO(totalIncome, highestIncomeCategory);
    }

    private LocalDate getLocalDate() {
        return LocalDate.now();
    }

    public List<CategorySpendingDTO> getIncomeByCategory(int userId) {
        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);
        List<Transaction> monthlyIncome = transactionRepository.findByUserIdAndTypeAndDateBetween(
                userId, TransactionType.INCOME, startOfMonth, today);

        return monthlyIncome.stream()
                .collect(Collectors.groupingBy(
                        Transaction::getCategory,
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)
                ))
                .entrySet().stream()
                .map(entry -> new CategorySpendingDTO(entry.getKey(), entry.getValue().doubleValue()))
                .collect(Collectors.toList());
    }

    public SavingsSummaryDTO getSavingsSummary(int userId) {
        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);

        List<Transaction> monthlyIncome = transactionRepository.findByUserIdAndTypeAndDateBetween(
                userId, TransactionType.INCOME, startOfMonth, today
        );

        double totalSaved = monthlyIncome.stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();

        List<SavingGoal> goals = savingGoalRepository.findByUserId(userId);
        int goalsMet = (int) goals.stream().filter(g -> g.getSavedAmount() >= g.getTargetAmount()).count();
        int goalsInProgress = goals.size() - goalsMet;

        return new SavingsSummaryDTO(totalSaved, goalsMet, goalsInProgress);
    }

    public IncomeSummaryDTO getIncomeSummaryForCategory(int userId, String category) {
        LocalDate today = getLocalDate();
        LocalDate startOfMonth = today.withDayOfMonth(1);

        List<Transaction> monthlyIncomeForCategory = transactionRepository.findByUserIdAndTypeAndCategoryAndDateBetween(
                userId, TransactionType.INCOME, category, startOfMonth, today
        );

        double totalIncome = monthlyIncomeForCategory.stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();


        return new IncomeSummaryDTO(totalIncome, category);
    }

    public CashFlowDTO getCashFlowSummary(int userId) {

        double monthlyIncome = profileRepository.findByUserId(userId)
                .map(Profile::getIncome)
                .orElse(0.0);


        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);

        List<Transaction> monthlyExpenses = transactionRepository.findByUserIdAndTypeAndDateBetween(
                userId, TransactionType.EXPENSE, startOfMonth, today
        );
        double totalExpenses = monthlyExpenses.stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();


        double moneyLeftToSpend = monthlyIncome - totalExpenses;

        return new CashFlowDTO(monthlyIncome, totalExpenses, moneyLeftToSpend);
    }


}
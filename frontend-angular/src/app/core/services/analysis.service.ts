import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

// Define interfaces for the data structures
export interface ExpenseSummary {
  totalSpendThisMonth: number;
  averageDailySpend: number;
  highestSpendingCategory: string;
}

export interface CategorySpending {
  category: string;
  totalAmount: number;
}

export interface IncomeSummary {
  totalIncomeThisMonth: number;
  highestIncomeCategory: string;
}

export interface SavingsSummary {
  totalSavedThisMonth: number;
  goalsMet: number;
  goalsInProgress: number;
}

export interface CashFlowSummary {
  monthlyIncome: number;
  totalExpenses: number;
  moneyLeftToSpend: number;
}

export interface TrendData {
  labels: string[];
  incomeData: number[];
  expenseData: number[];
}

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  private apiUrl = 'http://localhost:5000/api/analysis';

  constructor(private http: HttpClient) { }

  getExpenseSummary(userId: number): Observable<ExpenseSummary> {
    return this.http.get<ExpenseSummary>(`${this.apiUrl}/expense-summary/${userId}`);
  }

  getExpenseByCategory(userId: number): Observable<CategorySpending[]> {
    return this.http.get<CategorySpending[]>(`${this.apiUrl}/expense-by-category/${userId}`);
  }

  getExpenseSummaryForCategory(userId: number, category: string): Observable<ExpenseSummary> {
    return this.http.get<ExpenseSummary>(`${this.apiUrl}/expense-summary-by-category/${userId}`, { params: { category } });
  }

  getIncomeSummary(userId: number): Observable<IncomeSummary> {
    return this.http.get<IncomeSummary>(`${this.apiUrl}/income-summary/${userId}`);
  }

  getIncomeByCategory(userId: number): Observable<CategorySpending[]> {
    return this.http.get<CategorySpending[]>(`${this.apiUrl}/income-by-category/${userId}`);
  }

  getSavingsSummary(userId: number): Observable<SavingsSummary> {
    return this.http.get<SavingsSummary>(`${this.apiUrl}/savings-summary/${userId}`);
  }

  getIncomeSummaryForCategory(userId: number, category: string): Observable<IncomeSummary> {
    return this.http.get<IncomeSummary>(`${this.apiUrl}/income-summary-by-category/${userId}`, { params: { category } });
  }

  getCashFlowSummary(userId: number): Observable<CashFlowSummary> {
    return this.http.get<CashFlowSummary>(`${this.apiUrl}/cash-flow/${userId}`);
  }

  getIncomeVsExpenseTrend(userId: number): Observable<TrendData> {
    return this.http.get<TrendData>(`${this.apiUrl}/income-expense-trend/${userId}`);
  }

  getTopExpenseCategories(userId: number): Observable<CategorySpending[]> {
    return this.http.get<CategorySpending[]>(`${this.apiUrl}/top-expense-categories/${userId}`);
  }

  getSavingsByCategory(userId: number): Observable<CategorySpending[]> {
    return this.http.get<CategorySpending[]>(`${this.apiUrl}/savings-by-category/${userId}`);
  }

  getExpenseHeatMapData(userId: number, year: number, month: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/expense-heatmap/${userId}`, { params: { year, month } });
  }

  getMonthlySummary(userId: number): Observable<{income: number, expense: number}> {
    return this.http.get<{income: number, expense: number}>(`${this.apiUrl}/monthly-summary/${userId}`);
  }

  getDailyExpenseTrend(userId: number, year: number, month: number, categories: string[]): Observable<any> {
    let params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString());

    // Append each category to the parameters
    categories.forEach(category => {
      params = params.append('categories', category);
    });

    return this.http.get(`${this.apiUrl}/daily-expense-trend/${userId}`, { params });
  }
}

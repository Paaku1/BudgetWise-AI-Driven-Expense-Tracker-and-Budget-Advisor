import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AnalysisService, ExpenseSummary, CategorySpending, IncomeSummary, SavingsSummary } from '../../core/services/analysis.service';
import { AuthService } from '../../core/services/auth.service';
import { TransactionService } from '../../core/services/transaction.service';
import { Transaction } from '../../shared/models/transaction';
import { PieChartComponent } from '../charts/pie-chart/pie-chart';
import { BarChartComponent } from '../charts/bar-chart/bar-chart';
import { TransactionListComponent } from '../transaction/transaction-list/transaction-list';
import { UserProfile } from '../../shared/models/userProfile';
import { ProfileService } from '../../core/services/profile.service';
import {TransactionFormComponent} from '../transaction/transaction-form/transaction-form';


@Component({
  selector: 'app-analysis-page',
  standalone: true,
  imports: [
    CommonModule, CurrencyPipe, RouterLink,
    TransactionListComponent, PieChartComponent, BarChartComponent, TransactionFormComponent
  ],
  templateUrl: './analysis-page.html',
  styleUrls: ['./analysis-page.scss']
})
export class AnalysisPageComponent implements OnInit {
  activeTab: 'expenses' | 'income' | 'savings' = 'expenses';
  selectedChartType: 'pie' | 'bar' = 'pie';

  // Data properties
  transactions: Transaction[] = [];
  userProfile: UserProfile | null = null;
  expenseSummary: ExpenseSummary | null = null;
  expenseByCategory: CategorySpending[] = [];
  incomeSummary: IncomeSummary | null = null;
  incomeByCategory: CategorySpending[] = [];
  savingsSummary: SavingsSummary | null = null;

  // ✅ These two properties will hold the details for the sidebar
  selectedExpenseCategorySummary: ExpenseSummary | null = null;
  selectedIncomeCategorySummary: IncomeSummary | null = null;
  isTransactionFormVisible = false;

  constructor(
    private route: ActivatedRoute,
    private transactionService: TransactionService,
    private authService: AuthService,
    private analysisService: AnalysisService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const type = params.get('type');
      if (type === 'income' || type === 'savings' || type === 'expenses') {
        this.selectTab(type);
      } else {
        this.selectTab('expenses');
      }
    });
  }


  onAddTransaction(): void {
    this.isTransactionFormVisible = true;
  }


  selectTab(tab: 'expenses' | 'income' | 'savings'): void {
    this.activeTab = tab;
    this.transactions = [];
    this.selectedChartType = 'pie'; // Reset to default view
    this.fetchDataForTab();
  }

  selectChartType(type: 'pie' | 'bar'): void {
    this.selectedChartType = type;
  }

  fetchDataForTab(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    // Reset details panels when switching tabs
    this.selectedExpenseCategorySummary = null;
    this.selectedIncomeCategorySummary = null;

    if (this.activeTab === 'expenses') {
      this.fetchExpenseData(userId);
    } else if (this.activeTab === 'income') {
      this.fetchIncomeData(userId);
    } else if (this.activeTab === 'savings') {
      this.fetchSavingsData(userId);
    }
  }

  fetchExpenseData(userId: number): void {
    this.profileService.getProfile(userId).subscribe(profile => this.userProfile = profile);
    this.analysisService.getExpenseSummary(userId).subscribe(data => this.expenseSummary = data);
    this.analysisService.getExpenseByCategory(userId).subscribe(data => this.expenseByCategory = data);
    this.transactionService.getTransactions(userId).subscribe(all => this.transactions = all.filter(t => t.type === 'EXPENSE'));
  }

  fetchIncomeData(userId: number): void {
    this.analysisService.getIncomeSummary(userId).subscribe(data => this.incomeSummary = data);
    this.analysisService.getIncomeByCategory(userId).subscribe(data => this.incomeByCategory = data);
    this.transactionService.getTransactions(userId).subscribe(all => this.transactions = all.filter(t => t.type === 'INCOME'));
  }

  fetchSavingsData(userId: number): void {
    this.analysisService.getSavingsSummary(userId).subscribe(data => this.savingsSummary = data);
  }

  onCategorySelected(category: string): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    if (this.activeTab === 'expenses') {
      this.analysisService.getExpenseSummaryForCategory(userId, category).subscribe(summary => {
        this.selectedExpenseCategorySummary = summary;
      });
    } else if (this.activeTab === 'income') {
      this.analysisService.getIncomeSummaryForCategory(userId, category).subscribe(summary => {
        this.selectedIncomeCategorySummary = summary;
      });
    }
  }

  onTransactionAdded(): void {
    console.log("New transaction added, refreshing analysis data..."); // For debugging
    this.isTransactionFormVisible = false;
    this.fetchDataForTab();
  }

}

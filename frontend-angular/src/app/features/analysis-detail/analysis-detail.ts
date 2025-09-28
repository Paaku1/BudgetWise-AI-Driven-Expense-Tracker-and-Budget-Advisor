import {Component, OnInit} from '@angular/core';
import {CommonModule, CurrencyPipe, DatePipe} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {
  AnalysisService,
  ExpenseSummary,
  CategorySpending,
  IncomeSummary,
  SavingsSummary
} from '../../core/services/analysis.service';
import {AuthService} from '../../core/services/auth.service';
import {TransactionService} from '../../core/services/transaction.service';
import {Transaction} from '../../shared/models/transaction';
import {PieChartComponent} from '../charts/pie-chart/pie-chart';
import {BarChartComponent} from '../charts/bar-chart/bar-chart';
import {TransactionListComponent} from '../transaction/transaction-list/transaction-list';
import {UserProfile} from '../../shared/models/userProfile';
import {ProfileService} from '../../core/services/profile.service';
import {TransactionFormComponent} from '../transaction/transaction-form/transaction-form';
import {BreadcrumbService} from '../../core/services/breadcrumb.service';
import {TopCategoriesComponent} from '../charts/top-categories/top-categories';
import {SavingGoalsComponent} from '../saving-goals/saving-goals';
import {SavingGoal} from '../../shared/models/savingGoal';
import {SavingGoalService} from '../../core/services/saving-goal.service';
import {IncomeDetailComponent} from './detail/income-detail/income-detail';
import {SavingsDetailComponent} from './detail/savings-detail/savings-detail';
import {ExpenseDetailComponent} from './detail/expense-detail/expense-detail';


@Component({
  selector: 'app-analysis-detail',
  standalone: true,
  imports: [
    CommonModule,
    TransactionFormComponent,
    IncomeDetailComponent,
    SavingsDetailComponent,
    ExpenseDetailComponent,
    RouterLink
  ],
  templateUrl: './analysis-detail.html',
  styleUrls: ['./analysis-detail.scss']
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

  savingGoals: SavingGoal[] = [];

  // ✅ These two properties will hold the details for the sidebar
  selectedExpenseCategorySummary: ExpenseSummary | null = null;
  selectedIncomeCategorySummary: IncomeSummary | null = null;
  isTransactionFormVisible = false;

  constructor(
    private route: ActivatedRoute,
    private transactionService: TransactionService,
    private authService: AuthService,
    private analysisService: AnalysisService,
    private profileService: ProfileService,
    private breadcrumbService: BreadcrumbService,
    private savingGoalService: SavingGoalService
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const type = params.get('type');
      if (type === 'income' || type === 'savings' || type === 'expenses') {
        this.selectTab(type);
      } else {
        this.selectTab('expenses'); // Default to expenses
      }
    });
  }


  onAddTransaction(): void {
    this.isTransactionFormVisible = true;
  }


  selectTab(tab: 'expenses' | 'income' | 'savings'): void {
    this.activeTab = tab;
    const capitalizedType = tab.charAt(0).toUpperCase() + tab.slice(1);

    // This setTimeout is the fix for the NG0100 error
    setTimeout(() => {
      this.breadcrumbService.setBreadcrumbs([
        { label: 'Dashboard', url: '/dashboard' },
        { label: 'Analysis', url: '/analysis' },
        { label: capitalizedType, url: '' }
      ]);
    });
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
    this.savingGoalService.getGoals(userId).subscribe(goals => {
      this.savingGoals = goals;

      // OPTIONAL: Sort goals for better display (e.g., in progress first)
      this.savingGoals.sort((a, b) => {
        const progressA = a.savedAmount / a.targetAmount;
        const progressB = b.savedAmount / b.targetAmount;
        return progressA - progressB; // Low progress first
      });
    });
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

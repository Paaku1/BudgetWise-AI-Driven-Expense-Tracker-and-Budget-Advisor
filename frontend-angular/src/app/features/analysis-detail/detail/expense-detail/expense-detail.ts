import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { AnalysisService, ExpenseSummary, CategorySpending } from '../../../../core/services/analysis.service';
import { AuthService } from '../../../../core/services/auth.service';
import { TransactionService } from '../../../../core/services/transaction.service';
import { PieChartComponent } from '../../../charts/pie-chart/pie-chart';
import { BarChartComponent } from '../../../charts/bar-chart/bar-chart';
import { TopCategoriesComponent } from '../../../charts/top-categories/top-categories';
import { LineChartComponent } from '../../../charts/line-chart/line-chart';

@Component({
  selector: 'app-expense-detail',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    FormsModule, // Add FormsModule
    PieChartComponent,
    BarChartComponent,
    TopCategoriesComponent,
    LineChartComponent
  ],
  templateUrl: './expense-detail.html',
  styleUrls: ['./expense-detail.scss']
})
export class ExpenseDetailComponent implements OnInit {
  // Properties for top charts
  selectedChartType: 'pie' | 'bar' = 'pie';
  expenseSummary: ExpenseSummary | null = null;
  expenseByCategory: CategorySpending[] = [];
  selectedExpenseCategorySummary: ExpenseSummary | null = null;

  // Properties for the new daily trend line chart
  allCategories: string[] = [];
  selectedCategories: { [key: string]: boolean } = {};
  selectedMonth: string;
  monthlyTrendData: any = {};

  constructor(
    private analysisService: AnalysisService,
    private authService: AuthService,
    private transactionService: TransactionService
  ) {
    // Default month to the current month
    const today = new Date();
    this.selectedMonth = today.toISOString().substring(0, 7); // Format: "YYYY-MM"
  }

  ngOnInit(): void {
    this.fetchInitialData();
  }

  fetchInitialData(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.analysisService.getExpenseSummary(userId).subscribe(data => this.expenseSummary = data);

    // Fetch top categories first
    this.analysisService.getExpenseByCategory(userId).subscribe(expenseCategories => {
      this.expenseByCategory = expenseCategories;

      // Now, use this result to build our list of categories for the checklist
      this.allCategories = expenseCategories.map(c => c.category);

      // Pre-select the top 3 categories by default
      this.allCategories.slice(0, 3).forEach(cat => {
        this.selectedCategories[cat] = true;
      });

      // With the categories selected, fetch the data for the line chart
      this.updateMonthlyTrendChart();
    });
  }

  updateMonthlyTrendChart(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    const [year, month] = this.selectedMonth.split('-').map(Number);
    const activeCategories = Object.keys(this.selectedCategories).filter(cat => this.selectedCategories[cat]);

    if (activeCategories.length > 0) {
      this.analysisService.getDailyExpenseTrend(userId, year, month, activeCategories).subscribe(data => {
        this.monthlyTrendData = data;
      });
    } else {
      this.monthlyTrendData = { labels: [], datasets: [] };
    }
  }

  toggleCategory(category: string): void {
    this.selectedCategories[category] = !this.selectedCategories[category];
    this.updateMonthlyTrendChart();
  }

  selectChartType(type: 'pie' | 'bar'): void {
    this.selectedChartType = type;
  }

  onCategorySelected(category: string): void {
    const userId = this.authService.getUserId();
    if (!userId) return;
    this.analysisService.getExpenseSummaryForCategory(userId, category).subscribe(summary => {
      this.selectedExpenseCategorySummary = summary;
    });
  }
}

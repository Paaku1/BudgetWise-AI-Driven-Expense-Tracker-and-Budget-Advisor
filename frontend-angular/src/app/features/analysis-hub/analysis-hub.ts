import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnalysisService, CategorySpending } from '../../core/services/analysis.service';
import { AuthService } from '../../core/services/auth.service';
import { LineChartComponent } from '../charts/line-chart/line-chart';
import { BreadcrumbService } from '../../core/services/breadcrumb.service';
import { TopCategoriesComponent } from '../charts/top-categories/top-categories';
import { SavingsOverviewComponent } from '../charts/savings-overview/savings-overview';
import { SavingGoal } from '../../shared/models/savingGoal';
import { SavingGoalService } from '../../core/services/saving-goal.service';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MonthlyHeatmapComponent } from '../charts/monthly-heatmap/monthly-heatmap';
import { BarChartComponent } from '../charts/bar-chart/bar-chart';

@Component({
  selector: 'app-analysis-hub',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LineChartComponent,
    TopCategoriesComponent,
    SavingsOverviewComponent,
    NgApexchartsModule,
    MonthlyHeatmapComponent,
    BarChartComponent
  ],
  templateUrl: './analysis-hub.html',
  styleUrls: ['./analysis-hub.scss']
})
export class AnalysisHubComponent implements OnInit {
  trendData: any = {};
  topExpenseCategories: CategorySpending[] = [];
  savingsGoals: SavingGoal[] = [];
  expenseByCategory: CategorySpending[] = [];
  incomeByCategory: CategorySpending[] = [];
  heatMapData: any[] = [];
  monthlySummaryPieData: CategorySpending[] = [];

  currentYear: number = 2025;
  currentMonth: number = 9;

  constructor(
    private analysisService: AnalysisService,
    private authService: AuthService,
    private breadcrumbService: BreadcrumbService,
    private savingGoalService: SavingGoalService
  ) {}

  ngOnInit(): void {
    this.initializePage();
  }


  private initializePage(): void {
    this.setupBreadcrumbs();
    const userId = this.authService.getUserId();
    if (!userId) {
      console.error("User ID not found. Cannot load analysis data.");
      return;
    }

    this.loadTrendData(userId);
    this.loadCategoryData(userId);
    this.loadSavingsGoals(userId);
    this.loadHeatMapData(userId);
    this.loadMonthlySummaryPie(userId);
  }


  private setupBreadcrumbs(): void {
    setTimeout(() => {
      this.breadcrumbService.setBreadcrumbs([
        { label: 'Dashboard', url: '/dashboard' },
        { label: 'Analysis', url: '' },
      ]);
    });
  }

  private loadTrendData(userId: number): void {
    this.analysisService.getIncomeVsExpenseTrend(userId).subscribe(apiData => {
      // The API returns two separate arrays in apiData.data
      // We need to transform it into the format the chart expects.
      if (apiData) {
        this.trendData = {
          labels: apiData.labels,
          datasets: [
            {
              label: 'Income',
              data: apiData.incomeData, // First array is Income
            },
            {
              label: 'Expense',
              data: apiData.expenseData, // Second array is Expense
            }
          ]
        };
      }
    });
  }

  private loadCategoryData(userId: number): void {
    this.analysisService.getTopExpenseCategories(userId).subscribe(data => {
      this.topExpenseCategories = data;
    });
    this.analysisService.getExpenseByCategory(userId).subscribe(data => {
      this.expenseByCategory = data;
    });
    this.analysisService.getIncomeByCategory(userId).subscribe(data => {
      this.incomeByCategory = data;
    });
  }

  private loadSavingsGoals(userId: number): void {
    this.savingGoalService.getGoals(userId).subscribe(data => {
      this.savingsGoals = data;
    });
  }

  private loadHeatMapData(userId: number): void {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth() + 1;

    this.analysisService.getExpenseHeatMapData(userId, this.currentYear, this.currentMonth)
      .subscribe(data => {
        // Convert the map to an array for the component input
        this.heatMapData = Object.entries(data).map(([date, value]) => ({ date, value: value as number }));
      });
  }

  private loadMonthlySummaryPie(userId: number): void {
    this.analysisService.getMonthlySummary(userId).subscribe(summary => {
      this.monthlySummaryPieData = [
        { category: 'Income', totalAmount: summary.income },
        { category: 'Expense', totalAmount: summary.expense }
      ];
    });
  }
}

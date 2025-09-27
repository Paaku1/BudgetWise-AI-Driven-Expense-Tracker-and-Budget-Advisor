import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {AnalysisService, CategorySpending} from '../../core/services/analysis.service';
import {AuthService} from '../../core/services/auth.service';
import {LineChartComponent} from '../charts/line-chart/line-chart';
import {BreadcrumbService} from '../../core/services/breadcrumb.service';
import {TopCategoriesComponent} from '../charts/top-categories/top-categories';
import {SavingsOverviewComponent} from '../charts/savings-overview/savings-overview';
import {SavingGoal} from '../../shared/models/savingGoal';
import {SavingGoalService} from '../../core/services/saving-goal.service';
import {NgApexchartsModule} from 'ng-apexcharts';
import {PieChartComponent} from '../charts/pie-chart/pie-chart';
import {HeatMapComponent} from '../charts/heat-map/heat-map';
import {MonthlyHeatmapComponent} from '../charts/monthly-heatmap/monthly-heatmap';
import {BarChartComponent} from '../charts/bar-chart/bar-chart';

@Component({
  selector: 'app-analysis-hub',
  standalone: true,
  imports: [CommonModule,
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
  selectedChartType: 'pie' | 'bar' | 'doughnut' = 'pie';

  public heatMapSeries: any[] = [];
  public heatMapOptions: any = {};
  monthlySummaryPieData: CategorySpending[] = [];
  currentYear: number;
  currentMonth: number;

  constructor(
    private analysisService: AnalysisService,
    private authService: AuthService,
    private breadcrumbService: BreadcrumbService,
    private savingGoalService: SavingGoalService
  ) {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth() + 1;
  }

  ngOnInit(): void {

    this.breadcrumbService.setBreadcrumbs([
      {label: 'Dashboard', url: '/dashboard'},
      {label: 'Analysis', url: ''},
    ]);

    const userId = this.authService.getUserId();
    if (userId) {
      this.analysisService.getIncomeVsExpenseTrend(userId).subscribe(data => {
        this.trendData = data;
      });

      this.analysisService.getTopExpenseCategories(userId).subscribe(data => {
        this.topExpenseCategories = data;
      });

      this.analysisService.getExpenseByCategory(userId).subscribe(data => this.expenseByCategory = data);
      this.analysisService.getIncomeByCategory(userId).subscribe(data => this.incomeByCategory = data);

      this.savingGoalService.getGoals(userId).subscribe(data => {
        this.savingsGoals = data;
      });

      const today = new Date();
      this.analysisService.getExpenseHeatMapData(userId, today.getFullYear(), today.getMonth() + 1)
        .subscribe(data => {
          this.heatMapData = Object.entries(data).map(([date, value]) => ({date, value}));
        });
      this.analysisService.getMonthlySummary(userId).subscribe(summary => {
        this.monthlySummaryPieData = [
          { category: 'Income', totalAmount: summary.income },
          { category: 'Expense', totalAmount: summary.expense }
        ];
      });

      this.analysisService.getExpenseHeatMapData(userId, today.getFullYear(), today.getMonth() + 1)
        .subscribe(data => {
          // Convert the map to an array for the component input
          this.heatMapData = Object.entries(data).map(([date, value]) => ({ date, value: value as number }));
        });
    }
  }

  selectChartType(type: 'pie' | 'bar' | 'doughnut'): void {
    this.selectedChartType = type;
  }
}

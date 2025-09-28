import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AnalysisService, IncomeSummary, CategorySpending } from '../../../../core/services/analysis.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PieChartComponent } from '../../../charts/pie-chart/pie-chart';
import { BarChartComponent } from '../../../charts/bar-chart/bar-chart';

@Component({
  selector: 'app-income-detail',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    PieChartComponent,
    BarChartComponent,
  ],
  templateUrl: './income-detail.html',
})
export class IncomeDetailComponent implements OnInit {
  selectedChartType: 'pie' | 'bar' = 'pie';
  incomeSummary: IncomeSummary | null = null;
  incomeByCategory: CategorySpending[] = [];
  selectedIncomeCategorySummary: IncomeSummary | null = null;

  constructor(
    private analysisService: AnalysisService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchIncomeData();
  }

  selectChartType(type: 'pie' | 'bar'): void {
    this.selectedChartType = type;
  }

  fetchIncomeData(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.analysisService.getIncomeSummary(userId).subscribe(data => this.incomeSummary = data);
    this.analysisService.getIncomeByCategory(userId).subscribe(data => this.incomeByCategory = data);
  }

  onCategorySelected(category: string): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.analysisService.getIncomeSummaryForCategory(userId, category).subscribe(summary => {
      this.selectedIncomeCategorySummary = summary;
    });
  }
}

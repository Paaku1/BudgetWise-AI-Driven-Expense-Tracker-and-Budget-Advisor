import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="chart-container">
      <canvas baseChart
        [data]="lineChartData"
        [type]="'line'"
        [options]="lineChartOptions">
      </canvas>
    </div>
  `,
  styleUrl: './line-chart.scss'
})
export class LineChartComponent implements OnChanges {
  @Input() data: any = {};

  public lineChartOptions: ChartOptions = { responsive: true, maintainAspectRatio: false };
  public lineChartData = {
    labels: [] as string[],
    datasets: [
      { data: [] as number[], label: 'Income', borderColor: '#28a745', backgroundColor: 'rgba(40, 167, 69, 0.1)', fill: true },
      { data: [] as number[], label: 'Expense', borderColor: '#dc3545', backgroundColor: 'rgba(220, 53, 69, 0.1)', fill: true }
    ]
  };
  public lineChartType: ChartType = 'line';

  ngOnChanges(): void {
    if (this.data && this.data.labels) {
      this.lineChartData = {
        labels: this.data.labels,
        datasets: [
          { ...this.lineChartData.datasets[0], data: this.data.incomeData },
          { ...this.lineChartData.datasets[1], data: this.data.expenseData }
        ]
      };
    }
  }
}

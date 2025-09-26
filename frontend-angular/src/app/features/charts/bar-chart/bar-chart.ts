import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions, ChartType, ChartEvent, ActiveElement } from 'chart.js';
import { CategorySpending } from '../../../core/services/analysis.service';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="chart-container">
      <canvas baseChart
        [data]="barChartData"
        [type]="'bar'"
        [options]="barChartOptions"
        (chartClick)="chartClicked($event)">
      </canvas>
    </div>
  `
})
export class BarChartComponent implements OnChanges {
  @Input() data: CategorySpending[] = [];
  @Input() label: string = 'Amount';
  @Output() categoryClicked = new EventEmitter<string>();

  public barChartOptions: ChartOptions = { responsive: true, maintainAspectRatio: false };
  public barChartData = {
    labels: [] as string[],
    datasets: [{
      data: [] as number[],
      label: this.label,
      backgroundColor: 'rgba(0, 123, 255, 0.6)',
    }]
  };
  public barChartType: ChartType = 'bar';

  ngOnChanges(): void {
    if (this.data && this.data.length > 0) {
      this.barChartData.labels = this.data.map(item => item.category);
      this.barChartData.datasets[0].data = this.data.map(item => item.totalAmount);
      this.barChartData.datasets[0].label = this.label;
    }
  }

  public chartClicked(event: any): void {
    if (event.active && event.active.length > 0) {
      const clickedIndex = event.active[0].index;
      const clickedLabel = this.barChartData.labels[clickedIndex];
      this.categoryClicked.emit(clickedLabel);
    }
  }
}

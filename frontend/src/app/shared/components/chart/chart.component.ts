import { Component, Input, AfterViewInit, OnDestroy, OnChanges, SimpleChanges, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

/**
 * Reusable Chart.js wrapper component.
 * Accepts a ChartConfiguration and renders the chart on a canvas element.
 */
@Component({
  selector: 'app-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="relative" [style.height]="height"><canvas #chartCanvas></canvas></div>`
})
export class ChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('chartCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() config!: ChartConfiguration;
  @Input() height = '250px';

  private chart: Chart | null = null;

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && !changes['config'].firstChange) {
      this.destroyChart();
      this.createChart();
    }
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  private createChart(): void {
    if (!this.canvasRef || !this.config) return;
    this.chart = new Chart(this.canvasRef.nativeElement, this.config);
  }

  private destroyChart(): void {
    this.chart?.destroy();
    this.chart = null;
  }
}

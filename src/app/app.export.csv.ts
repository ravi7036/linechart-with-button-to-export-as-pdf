import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';


@Component({
  selector: 'app-root',
  template: `
  <div class="chart-container">
    <highcharts-chart 
      [Highcharts]="Highcharts"
      [options]="chartOptions"
      style="width: 100%; height: 400px; display: block;"
    ></highcharts-chart>
    <button (click)="exportToCSV()" class="export-button">
      Export Data to CSV
    </button>
  </div>
`,
  standalone: false,
  styles: [`
  .chart-container {
    position: relative;
  }
  .export-button {
    margin-top: 10px;
    padding: 8px 16px;
    background-color: #2196F3;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .export-button:hover {
    background-color: #0b7dda;
  }
`]
})
export class AppComponent {
  title = 'line-demo-app';
  Highcharts: typeof Highcharts = Highcharts;
  chartData = [
    { name: 'Product A', data: [1000, 1500, 1200, 1800, 2000, 2500, 2200, 2800, 3000, 2700, 3500, 4000] },
    { name: 'Product B', data: [800, 1200, 1000, 1500, 1800, 2000, 2300, 2500, 2700, 3000, 3300, 3800] }
  ];
  categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  chartOptions: Highcharts.Options = {
    chart: {
      type: 'line'
    },
    title: {
      text: 'Monthly Sales Data'
    },
    xAxis: {
      categories: this.categories,
      title: {
        text: 'Month'
      }
    },
    yAxis: {
      title: {
        text: 'Sales Amount ($)'
      }
    },
    series: this.chartData.map(series => ({
      name: series.name,
      type: 'line',
      data: series.data
    }))
  };

  exportToCSV() {
    // Create CSV header
    let csv = 'Month,' + this.chartData.map(series => series.name).join(',') + '\n';

    // Add data rows
    this.categories.forEach((month, index) => {
      const rowValues = this.chartData.map(series => series.data[index]);
      csv += `${month},${rowValues.join(',')}\n`;
    });

    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'chart_data_export.csv');
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
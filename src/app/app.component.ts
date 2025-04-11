import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';


@Component({
  selector: 'app-root',
  template: `
  <div class="chart-container">
    <highcharts-chart 
      [Highcharts]="Highcharts"
      [options]="chartOptions"
      style="width: 100%; height: 400px; display: block;"
      #highcharts
    ></highcharts-chart>
    <button (click)="exportToPDF()" class="export-button">
      Export to PDF
    </button>
  </div>
`,
standalone: false,

styles: [`
  .chart-container {
    position: relative;
  }
  .export-button {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 8px 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    z-index: 10;
  }
  .export-button:hover {
    background-color: #45a049;
  }
`]
})
export class AppComponent {
  title = 'line-demo-app';
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'line'
    },
    title: {
      text: 'Monthly Sales Data'
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
      title: {
        text: 'Sales Amount ($)'
      }
    },
    series: [{
      name: '2023 Sales',
      type: 'line',
      data: [1000, 1500, 1200, 1800, 2000, 2500, 2200, 2800, 3000, 2700, 3500, 4000]
    }],
    exporting: {
      enabled: false // We'll handle our own export
    }
  };

  async exportToPDF() {
    try {
      // Get the chart container element
      const chartContainer = document.querySelector('highcharts-chart') as HTMLElement;
      
      // Use html2canvas to capture the chart as an image
      const canvas = await html2canvas(chartContainer, {
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
        allowTaint: true
      });

      // Create PDF
      const pdf = new jsPDF('landscape');
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dimensions to fit the PDF
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Add title and save
      pdf.text('Chart Export', 10, 10);
      pdf.save('chart-export.pdf');
      
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Error exporting chart to PDF');
    }
  }
}
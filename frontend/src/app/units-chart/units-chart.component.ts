import { Component } from '@angular/core';

@Component({
  selector: 'app-units-chart',
  templateUrl: './units-chart.component.html',
  styleUrls: ['./units-chart.component.css']
})
export class UnitsChartComponent {
  public lineChartData: ChartDataSetsLine[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
  ];
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions: ChartOptions = {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [];

  constructor() { }
}

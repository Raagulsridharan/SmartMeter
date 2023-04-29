import { Component, OnInit } from '@angular/core';
import { Reading } from '../reading';
import { Subject, takeUntil } from 'rxjs';
import { AppService } from '../app.service';
import { ChartOptions, Color } from 'chart.js';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { de } from 'date-fns/locale';
Chart.register(...registerables);

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  deviceId = '16042023';
  period = '7-day';
  power_chart: any = null;
  constructor(private appService: AppService) {
  }

  ngOnInit() {
    this.loadData();
  }

  onDeviceIdChange($event: any) {
    this.loadData();
  }

  onPeriodChange($event: any) {
    this.loadData();
  }

  loadData() {
    var query = {
      unit: this.period.split("-")[1],
      unitType: "POW",
      amount: this.period.split("-")[0]
    }
    this.appService.getReadings(this.deviceId, query).subscribe(readings => {
      console.log("get reading", readings);
      console.log("get power_chart", this.power_chart);
      if(this.power_chart == null){
        this.power_chart = new Chart("power-canvas", {
          type: 'line',
          data: {
            datasets: [{
              data: readings,
              parsing: {
                xAxisKey: 'usedAt',
                yAxisKey: 'usage'
              }
            }]
          }, options: {
            scales: {
              x: {
                type: 'timeseries'
              },
            }
          }
        });
      } else {        
        this.power_chart.data.datasets[0].data = readings;
        this.power_chart.update();
      }
      
    });
  }
}

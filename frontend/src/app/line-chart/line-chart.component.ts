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
  constructor(private appService: AppService) {
  }

  ngOnInit() {
    var myChart = new Chart("canvas", {
      type: 'line',
      data: {
        datasets: [{
          data: [{ usedAt: '2016-12-25 12:00', usage: 20 }, { usedAt: '2016-12-25 12:05', usage: 25 }, { usedAt: '2016-12-25 12:15', usage: 10 }],
          parsing: {
            xAxisKey: 'usedAt',
            yAxisKey: 'usage'
          }
        }]
      }, options: {
        scales: {
          x: {
            type: 'timeseries',
            time: {
              unit: 'minute'
            },
            adapters: {
              date: {
              }
            }
          },
        }
      }
    });
  }
}

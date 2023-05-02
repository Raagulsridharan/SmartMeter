import { Component, OnDestroy, OnInit } from '@angular/core';
import { Reading } from '../reading';
import { Subject, Subscription, interval, takeUntil, timer } from 'rxjs';
import { AppService } from '../app.service';
import { ChartOptions, Color } from 'chart.js';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { de } from 'date-fns/locale';
import { SwPush } from '@angular/service-worker';
import { Router } from '@angular/router';
Chart.register(...registerables);

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit, OnDestroy {
  deviceId: string | null = null;
  unit: false | "day" | "millisecond" | "second" | "minute" | "hour" | "week" | "month" | "quarter" | "year" | undefined = 'day';
  amount = '7';
  power_chart: any = null;
  cost_chart: any = null;
  subscription: Subscription = new Subscription();

  constructor(private swPush: SwPush, private appService: AppService, private router: Router) {
  }

  ngOnInit() {    
    if(localStorage.getItem("deviceId")){    
      this.deviceId = localStorage.getItem("deviceId");
      this.loadData();
      this.subscription = interval(5000).subscribe((time)=>{
        this.loadData();
      });
    } else {        
      this.router.navigate(['/login']);
    }    
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onDeviceIdChange($event: any) {
    this.loadData();
  }

  onPeriodChange($event: any) {
    this.loadData();
  }

  loadData() {
    if(this.deviceId){
      var query = {
        unit: this.unit,
        unitType: "POW",
        amount: this.amount
      }
      this.appService.getReadings(this.deviceId, query).subscribe(readings => {
        console.log("get reading", readings);
        console.log("get power_chart", this.power_chart);
        if(this.power_chart == null){
          this.power_chart = new Chart("power-canvas", {
            type: 'line',
            data: {
              datasets: [{
                label: 'Units',
                data: readings,
                backgroundColor: '#ffce56',
                parsing: {
                  xAxisKey: 'usedAt',
                  yAxisKey: 'usage'
                },
                borderColor: '#ffce56',
                pointBackgroundColor: 'blue'
              }]
            }, 
            options: {
              color: 'blue',
              responsive: true,
              scales: {
                x: {
                  type: 'timeseries',
                  time: {
                    unit: this.unit
                  }
                },
              }
            }
          });
        } else {        
          this.power_chart.data.datasets[0].data = readings;
          this.power_chart.update();
        }
        if(this.cost_chart == null){
          this.cost_chart = new Chart("cost-canvas", {
            type: 'line',
            data: {
              datasets: [{
                label: 'Cost',
                data: readings,
                backgroundColor: '#cc65fe',
                parsing: {
                  xAxisKey: 'usedAt',
                  yAxisKey: 'cost'
                },
                borderColor: '#cc65fe',
                pointBackgroundColor: 'red'
              }]
            }, 
            options: {
              color: 'red',
              responsive: true,
              scales: {
                x: {
                  type: 'timeseries',
                  time: {
                    unit: this.unit
                  }
                },
              }
            }
          });
        } else {        
          this.cost_chart.data.datasets[0].data = readings;
          this.cost_chart.update();
        }
      });
    }
  }
}

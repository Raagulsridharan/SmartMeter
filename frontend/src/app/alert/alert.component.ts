import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { Alert } from '../alert';
import * as moment from 'moment';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  deviceId = localStorage.getItem("deviceId");
  unitLimit: number = 10;
  displayedColumns: string[] = ['unitLimit', 'isSent', 'sentDate'];
  dataSource: Alert[] = [];
  moment: any = moment;
  constructor(private appService: AppService, private router: Router){

  }

  ngOnInit(): void {
    this.appService.getAlerts(this.deviceId!, {}).subscribe(alerts => {
      this.dataSource = alerts;
    });
  }

  onSubmit() {
    var deviceId = localStorage.getItem("deviceId");
    this.appService.postAlert(deviceId, this.unitLimit).subscribe(alert =>{
          if(alert){            
            this.router.navigate(['/dashboard']);           
          }
    })
  }
}

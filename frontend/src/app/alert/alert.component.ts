import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { Alert } from '../alert';
import * as moment from 'moment';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

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
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(private appService: AppService, private router: Router, private _snackBar: MatSnackBar){

  }

  ngOnInit(): void {
    this.appService.getAlerts(this.deviceId!, {}).subscribe(alerts => {
      this.dataSource = alerts;
    });
  }

  onSubmit() {
    var deviceId = localStorage.getItem("deviceId");
    var userId = localStorage.getItem("userId");
    this.appService.postAlert(deviceId, userId, this.unitLimit).subscribe(alert =>{
          if(alert){ 
            this.openSnackBar("🔔Alert saved successfuly!!")           
            this.router.navigate(['/dashboard']);           
          }
    })
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, 'Ok', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
  onBack(){
    this.router.navigate(['/dashboard']); 
  }
}

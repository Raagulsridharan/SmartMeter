import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Alert } from '../alert';
import * as moment from 'moment';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  deviceId = 0;
  unitLimit: number = 10;
  displayedColumns: string[] = ['unitLimit', 'isSent', 'sentDate'];
  dataSource: Alert[] = [];
  moment: any = moment;
  alertType: string = '';  
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  subscription: Subscription = new Subscription();
  constructor(private appService: AppService, private router: Router, private _snackBar: MatSnackBar, private activatedRoute: ActivatedRoute){

  }

  ngOnInit(): void {
    
    this.subscription = this.activatedRoute.params.subscribe(params => {
      this.alertType = params['alertType'];
      this.deviceId = params['deviceId'];
      this.appService.getAlerts(this.deviceId, { alertType: this.alertType }).subscribe(alerts => {
        this.dataSource = alerts;
      });
    });
  }

  onSubmit() {
    var userId = localStorage.getItem("userId");
    this.appService.postAlert(this.deviceId, userId, this.unitLimit, this.alertType).subscribe(alert =>{
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

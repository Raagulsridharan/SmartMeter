import { Component } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  unitLimit: number = 10;
  constructor(private appService: AppService, private router: Router){

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

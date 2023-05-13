import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Device } from '../device';
import { FormControl } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  showAddDevice = false;
  devices: Device[] = [];
  subscription: Subscription = new Subscription();
  loginsubscription: Subscription = new Subscription();
  deviceId = null;
  deviceName = "";
  selected = new FormControl(0);
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(private appService: AppService, private router: Router, private _snackBar: MatSnackBar) {
  }

  ngOnInit() {    
    var userId = localStorage.getItem("userId");
    if(userId){      
      this.subscription = this.appService.getDevices(userId,{}).subscribe((devices) => {
        if(devices.length){
          this.devices = devices;
        } else {
          this.showAddDevice = true;
        }
      });
    }
    this.loginsubscription = this.appService.loginsubject$.subscribe(userId=>{
      if(!userId){
        this.router.navigate(['/']);
      }
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.loginsubscription.unsubscribe();
  }

  onSubmit() {
    var oldDevice = this.devices.find(device => device.deviceId == this.deviceId);
    if(oldDevice?._id){
      this.openSnackBar(`The device ${this.deviceId} already exists!!`);
      return;
    }
    var userId = localStorage.getItem("userId");
    this.appService.postDevice(userId, this.deviceId, this.deviceName, new Date()).subscribe(device =>{
      if(device){    
        localStorage.setItem("deviceId", device._id);
        this.devices.push(device);
        this.showAddDevice = false;
      }
    })
  }
  addDevice(){
    this.showAddDevice = true;
  }
  removeDevice(index:number){
    var device = this.devices[index];
    this.appService.deleteDevice(device._id).subscribe(result =>{
      this.devices.splice(index, 1);
    });
  }
  onCancel(){
    this.showAddDevice = false;
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, 'Ok', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
}

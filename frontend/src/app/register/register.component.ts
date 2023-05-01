import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  loginValid = true;
  username: string = "";
  password: string = "";
  phonenumber: string = "";
  deviceId: string = "";
  constructor(private router: Router) { }

  public ngOnInit(): void {
    if(localStorage.getItem("SmartMeterUserName")){      
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    console.log("user name is " + this.username)
    this.clear(); 
  }

  clear() {
    this.username = "";
    this.password = "";
    this.phonenumber = "";    
    this.deviceId = "";
  }
}

import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginValid = true;
  username: string = "";
  password: string = "";
  show: boolean = false;
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
    this.show = true;
  }
  register() {
    this.router.navigate(['/register']);
  }
}

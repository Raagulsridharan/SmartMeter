import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  loginValid = true;
  username: string = "";
  password: string = "";
  phonenumber: string = "";
  constructor(private router: Router, private appService: AppService) { }

  public ngOnInit(): void {
    if(localStorage.getItem("userId")){      
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    console.log("user name is " + this.username);
    var userprofileInput = {
      username : this.username,
      password: this.password,
      phonenumber: this.phonenumber
    }
    this.appService.postUserProfile(userprofileInput).subscribe(userprofile =>{
      if(userprofile.username){
        localStorage.setItem("userId", userprofile._id);
        this.appService.loginsubject$.next(userprofile._id);
        localStorage.setItem("username", userprofile.username);
        this.router.navigate(['/dashboard']);
      }
      this.clear(); 
    });
  }

  clear() {
    this.username = "";
    this.password = "";
    this.phonenumber = "";    
  }
}

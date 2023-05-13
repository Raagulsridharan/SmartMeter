import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginValid = true;
  username: string = "";
  password: string = "";

  constructor(private router: Router, private appService: AppService) { }

  public ngOnInit(): void {
    if(localStorage.getItem("userId")){      
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    console.log("user name is " + this.username);
    this.appService.login(this.username, this.password).subscribe(userprofile =>{
          if(userprofile.username == this.username){            
            localStorage.setItem("userId", userprofile._id);
            this.router.navigate(['/dashboard']);           
            this.clear(); 
            this.appService.loginsubject$.next(userprofile._id);
          }
    })
  }

  clear() {
    this.username = "";
    this.password = "";
  }
}

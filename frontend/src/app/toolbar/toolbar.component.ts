import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { AppService } from '../app.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  userId = '';
  subscription: Subscription = new Subscription();
  constructor(private router: Router, private appService: AppService){
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {    
    this.subscription = this.appService.loginsubject$.subscribe(userid=>{
      this.userId = userid;
    });
  }
  onLogout(){
    localStorage.clear();
    this.userId = '';
    this.router.navigate(['/login']);
  }
  onHomeClick(){
    this.router.navigate(['/']);
  }
}

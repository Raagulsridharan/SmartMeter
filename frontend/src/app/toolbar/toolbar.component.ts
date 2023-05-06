import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  deviceId = localStorage.getItem("deviceId");
  constructor(private router: Router){
    
  }
  onLogout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

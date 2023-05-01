import { Component } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SmartMeter';
  
}

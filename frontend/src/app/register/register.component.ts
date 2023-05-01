import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = "";
  password: string = "";
  show: boolean = false;
  submit() {
    console.log("user name is " + this.username)
    this.clear();
  }
  clear() {
    this.username = "";
    this.password = "";
    this.show = true;
  }
}

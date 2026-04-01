import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-login',
  imports: [ReactiveFormsModule],
  templateUrl: './form-login.html',
  styleUrl: './form-login.css',
})
export class FormLogin {
  loginForm=new FormGroup({
    email:new FormControl (''),
      password: new FormControl (''),
      remember: new FormControl (false)
  })
  onSubmit() {
    console.log(this.loginForm.value);
  }
}

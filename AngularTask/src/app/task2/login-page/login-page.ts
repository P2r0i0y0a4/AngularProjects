import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, NgForm, Validators } from '@angular/forms';
import { AuthService } from '../auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports:[FormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {private fb = inject(FormBuilder); 

  // loginForm = this.fb.group({
  //   email: ['', [Validators.required, Validators.email]],
  //   password: ['', [Validators.required, Validators.minLength(6)]]
  // });

  // onSubmit() {
  //   if (this.loginForm.valid) {
  //     console.log(this.loginForm.value);
  //   }
  // }
  // Data model for the login fields
  
    email:string= ''
    password:string= ''
  

  auth = inject(AuthService)
  router = inject(Router)
  onLogin(){
    console.log(this.email , this.password);
    if(this.auth.login(this.email,this.password)) {
      this.router.navigate([''])
    }
    else{
      alert('Invalid data')
    }
  }

}
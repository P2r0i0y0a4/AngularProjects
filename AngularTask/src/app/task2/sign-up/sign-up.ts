import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  imports: [FormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  // private fb = inject(FormBuilder); // ✅ no constructor

  // signupForm = this.fb.group({
  //   name: ['', Validators.required],
  //   email: ['', [Validators.required, Validators.email]],
  //   password: ['', [Validators.required, Validators.minLength(6)]],
  //   confirmPassword: ['', Validators.required]
  // });

  // onSubmit() {
  //   if (this.signupForm.valid) {
  //     console.log(this.signupForm.value);
  //   }
  // }
  // signup(){
  //   console.log(this.signupForm);
    
  // }
  user = {
    name: '',
    email: '',
    password: ''
  };
myform: any;

auth = inject(AuthService)
router = inject(Router)


  onSubmit(myform: any) {
    console.log(this.user);
    this.auth.signup(this.user)
    alert('Sign up Succesfully done');
    this.router.navigate(['login'])
  }
}

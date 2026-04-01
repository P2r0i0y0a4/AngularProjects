import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-demo',
  imports: [ReactiveFormsModule],
  templateUrl: './demo.html',
  styleUrl: './demo.css',
})
export class Demo {
  loginData;

  constructor(private fb: FormBuilder) {
    this.loginData = this.fb.group({
      name: [''],
      email: [''],
    });
  }

  login(){
    console.log(this.loginData.value);
    
  }
}

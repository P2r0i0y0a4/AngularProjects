import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-application',
  imports: [FormsModule],
  templateUrl: './job-application.html',
  styleUrl: './job-application.css',
})
export class JobApplication {
  emp:{
    name:string,
    email:string,
    role:string,
    experience:string
  } = {

    name:'',
    email:'',
    role:'',
    experience:''
  }
}

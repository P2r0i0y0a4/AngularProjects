import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-application-form',
  imports: [FormsModule],
  templateUrl: './job-application-form.html',
  styleUrl: './job-application-form.css',
})
export class JobApplicationForm {
  skills : string[]= [];

  handleSubmit(form:any){
    console.log(form);
    console.log(form.value);
    console.log(this.skills); 
    
    
  }
  handleSkill(event:any,skill:string){
    if(event.target.checked){
      this.skills.push(skill)
    }
    else{
      this.skills=this.skills.filter((s)=>s!==skill)
    }
    console.log(event);
    
  }
}

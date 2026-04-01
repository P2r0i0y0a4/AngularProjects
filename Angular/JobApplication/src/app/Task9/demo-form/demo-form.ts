import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-demo-form',
  imports: [FormsModule],
  templateUrl: './demo-form.html',
  styleUrl: './demo-form.css',
})
export class DemoForm {
  handleSubmit(form:any){
    console.log(form);
    console.log(form.value);
    
    
  }
}

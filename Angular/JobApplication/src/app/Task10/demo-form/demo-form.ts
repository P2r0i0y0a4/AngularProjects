import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-demo-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './demo-form.html',
  styleUrl: './demo-form.css',
})
export class DemoForms {

  handleSubmit(form:any){

    console.log("Form Data:");
    console.log(form.value);

    alert("Message Sent Successfully!");

    form.reset();

  }

}

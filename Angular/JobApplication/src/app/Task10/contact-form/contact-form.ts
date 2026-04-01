import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  imports: [FormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})
export class ContactForm {
   handleSubmit(form:any){

    console.log("Form Data:");
    console.log(form.value);

    alert("Message Sent Successfully!");

    form.reset();
   }
}

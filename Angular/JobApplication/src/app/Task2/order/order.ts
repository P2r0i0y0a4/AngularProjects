import { Component } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { NgStyle } from '@angular/common';
@Component({
  selector: 'app-order',
  imports: [FormsModule, NgStyle],
  templateUrl: './order.html',
  styleUrl: './order.css',
})
export class Order {
  name : string = ''
  orderStatus :  string = ''
  isSubmitted : boolean = true
  handleSubmit(){
    this.isSubmitted = true
  }
}

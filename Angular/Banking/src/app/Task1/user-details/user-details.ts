import { Component } from '@angular/core';
import { Gallary } from "../../gallary/gallary";
import { Cart } from "../../cart/cart";

@Component({
  selector: 'app-user-details',
  imports: [Gallary, Cart],
  templateUrl: './user-details.html',
  styleUrl: './user-details.css',
})
export class UserDetails {
  Username:string = "Priya"
  Email:string = "Priya@gmail.com"
  password:string = "12345"
  gender:string = "female"
}

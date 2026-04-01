import { Component } from '@angular/core';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  img = "https://m.media-amazon.com/images/I/71M0yTboIeL._AC_SL1500_.jpg"
  productName = "Saneen Digital Camera, 4k Cameras for Photography"
  productPrice = "₹ 13,844.95"
  qty = 1
  increment(){
    this.qty++;
  }
}

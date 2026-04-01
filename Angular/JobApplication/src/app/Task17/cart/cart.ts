import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../services/cart-service';
import { productTypes } from '../../Types/product-types';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit{
  cartService = inject(CartService)

  products:productTypes[]=[]

  ngOnInit(): void {
    this.products = this.cartService.getProductItem()
  }

  addItem(product: productTypes) {
  this.cartService.addProductItem(product);
  this.products = this.cartService.getProductItem();
}

decreaseItem(id: number) {
  this.cartService.decreaseQuantity(id);
  this.products = this.cartService.getProductItem();
}

removeItem(id: number) {
  this.cartService.removeProductItem(id);
  this.products = this.cartService.getProductItem();
}



  
}

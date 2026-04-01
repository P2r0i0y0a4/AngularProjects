import { Injectable } from '@angular/core';
import { productTypes } from '../Types/product-types';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  productItems: productTypes[] = [];

  // addProductItem(product: productTypes) {
  //   const existing = this.productItems.find((item) => item.id === product.id);

  //   if (existing) {
  //     this.productItems = this.productItems.filter((item) => item.id !== product.id);
  //   } else {
  //     this.productItems.push(product);
  //   }
  // }
  addProductItem(product: productTypes) {
    const existing = this.productItems.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity! += 1;
    } else {
      this.productItems.push({ ...product, quantity: 1 });
    }   
  }

  decreaseQuantity(id: number) {

  const item = this.productItems.find(p => p.id === id);

  if (item && item.quantity! > 1) {
    item.quantity!--;
  }
}


  getProductItem() {
    return this.productItems;
  }
  removeProductItem(id: number) {
    this.productItems = this.productItems.filter((item) => item.id !== id);
  }

  // removeProductItem(id: number) {
  //   const item = this.productItems.find((p) => p.id === id);

  //   if (item && item.quantity! > 1) {
  //     item.quantity!--;
  //   } else {
  //     this.productItems = this.productItems.filter((p) => p.id !== id);
  //   }
  // }
}

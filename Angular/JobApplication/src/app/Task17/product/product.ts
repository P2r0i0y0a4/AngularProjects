import { Component, inject } from '@angular/core';
import { productTypes } from '../../Types/product-types';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-product',
  imports: [],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product {
  items:productTypes[]=[
   {id:1,name:"HeadPhones",price:1000,img:"https://tse4.mm.bing.net/th/id/OIP.kRYXjXOBqbKzImrpGX_c1AHaE7?rs=1&pid=ImgDetMain&o=7&rm=3"} ,
   {id:2,name:"Laptops",price:200000,img:"https://th.bing.com/th/id/OIP.-AQjjBayjUkLvTnREAeqGgHaE8?w=276&h=184&c=7&r=0&o=7&pid=1.7&rm=3"} ,
   {id:3,name:"Tablet",price:40000,img:"https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"} ,
   {id:4,name:"watch",price:3600,img:"https://th.bing.com/th/id/OIP.zsN51K7tm8tqClh8cmm5XQHaFJ?w=199&h=180&c=7&r=0&o=7&pid=1.7&rm=3&w=300&h=190"},
  ]


  cartService = inject(CartService)

  AddToCart(cart:productTypes){
    this.cartService.addProductItem(cart);
  }
}

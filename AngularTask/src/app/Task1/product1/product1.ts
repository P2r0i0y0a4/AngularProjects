import { ChangeDetectorRef, Component, inject, OnInit, Signal } from '@angular/core';
import { productTypes } from '../../Types/product-types';
import { ProductService } from '../../services/product-service';
import { productDataType } from '../../Types/productDataType';

@Component({
  selector: 'app-product1',
  imports: [],
  templateUrl: './product1.html',
  styleUrl: './product1.css',
})
export class Product1 implements OnInit{
  items: productTypes[] = [
  {
    id: 1,
    name: "HeadPhones",
    price: 1000,
    img: "https://tse4.mm.bing.net/th/id/OIP.kRYXjXOBqbKzImrpGX_c1AHaE7?rs=1&pid=ImgDetMain&o=7&rm=3"
  },
  {
    id: 2,
    name: "Laptops",
    price: 200000,
    img: "https://th.bing.com/th/id/OIP.-AQjjBayjUkLvTnREAeqGgHaE8?w=276&h=184&c=7&r=0&o=7&pid=1.7&rm=3"
  },
  {
    id: 3,
    name: "Tablet",
    price: 40000,
    img: "https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg"
  },
  {
    id: 4,
    name: "Watch",
    price: 3600,
    img: "https://th.bing.com/th/id/OIP.zsN51K7tm8tqClh8cmm5XQHaFJ"
  }
];
  cartService: any;
AddToCart(cart: productTypes){
  this.cartService.addProductItem(cart);
}




//for observables example
productServices = inject(ProductService)
cd=inject(ChangeDetectorRef)
products:productDataType[]=[];

ngOnInit(): void {
  this.productServices.getdata().subscribe({
    next:(data)=>{
      console.log(data); 
      this.products=data;  
      this.cd.detectChanges()  
    },
    error:(error)=>{
      console.log(error);
      
    }
  })
}
}

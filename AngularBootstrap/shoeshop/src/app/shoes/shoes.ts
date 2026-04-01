import { Component } from '@angular/core';

@Component({
  selector: 'app-shoes',
  imports: [],
  templateUrl: './shoes.html',
  styleUrl: './shoes.css',
})
export class Shoes {
  img1 = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff';
  img2 = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30';
  img3 = 'https://images.unsplash.com/photo-1584917865442-de89df76afd3';

  addToCart() {
    alert("Product is added to cart");
  }
}

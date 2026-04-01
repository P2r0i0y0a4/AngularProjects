import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { productDataType } from '../Types/productDataType';
import { postProductType } from '../Types/postProductType';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  http: HttpClient = inject(HttpClient);

  getdata() {
    return this.http.get<productDataType[]>('https://fakestoreapi.com/products');
  }
  postdata(product: postProductType) {
    return this.http.post<productDataType>(
      'https://fakestoreapi.com/products',
      product
    );
  }
}

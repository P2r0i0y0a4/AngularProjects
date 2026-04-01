import { Routes } from '@angular/router';
import { Home } from './Task19/home/home';
import { About } from './Task19/about/about';
import { Product1 } from './Task19/product1/product1';
import { Contact } from './Task19/contact/contact';
import { Cart } from './Task17/cart/cart';
import { AddProduct } from './Task20/add-product/add-product';

export const routes: Routes = [
    {path:'',component:Home},
    {path:'about',component:About},
    {path:'product',component:Product1,children:[{path:'cart',component:Cart}]},
    {path:'contact',component:Contact},
    {path:'add-product', component:AddProduct}
];

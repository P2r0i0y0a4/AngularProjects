import { Routes } from '@angular/router';
import { LoginPage } from './task2/login-page/login-page';
import { SignUp } from './task2/sign-up/sign-up';
import { Home } from './Task1/home/home';
import { Product1 } from './Task1/product1/product1';
import { About } from './Task1/about/about';
import { Contact } from './Task1/contact/contact';

export const routes: Routes = [
    {path:'',component:Home},
    {path:'about',component:About},
    {path:'product',component:Product1},
    {path:'contact',component:Contact},
    {path:'add-product', component:Product1},
    {path:'sign',component:SignUp},
    { path:'login' , component:LoginPage }
];

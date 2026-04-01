import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar-component/navbar-component';
import { MainpageComponent } from './mainpage/mainpage-component/mainpage-component';
import { SidebarComponent } from './sidebar/sidebar-component/sidebar-component';
import { SignUp } from './task2/sign-up/sign-up';
import { LoginPage } from "./task2/login-page/login-page";
import { Home } from './Task1/home/home';
import { About } from './Task1/about/about';
import { Contact } from './Task1/contact/contact';
import { Navbar } from './Task1/navbar/navbar';
import { Product1 } from './Task1/product1/product1';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, MainpageComponent, SidebarComponent, SignUp, LoginPage,Home,About,Contact,Navbar,Product1],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('AngularTask');
}

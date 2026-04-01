import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JobApplication } from "./job-application/job-application";
import { Task1 } from "./task1/task1";
import { StudentList } from "./student-list/student-list";
import { RoleBasedDashboard } from "./role-based-dashboard/role-based-dashboard";
import { Signal } from "./signal/signal";
import { Order } from './Task2/order/order';
import { CandidateList } from './Task3/candidate-list/candidate-list';
import { Dataflow } from './Task4/dataflow/dataflow';
import { Task5 } from "./task5/task5";
import { AccountDetails } from "./Task6/account-details/account-details";
import { Sample } from "./Task7/sample/sample";
import { JobApplicationForm } from './Task8/job-application-form/job-application-form';
import { DemoForm } from "./Task9/demo-form/demo-form";
import { DemoForms } from "./Task10/demo-form/demo-form";
import { ContactForm } from "./Task10/contact-form/contact-form";
import { JobForm } from './Task11/job-form/job-form';
import { LoginForm } from "./Task12/login-form/login-form";
import { FormLogin } from "./Task12/form-login/form-login";
import { ReactiveForm } from "./Task12/reactive-form/reactive-form";
import { RegistrationForm } from './Task13/registration-form/registration-form';
import { NewLoginForm } from './Task13/new-login-form/new-login-form';
import { Demo } from './Task14/demo/demo';
import { Lifecycle } from './task16/lifecycle/lifecycle';
import { LifecycleParent } from './task16/lifecycle-parent/lifecycle-parent';
import { Product } from './Task17/product/product';
import { Cart } from './Task17/cart/cart';
import { Parent } from './Task18/parent/parent';
import { Child } from './Task18/child/child';
import { Navbar } from "./Task19/navbar/navbar";
import { StreamData } from './Task20/stream-data/stream-data';
import { Product1 } from './Task19/product1/product1';
import { AddProduct } from "./Task20/add-product/add-product";
// import { Product } from './Task19/product/product';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, JobApplication, Task1, StudentList, RoleBasedDashboard, Signal, Order, CandidateList, Dataflow, Task5, AccountDetails, Sample, JobApplicationForm, DemoForm, ContactForm, JobForm, LoginForm, FormLogin, ReactiveForm, RegistrationForm, NewLoginForm, Demo, LifecycleParent, Cart, Product, Parent, Child, Navbar, StreamData, Product1, AddProduct],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('JobApplication');
}

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExampleComponent } from "./example-component/example-component";
import { Example2Component } from "./example2-component/example2-component";
import { Example3Component } from "./example3-component/example3-component";
import { UserDetails } from "./Task1/user-details/user-details";
import { Cart } from "./cart/cart";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ExampleComponent, Example2Component, Example3Component, UserDetails, Cart],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Banking');
}

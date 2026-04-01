import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Shoes } from './shoes/shoes';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Shoes],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('shoeshop');
}

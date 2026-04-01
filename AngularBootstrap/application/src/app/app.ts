import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Landingpage } from './landingpage/landingpage';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Landingpage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('application');
}

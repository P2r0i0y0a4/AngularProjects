import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Bmw } from "./bmw/bmw";
import { BmwCard } from "./bmw-card/bmw-card";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Bmw, BmwCard],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Car');
}

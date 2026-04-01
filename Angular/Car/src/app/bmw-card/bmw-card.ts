import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bmw-card',
  imports: [],
  templateUrl: './bmw-card.html',
  styleUrl: './bmw-card.css',
})
export class BmwCard {
  @Input()
  car!: {
    name: string;
    series: string;
    power: string;
    fuel: string;
    year: number;
    price: number;
    status: string;
    image: string;
  };
}

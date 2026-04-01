import { Component } from '@angular/core';
import { BmwCard } from '../bmw-card/bmw-card';

@Component({
  selector: 'app-bmw',
  imports: [BmwCard],
  templateUrl: './bmw.html',
  styleUrl: './bmw.css',
})
export class Bmw {
   carsDetails = [
    {
      name: "BMW M4 Competition",
      series: "M SERIES",
      power: "503 HP",
      fuel: "Gasoline",
      year: 2024,
      price: 78100,
      status: "IN STOCK",
      image: "m4.webp"
    },

    {
      name: "BMW i7 xDrive60",
      series: "7 SERIES",
      power: "536 HP",
      fuel: "Electric",
      year: 2024,
      price: 105700,
      status: "RESERVED",
      image: "i7.avif"
    },

    {
      name: "BMW X5 M60i",
      series: "X SERIES",
      power: "523 HP",
      fuel: "Hybrid",
      year: 2025,
      price: 89300,
      status: "IN STOCK",
      image: "M60.jpg"
    }
  ];
}

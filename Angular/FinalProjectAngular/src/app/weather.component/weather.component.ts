import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripService } from '../services/trip.services';
import { Trip, WeatherInfo } from '../models/trip.model';
import { WeatherService } from '../services/weather.services';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather.component.html'
})
export class WeatherComponent {
  private tripSvc = inject(TripService);
  private weatherSvc = inject(WeatherService);

  trips = this.tripSvc.trips;
  selectedWeather = signal<WeatherInfo | null>(null);
  selectedCity = signal<string>('');
  loading = signal<boolean>(false);

  loadWeather(trip: Trip) {
    this.loading.set(true);
    this.selectedCity.set(trip.destination);
    
    this.weatherSvc.getWeather(trip.destination).subscribe({
      next: (data) => {
        this.selectedWeather.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Weather load failed', err);
        this.loading.set(false);
      }
    });
  }
}
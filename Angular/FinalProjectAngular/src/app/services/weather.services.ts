// import { Injectable, signal } from '@angular/core';
// import { WeatherInfo } from '../models/trip.model';

// @Injectable({ providedIn: 'root' })
// export class WeatherService {
//   // You can replace this mock data with an actual API call to OpenWeatherMap later
//   getWeather(city: string): WeatherInfo {
//     return {
//       temp: '24°C',
//       desc: 'Partly Cloudy',
//       forecast: [
//         { day: 'Mon', ico: '🌤️', h: '26', l: '18' },
//         { day: 'Tue', ico: '🌧️', h: '22', l: '16' },
//         { day: 'Wed', ico: '☀️', h: '28', l: '20' }
//       ],
//       humidity: '65%',
//       wind: '12 km/h',
//       uv: 'Moderate',
//       visibility: '10 km'
//     };
//   }
// }
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { WeatherInfo } from '../models/trip.model';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private http = inject(HttpClient);
  private apiKey = 'YOUR_OPENWEATHER_API_KEY'; // Replace with your real key
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  getWeather(city: string): Observable<WeatherInfo> {
    // Fetching current weather and 5-day forecast
    return this.http.get<any>(`${this.baseUrl}/forecast?q=${city}&units=metric&appid=${this.apiKey}`).pipe(
      map(res => {
        const current = res.list[0];
        
        // Transform API data to match your WeatherInfo interface
        return {
          temp: `${Math.round(current.main.temp)}°C`,
          desc: current.weather[0].description,
          humidity: `${current.main.humidity}%`,
          wind: `${current.wind.speed} km/h`,
          uv: 'Low', // UV requires a separate API call in OpenWeather
          visibility: `${(current.visibility / 1000).toFixed(1)} km`,
          forecast: this.parseForecast(res.list)
        };
      })
    );
  }

  private parseForecast(list: any[]) {
    // Get one reading per day (every 8th slot in the 3-hour forecast)
    return list.filter((_, i) => i % 8 === 0).slice(0, 3).map(f => ({
      day: new Date(f.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
      ico: this.mapIcon(f.weather[0].main),
      h: Math.round(f.main.temp_max).toString(),
      l: Math.round(f.main.temp_min).toString()
    }));
  }

  private mapIcon(condition: string): string {
    const icons: any = { 'Clear': '☀️', 'Clouds': '☁️', 'Rain': '🌧️', 'Snow': '❄️' };
    return icons[condition] || '⛅';
  }
}
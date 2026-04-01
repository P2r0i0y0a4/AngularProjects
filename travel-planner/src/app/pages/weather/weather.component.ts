import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface WeatherData {
  city: string;
  country: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
  uv: number;
  visibility: number;
  forecast: ForecastDay[];
}

interface ForecastDay {
  day: string;
  high: number;
  low: number;
  icon: string;
  condition: string;
  rainChance: number;
}

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-6xl mx-auto animate-fade-in">
      <div class="mb-8">
        <h1 class="font-display text-4xl font-bold text-white mb-1">Weather ☁️</h1>
        <p class="text-slate-400">Check weather forecasts for your destinations</p>
      </div>

      <!-- Search -->
      <div class="glass rounded-2xl p-5 mb-6">
        <div class="flex gap-3 flex-wrap">
          <div class="relative flex-1 min-w-48">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
            <input type="text" [(ngModel)]="searchCity" placeholder="Search city..."
                   class="input-field w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                   (keydown.enter)="searchWeather()">
          </div>
          <button (click)="searchWeather()" class="btn-primary px-6 py-3 rounded-xl text-sm font-semibold">
            Search
          </button>
        </div>

        <!-- Quick cities -->
        <div class="flex flex-wrap gap-2 mt-4">
          @for (city of popularCities; track city) {
            <button (click)="loadCity(city)" class="btn-secondary px-3 py-1.5 rounded-lg text-xs font-medium">{{ city }}</button>
          }
        </div>
      </div>

      @if (loading()) {
        <div class="glass rounded-2xl p-16 text-center">
          <div class="w-12 h-12 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-slate-400">Fetching weather data...</p>
        </div>
      } @else if (weather()) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main weather card -->
          <div class="lg:col-span-2">
            <div class="rounded-2xl p-6 relative overflow-hidden" [class]="getWeatherBg(weather()!.condition)">
              <div class="absolute inset-0 opacity-10 bg-gradient-to-br from-white to-transparent"></div>
              <div class="relative z-10">
                <div class="flex items-start justify-between mb-6">
                  <div>
                    <h2 class="font-display text-2xl font-bold text-white">{{ weather()!.city }}</h2>
                    <p class="text-white/70">{{ weather()!.country }}</p>
                    <p class="text-white/60 text-sm mt-1">{{ currentDate() }}</p>
                  </div>
                  <div class="text-6xl">{{ weather()!.icon }}</div>
                </div>
                <div class="flex items-end gap-4 mb-4">
                  <div class="text-7xl font-display font-bold text-white">{{ weather()!.temp }}°</div>
                  <div class="pb-2">
                    <p class="text-white/80 text-lg font-medium">{{ weather()!.condition }}</p>
                    <p class="text-white/60 text-sm">Feels like {{ weather()!.feelsLike }}°C</p>
                  </div>
                </div>
                <div class="grid grid-cols-4 gap-3 mt-4">
                  @for (stat of getWeatherStats(); track stat.label) {
                    <div class="bg-white/10 rounded-xl p-3 text-center">
                      <div class="text-lg mb-1">{{ stat.icon }}</div>
                      <p class="text-white font-semibold text-sm">{{ stat.value }}</p>
                      <p class="text-white/60 text-xs">{{ stat.label }}</p>
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- 7-day forecast -->
            <div class="glass rounded-2xl p-5 mt-4">
              <h3 class="font-semibold text-white mb-4">7-Day Forecast</h3>
              <div class="grid grid-cols-7 gap-2">
                @for (day of weather()!.forecast; track day.day) {
                  <div class="text-center p-2 rounded-xl hover:bg-white/5 transition-colors cursor-default">
                    <p class="text-slate-400 text-xs mb-2">{{ day.day }}</p>
                    <div class="text-2xl mb-2">{{ day.icon }}</div>
                    <p class="text-white text-xs font-semibold">{{ day.high }}°</p>
                    <p class="text-slate-500 text-xs">{{ day.low }}°</p>
                    @if (day.rainChance > 0) {
                      <p class="text-sky-400 text-xs mt-1">{{ day.rainChance }}%💧</p>
                    }
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Right sidebar -->
          <div class="space-y-4">
            <!-- Travel suitability -->
            <div class="glass rounded-2xl p-5">
              <h3 class="font-semibold text-white mb-4">Travel Suitability</h3>
              @for (item of getTravelSuitability(); track item.label) {
                <div class="mb-3">
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-slate-400">{{ item.label }}</span>
                    <span [class]="item.color + ' font-medium'">{{ item.score }}/10</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width.%]="item.score * 10" [class]="item.barColor"></div>
                  </div>
                </div>
              }
            </div>

            <!-- Packing suggestions -->
            <div class="glass rounded-2xl p-5">
              <h3 class="font-semibold text-white mb-3">What to Pack 🎒</h3>
              <div class="space-y-2">
                @for (item of getPackingSuggestions(); track item) {
                  <div class="flex items-center gap-2 text-sm text-slate-300">
                    <span class="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0"></span>
                    {{ item }}
                  </div>
                }
              </div>
            </div>

            <!-- UV Index -->
            <div class="glass rounded-2xl p-5">
              <h3 class="font-semibold text-white mb-3">UV Index</h3>
              <div class="text-4xl font-display font-bold mb-2" [class]="getUVColor()">{{ weather()!.uv }}</div>
              <p class="text-sm font-medium mb-2" [class]="getUVColor()">{{ getUVLabel() }}</p>
              <div class="h-3 rounded-full overflow-hidden" style="background: linear-gradient(to right, #22c55e, #eab308, #f97316, #ef4444, #7c3aed)">
                <div class="h-full w-1.5 bg-white rounded-full transition-all" [style.margin-left.%]="(weather()!.uv / 11) * 100"></div>
              </div>
              <p class="text-slate-400 text-xs mt-2">{{ getUVAdvice() }}</p>
            </div>
          </div>
        </div>
      } @else {
        <!-- Empty state -->
        <div class="glass rounded-2xl p-16 text-center">
          <div class="text-6xl mb-4 animate-float">⛅</div>
          <h2 class="font-display text-2xl font-bold text-white mb-3">Search a Destination</h2>
          <p class="text-slate-400 mb-6">Enter a city to check the weather forecast</p>
          <div class="flex flex-wrap justify-center gap-2">
            @for (city of popularCities.slice(0,4); track city) {
              <button (click)="loadCity(city)" class="btn-primary px-5 py-2 rounded-xl text-sm">{{ city }}</button>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class WeatherComponent {
  searchCity = '';
  loading = signal(false);
  weather = signal<WeatherData | null>(null);

  popularCities = ['Tokyo', 'Paris', 'Bali', 'New York', 'Dubai', 'London', 'Sydney', 'Rome'];

  currentDate() {
    return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }

  searchWeather() {
    if (!this.searchCity.trim()) return;
    this.loadCity(this.searchCity.trim());
  }

  loadCity(city: string) {
    this.loading.set(true);
    this.searchCity = city;
    setTimeout(() => {
      this.weather.set(this.generateWeatherData(city));
      this.loading.set(false);
    }, 800);
  }

  private generateWeatherData(city: string): WeatherData {
    const cityData: Record<string, Partial<WeatherData>> = {
      'Tokyo': { temp: 18, condition: 'Partly Cloudy', icon: '⛅', country: 'Japan', uv: 4 },
      'Paris': { temp: 14, condition: 'Overcast', icon: '☁️', country: 'France', uv: 3 },
      'Bali': { temp: 30, condition: 'Sunny', icon: '☀️', country: 'Indonesia', uv: 9 },
      'New York': { temp: 12, condition: 'Clear', icon: '🌤️', country: 'USA', uv: 5 },
      'Dubai': { temp: 35, condition: 'Sunny', icon: '☀️', country: 'UAE', uv: 11 },
      'London': { temp: 10, condition: 'Rainy', icon: '🌧️', country: 'UK', uv: 2 },
      'Sydney': { temp: 22, condition: 'Sunny', icon: '☀️', country: 'Australia', uv: 7 },
      'Rome': { temp: 20, condition: 'Partly Cloudy', icon: '⛅', country: 'Italy', uv: 6 },
    };
    const base = cityData[city] || { temp: 20, condition: 'Clear', icon: '🌤️', country: 'Unknown', uv: 5 };
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const icons = ['☀️', '⛅', '🌤️', '🌧️', '⛈️', '🌦️', '☁️'];
    const conditions = ['Sunny', 'Partly Cloudy', 'Clear', 'Rainy', 'Thunderstorm', 'Light Rain', 'Overcast'];
    return {
      city,
      country: base.country || 'Unknown',
      temp: base.temp || 20,
      feelsLike: (base.temp || 20) - 2,
      humidity: 55 + Math.floor(Math.random() * 30),
      windSpeed: 10 + Math.floor(Math.random() * 20),
      condition: base.condition || 'Clear',
      icon: base.icon || '🌤️',
      uv: base.uv || 5,
      visibility: 10 + Math.floor(Math.random() * 5),
      forecast: days.map((day, i) => ({
        day,
        high: (base.temp || 20) + Math.floor(Math.random() * 6) - 2,
        low: (base.temp || 20) - 5 - Math.floor(Math.random() * 4),
        icon: icons[i % icons.length],
        condition: conditions[i % conditions.length],
        rainChance: Math.random() > 0.6 ? Math.floor(Math.random() * 80) + 10 : 0,
      })),
    };
  }

  getWeatherBg(condition: string): string {
    if (condition.toLowerCase().includes('sun') || condition === 'Clear') return 'bg-gradient-to-br from-amber-600/80 to-orange-500/60';
    if (condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('thunder')) return 'bg-gradient-to-br from-slate-700/80 to-slate-600/60';
    return 'bg-gradient-to-br from-sky-700/80 to-blue-600/60';
  }

  getWeatherStats() {
    const w = this.weather()!;
    return [
      { icon: '💧', value: w.humidity + '%', label: 'Humidity' },
      { icon: '💨', value: w.windSpeed + ' km/h', label: 'Wind' },
      { icon: '👁️', value: w.visibility + ' km', label: 'Visibility' },
      { icon: '☀️', value: 'UV ' + w.uv, label: 'UV Index' },
    ];
  }

  getTravelSuitability() {
    const w = this.weather()!;
    const tempScore = w.temp >= 18 && w.temp <= 28 ? 9 : w.temp >= 10 ? 6 : 3;
    const rainScore = w.condition.toLowerCase().includes('rain') ? 3 : w.condition.toLowerCase().includes('cloud') ? 7 : 9;
    const windScore = w.windSpeed < 20 ? 9 : w.windSpeed < 35 ? 6 : 3;
    return [
      { label: 'Outdoor Activities', score: Math.round((tempScore + rainScore) / 2), color: 'text-sky-400', barColor: '' },
      { label: 'Photography', score: rainScore > 5 ? 8 : 4, color: 'text-emerald-400', barColor: 'bg-emerald-500' },
      { label: 'Beach/Outdoor', score: tempScore, color: 'text-amber-400', barColor: 'bg-amber-500' },
      { label: 'Overall Score', score: Math.round((tempScore + rainScore + windScore) / 3), color: 'text-purple-400', barColor: 'bg-purple-500' },
    ];
  }

  getPackingSuggestions(): string[] {
    const w = this.weather()!;
    const suggestions: string[] = [];
    if (w.temp < 15) { suggestions.push('Warm jacket', 'Layers', 'Scarf & gloves'); }
    else if (w.temp > 25) { suggestions.push('Light clothing', 'Sunscreen SPF 50+', 'Sunglasses', 'Hat'); }
    else { suggestions.push('Light layers', 'Comfortable shoes'); }
    if (w.condition.toLowerCase().includes('rain')) { suggestions.push('Umbrella', 'Waterproof jacket', 'Waterproof bag'); }
    if (w.uv > 6) suggestions.push('High-SPF sunscreen');
    suggestions.push('Water bottle', 'First aid kit');
    return suggestions.slice(0, 6);
  }

  getUVColor(): string {
    const uv = this.weather()!.uv;
    if (uv <= 2) return 'text-emerald-400';
    if (uv <= 5) return 'text-yellow-400';
    if (uv <= 7) return 'text-orange-400';
    if (uv <= 10) return 'text-red-400';
    return 'text-purple-400';
  }

  getUVLabel(): string {
    const uv = this.weather()!.uv;
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Moderate';
    if (uv <= 7) return 'High';
    if (uv <= 10) return 'Very High';
    return 'Extreme';
  }

  getUVAdvice(): string {
    const uv = this.weather()!.uv;
    if (uv <= 2) return 'No protection needed for most people.';
    if (uv <= 5) return 'Some protection needed. Wear sunscreen.';
    if (uv <= 7) return 'Protection needed. Seek shade midday.';
    if (uv <= 10) return 'Extra protection needed. Avoid midday sun.';
    return 'Take all precautions. Avoid sun exposure.';
  }
}

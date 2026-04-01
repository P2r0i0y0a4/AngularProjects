import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TripService } from '../../../core/services/trip.service';
import { CompareRow, WeatherData } from '../../../core/models/trip.model';

// ══════════════════════════════════════════
// WEATHER COMPONENT
// ══════════════════════════════════════════
@Component({
  selector: 'app-weather',
  imports: [CommonModule, FormsModule],
  templateUrl: './weather.component.html',
  styleUrl: './weather-compare.css'
})
export class Weather {
  tripService  = inject(TripService);
  searchQuery  = '';
  selectedDest = signal(this.tripService.trips()[0]?.destination || 'Paris, France');

  weather = computed((): WeatherData =>
    this.tripService.getWeatherForDestination(this.selectedDest())
  );

  activeTripDateRange = computed(() => {
    const trip = this.tripService.trips().find(t => t.destination === this.selectedDest());
    if (!trip) return 'Select a trip above';
    const s = new Date(trip.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    const e = new Date(trip.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
    return s + ' – ' + e;
  });

  weatherDetails = computed(() => [
    { ico: '💧', val: this.weather().humidity,   label: 'Humidity'   },
    { ico: '💨', val: this.weather().wind,       label: 'Wind Speed' },
    { ico: '☀️', val: this.weather().uv,         label: 'UV Index'   },
    { ico: '👁',  val: this.weather().visibility, label: 'Visibility' }
  ]);
}

// ══════════════════════════════════════════
// COMPARE COMPONENT
// ══════════════════════════════════════════
@Component({
  selector: 'app-compare',
  imports: [CommonModule],
  templateUrl: './compare.component.html',
  styleUrl: './weather-compare.css'
})
export class Compare {
  svc     = inject(TripService);
  tripAId = signal(this.svc.trips()[0]?.id || '');
  tripBId = signal(this.svc.trips()[1]?.id || '');
  tripA   = computed(() => this.svc.getTripById(this.tripAId()));
  tripB   = computed(() => this.svc.getTripById(this.tripBId()));

  compareRows = computed((): CompareRow[] => {
    const a = this.tripA(), b = this.tripB();
    if (!a || !b || a.id === b.id) return [];
    const daysA  = this.svc.getDayCount(a),  daysB  = this.svc.getDayCount(b);
    const spentA = this.svc.getBudgetSummary(a).spent, spentB = this.svc.getBudgetSummary(b).spent;
    const actsA  = a.days.reduce((s, d) => s + d.activities.length, 0);
    const actsB  = b.days.reduce((s, d) => s + d.activities.length, 0);
    const pdA    = daysA ? Math.round(a.budget / daysA) : 0;
    const pdB    = daysB ? Math.round(b.budget / daysB) : 0;
    return [
      { icon: '📍', label: 'Destination',        valA: a.destination,                        valB: b.destination,                        winA: false,            winB: false            },
      { icon: '📅', label: 'Duration',           valA: daysA + 'd',                          valB: daysB + 'd',                          winA: daysA > daysB,    winB: daysB > daysA    },
      { icon: '💰', label: 'Total Budget',       valA: a.currency + a.budget.toLocaleString(),valB: b.currency + b.budget.toLocaleString(),winA: a.budget > b.budget,winB: b.budget > a.budget },
      { icon: '💸', label: 'Amount Spent',       valA: a.currency + spentA.toLocaleString(), valB: b.currency + spentB.toLocaleString(), winA: spentA < spentB,  winB: spentB < spentA  },
      { icon: '📊', label: 'Budget / Day',       valA: a.currency + pdA.toLocaleString(),    valB: b.currency + pdB.toLocaleString(),    winA: pdA < pdB,        winB: pdB < pdA        },
      { icon: '🎯', label: 'Activities Planned', valA: actsA,                                valB: actsB,                                winA: actsA > actsB,    winB: actsB > actsA    },
      { icon: '🧭', label: 'Trip Type',          valA: a.type,                               valB: b.type,                               winA: false,            winB: false            },
      { icon: '🔖', label: 'Status',             valA: a.status,                             valB: b.status,                             winA: false,            winB: false            },
      { icon: '👥', label: 'Companions',         valA: a.companions,                         valB: b.companions,                         winA: false,            winB: false            }
    ];
  });

  getVal(e: Event): string {
    return (e.target as HTMLSelectElement).value;
  }
}

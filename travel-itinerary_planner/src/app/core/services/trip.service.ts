import { Injectable, signal, computed, effect } from '@angular/core';
import { Trip, TripDay, Activity, TripFormData, PackingItem, BudgetSummary, WeatherData } from '../models/trip.model';

@Injectable({ providedIn: 'root' })
export class TripService {

  private _trips = signal<Trip[]>(this.getMockTrips());

  trips          = this._trips.asReadonly();
  totalTrips     = computed(() => this._trips().length);
  upcomingTrips  = computed(() => this._trips().filter(t => t.status === 'upcoming'));
  completedTrips = computed(() => this._trips().filter(t => t.status === 'completed'));

  constructor() {
    effect(() => {
      localStorage.setItem('wanderplan_trips', JSON.stringify(this._trips()));
    });
  }

  getTrips(): Trip[] {
    return this._trips();
  }

  getTripById(id: string): Trip | undefined {
    return this._trips().find(t => t.id === id);
  }

  getTripsByStatus(status: string): Trip[] {
    return status === 'all' ? this._trips() : this._trips().filter(t => t.status === status);
  }

  createTrip(data: TripFormData): Trip {
    const newTrip: Trip = {
      id:           'trip_' + Date.now(),
      title:        data.title,
      destination:  data.destination,
      startDate:    data.startDate,
      endDate:      data.endDate,
      budget:       data.budget,
      currency:     data.currency,
      status:       'upcoming',
      spent:        0,
      type:         data.type,
      companions:   data.companions,
      moods:        data.moods,
      coverImage:   this.resolveCover(data.destination),
      days:         this.buildDays(data.startDate, data.endDate),
      packingLists: {
        Essentials: [
          { id: 'e1', label: 'Passport',          done: false, priority: 'high' },
          { id: 'e2', label: 'Travel insurance',  done: false, priority: 'high' }
        ],
        Clothing: [
          { id: 'c1', label: 'Comfortable shoes', done: false, priority: 'med' }
        ]
      }
    };
    this._trips.update(trips => [newTrip, ...trips]);
    return newTrip;
  }

  updateTrip(id: string, changes: Partial<Trip>): void {
    this._trips.update(trips => trips.map(t => t.id === id ? { ...t, ...changes } : t));
  }

  deleteTrip(id: string): void {
    this._trips.update(trips => trips.filter(t => t.id !== id));
  }

  addActivity(tripId: string, dayId: string, act: Omit<Activity, 'id'>): void {
    this._trips.update(trips => trips.map(trip => {
      if (trip.id !== tripId) return trip;
      return {
        ...trip,
        days: trip.days.map(day => {
          if (day.id !== dayId) return day;
          const updated = [...day.activities, { ...act, id: 'act_' + Date.now() }];
          return { ...day, activities: updated.sort((a, b) => a.time.localeCompare(b.time)) };
        })
      };
    }));
  }

  toggleActivity(tripId: string, dayId: string, actId: string): void {
    this._trips.update(trips => trips.map(trip => {
      if (trip.id !== tripId) return trip;
      return {
        ...trip,
        days: trip.days.map(day => {
          if (day.id !== dayId) return day;
          return { ...day, activities: day.activities.map(a => a.id === actId ? { ...a, done: !a.done } : a) };
        })
      };
    }));
  }

  deleteActivity(tripId: string, dayId: string, actId: string): void {
    this._trips.update(trips => trips.map(trip => {
      if (trip.id !== tripId) return trip;
      return {
        ...trip,
        days: trip.days.map(day => {
          if (day.id !== dayId) return day;
          return { ...day, activities: day.activities.filter(a => a.id !== actId) };
        })
      };
    }));
  }

  togglePackingItem(tripId: string, section: string, itemId: string): void {
    this._trips.update(trips => trips.map(trip => {
      if (trip.id !== tripId) return trip;
      return {
        ...trip,
        packingLists: {
          ...trip.packingLists,
          [section]: trip.packingLists[section].map(i => i.id === itemId ? { ...i, done: !i.done } : i)
        }
      };
    }));
  }

  addPackingItem(tripId: string, section: string, item: Omit<PackingItem, 'id'>): void {
    this._trips.update(trips => trips.map(trip => {
      if (trip.id !== tripId) return trip;
      return {
        ...trip,
        packingLists: {
          ...trip.packingLists,
          [section]: [...(trip.packingLists[section] || []), { ...item, id: 'pack_' + Date.now() }]
        }
      };
    }));
  }

  deletePackingItem(tripId: string, section: string, itemId: string): void {
    this._trips.update(trips => trips.map(trip => {
      if (trip.id !== tripId) return trip;
      return {
        ...trip,
        packingLists: {
          ...trip.packingLists,
          [section]: trip.packingLists[section].filter(i => i.id !== itemId)
        }
      };
    }));
  }

  getBudgetSummary(trip: Trip): BudgetSummary {
    const spent = trip.days.reduce((s, d) => s + d.activities.reduce((ss, a) => ss + a.cost, 0), 0);
    return {
      total:     trip.budget,
      spent,
      remaining: trip.budget - spent,
      percent:   trip.budget ? Math.min(Math.round((spent / trip.budget) * 100), 100) : 0
    };
  }

  getDayCount(trip: Trip): number {
    return Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / 86400000) + 1;
  }

  getDaysUntil(trip: Trip): number {
    return Math.ceil((new Date(trip.startDate).getTime() - Date.now()) / 86400000);
  }

  getCategorySpend(trip: Trip): Record<string, number> {
    const result: Record<string, number> = {};
    trip.days.forEach(d => d.activities.forEach(a => {
      result[a.category] = (result[a.category] || 0) + a.cost;
    }));
    return result;
  }

  getWeatherForDestination(dest: string): WeatherData {
    const data: Record<string, WeatherData> = {
      'Paris, France': {
        temp: '24°C', desc: 'Partly cloudy, pleasant',
        forecast: [
          { day: 'Tue', ico: '🌤', h: '22°C', l: '14°C' },
          { day: 'Wed', ico: '☀️', h: '26°C', l: '15°C' },
          { day: 'Thu', ico: '🌧', h: '18°C', l: '12°C' },
          { day: 'Fri', ico: '⛅', h: '21°C', l: '13°C' },
          { day: 'Sat', ico: '☀️', h: '28°C', l: '16°C' },
          { day: 'Sun', ico: '🌤', h: '25°C', l: '14°C' },
          { day: 'Mon', ico: '🌦', h: '20°C', l: '12°C' }
        ],
        humidity: '65%', wind: '14 km/h', uv: 'Moderate', visibility: '10 km'
      },
      'Tokyo, Japan': {
        temp: '31°C', desc: 'Hot and humid, chance of rain',
        forecast: [
          { day: 'Tue', ico: '🌩', h: '33°C', l: '26°C' },
          { day: 'Wed', ico: '🌧', h: '29°C', l: '24°C' },
          { day: 'Thu', ico: '⛅', h: '30°C', l: '25°C' },
          { day: 'Fri', ico: '☀️', h: '34°C', l: '27°C' },
          { day: 'Sat', ico: '🌤', h: '32°C', l: '26°C' },
          { day: 'Sun', ico: '🌩', h: '28°C', l: '24°C' },
          { day: 'Mon', ico: '🌧', h: '27°C', l: '23°C' }
        ],
        humidity: '82%', wind: '8 km/h', uv: 'High', visibility: '7 km'
      },
      'Bali, Indonesia': {
        temp: '29°C', desc: 'Tropical, morning showers',
        forecast: [
          { day: 'Tue', ico: '🌦', h: '30°C', l: '24°C' },
          { day: 'Wed', ico: '🌤', h: '31°C', l: '25°C' },
          { day: 'Thu', ico: '☀️', h: '33°C', l: '26°C' },
          { day: 'Fri', ico: '🌧', h: '27°C', l: '23°C' },
          { day: 'Sat', ico: '⛅', h: '29°C', l: '24°C' },
          { day: 'Sun', ico: '☀️', h: '32°C', l: '25°C' },
          { day: 'Mon', ico: '🌤', h: '30°C', l: '24°C' }
        ],
        humidity: '79%', wind: '11 km/h', uv: 'Very High', visibility: '9 km'
      }
    };
    return data[dest] ?? {
      temp: '25°C', desc: 'Weather data not available',
      forecast: Array(7).fill({ day: '?', ico: '❓', h: '–', l: '–' }),
      humidity: '–', wind: '–', uv: '–', visibility: '–'
    };
  }

  private buildDays(startDate: string, endDate: string): TripDay[] {
    const days: TripDay[] = [];
    const weathers = ['☀️ 25°C', '🌤 23°C', '⛅ 20°C', '🌧 18°C', '🌤 22°C', '☀️ 26°C', '🌦 21°C'];
    let cur = new Date(startDate), idx = 1;
    while (cur <= new Date(endDate)) {
      days.push({
        id:         'day_' + idx,
        date:       cur.toISOString().split('T')[0],
        label:      'Day ' + idx,
        weather:    weathers[idx % weathers.length],
        activities: []
      });
      cur.setDate(cur.getDate() + 1);
      idx++;
    }
    return days;
  }

  private resolveCover(destination: string): string {
    const covers: Record<string, string> = {
      paris: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800',
      tokyo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
      bali:  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800'
    };
    const key = Object.keys(covers).find(k => destination.toLowerCase().includes(k));
    return key ? covers[key] : 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800';
  }

  private getMockTrips(): Trip[] {
    return [
      {
        id: 't1', title: 'Paris Dream Escape', destination: 'Paris, France',
        startDate: '2025-06-10', endDate: '2025-06-15',
        budget: 150000, currency: '₹', status: 'upcoming', spent: 45000,
        type: '🏛️ Culture', companions: 'Partner 👫',
        moods: ['🍷 Fine dining', '📸 Photography', '📚 History'],
        coverImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800',
        packingLists: {
          Essentials: [
            { id: 'p1', label: 'Passport',         done: true,  priority: 'high' },
            { id: 'p2', label: 'Travel insurance', done: false, priority: 'high' },
            { id: 'p3', label: 'Euros cash',       done: false, priority: 'high' }
          ],
          Clothing: [
            { id: 'p4', label: 'Light jacket',             done: false, priority: 'med' },
            { id: 'p5', label: 'Comfortable walking shoes',done: false, priority: 'med' }
          ],
          Gadgets: [
            { id: 'p6', label: 'Camera + charger',  done: false, priority: 'med' },
            { id: 'p7', label: 'Universal adapter', done: true,  priority: 'high' }
          ]
        },
        days: [
          {
            id: 'd1', date: '2025-06-10', label: 'Day 1 – Arrival', weather: '🌤 22°C',
            activities: [
              { id: 'a1', time: '14:00', title: 'Check-in Hotel Lumière',   category: 'hotel',       location: 'Rue de Rivoli',          notes: 'Ask for city view',      cost: 8000, done: true  },
              { id: 'a2', time: '19:00', title: 'Dinner at Café de Flore',  category: 'food',        location: 'Saint-Germain-des-Prés', notes: 'Try crêpes suzette',     cost: 3500, done: false }
            ]
          },
          {
            id: 'd2', date: '2025-06-11', label: 'Day 2 – Eiffel & Louvre', weather: '☀️ 25°C',
            activities: [
              { id: 'a3', time: '09:00', title: 'Eiffel Tower',   category: 'sightseeing', location: 'Champ de Mars', notes: 'Book summit tickets', cost: 2800, done: false },
              { id: 'a4', time: '14:00', title: 'Louvre Museum',  category: 'sightseeing', location: 'Rue de Rivoli', notes: 'Mona Lisa wing first',cost: 1700, done: false }
            ]
          },
          { id: 'd3', date: '2025-06-12', label: 'Day 3 – Montmartre', weather: '🌥 19°C', activities: [] }
        ]
      },
      {
        id: 't2', title: 'Tokyo Neon Chronicles', destination: 'Tokyo, Japan',
        startDate: '2025-08-20', endDate: '2025-08-28',
        budget: 200000, currency: '₹', status: 'draft', spent: 0,
        type: '🎉 Celebration', companions: 'Friends 👯',
        moods: ['🎭 Nightlife', '🛍️ Shopping', '📸 Photography'],
        coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
        packingLists: {
          Essentials: [
            { id: 'q1', label: 'Passport + Japan visa', done: false, priority: 'high' },
            { id: 'q2', label: 'JR Pass',               done: false, priority: 'high' }
          ],
          Clothing: [
            { id: 'q3', label: 'Comfortable sneakers', done: false, priority: 'med' },
            { id: 'q4', label: 'Rain poncho',          done: false, priority: 'low' }
          ]
        },
        days: [
          {
            id: 'd1', date: '2025-08-20', label: 'Day 1 – Shibuya', weather: '🌩 32°C',
            activities: [
              { id: 'b1', time: '18:00', title: 'Shibuya Crossing', category: 'sightseeing', location: 'Shibuya', notes: 'Best at night',          cost: 0,    done: false },
              { id: 'b2', time: '20:00', title: 'Ramen at Ichiran', category: 'food',        location: 'Shibuya', notes: 'Solo booth experience', cost: 1200, done: false }
            ]
          }
        ]
      },
      {
        id: 't3', title: 'Bali Retreat & Wellness', destination: 'Bali, Indonesia',
        startDate: '2025-03-01', endDate: '2025-03-07',
        budget: 80000, currency: '₹', status: 'completed', spent: 76000,
        type: '💆 Wellness', companions: 'Solo 🧍',
        moods: ['🧘 Relaxation', '🌅 Sunrise walks', '🥾 Hiking'],
        coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
        packingLists: {
          Essentials: [
            { id: 'r1', label: 'Sunscreen SPF 50',    done: true, priority: 'high' },
            { id: 'r2', label: 'Mosquito repellent',  done: true, priority: 'high' }
          ]
        },
        days: []
      }
    ];
  }
}
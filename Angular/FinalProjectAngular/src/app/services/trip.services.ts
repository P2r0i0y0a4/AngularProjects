import { Injectable, signal } from '@angular/core';
import { Trip, DayPlan, Activity, PackingItem } from '../models/trip.model';

const SEED_TRIPS: Trip[] = [
  {
    id: 't1', title: 'Paris Dream Escape', destination: 'Paris, France',
    startDate: '2025-06-10', endDate: '2025-06-15', budget: 150000, currency: '₹',
    status: 'upcoming', spent: 45000, type: '🏛️ Culture', companions: 'Partner 👫',
    moods: ['🍷 Fine dining', '📸 Photography', '📚 History'],
    coverImage: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800',
    rating: 5, notes: 'Dream trip! Need to book Eiffel tickets early.',
    packingLists: {
      Essentials: [
        { id: 'p1', label: 'Passport', done: true, priority: 'high' },
        { id: 'p2', label: 'Travel insurance', done: false, priority: 'high' },
        { id: 'p3', label: 'Euros cash', done: false, priority: 'high' },
      ],
      Clothing: [
        { id: 'p4', label: 'Light jacket', done: false, priority: 'med' },
        { id: 'p5', label: 'Comfortable walking shoes', done: false, priority: 'med' },
        { id: 'p6', label: 'Formal outfit (dinner)', done: false, priority: 'low' },
      ],
      Gadgets: [
        { id: 'p7', label: 'Camera + charger', done: false, priority: 'med' },
        { id: 'p8', label: 'Universal adapter', done: true, priority: 'high' },
      ]
    },
    days: [
      {
        id: 'd1', date: '2025-06-10', label: 'Day 1 – Arrival', weather: '🌤 22°C',
        activities: [
          { id: 'a1', time: '14:00', title: 'Check-in Hotel Lumière', category: 'hotel', location: 'Rue de Rivoli', notes: 'Ask for city view room', cost: 8000, done: true },
          { id: 'a2', time: '19:00', title: 'Dinner at Café de Flore', category: 'food', location: 'Saint-Germain-des-Prés', notes: 'Try crêpes suzette', cost: 3500, done: false },
        ]
      },
      {
        id: 'd2', date: '2025-06-11', label: 'Day 2 – Eiffel & Louvre', weather: '☀️ 25°C',
        activities: [
          { id: 'a3', time: '09:00', title: 'Eiffel Tower Visit', category: 'sightseeing', location: 'Champ de Mars', notes: 'Book summit tickets', cost: 2800, done: false },
          { id: 'a4', time: '14:00', title: 'Louvre Museum', category: 'sightseeing', location: 'Rue de Rivoli', notes: 'Mona Lisa wing first', cost: 1700, done: false },
          { id: 'a5', time: '20:00', title: 'Seine River Cruise', category: 'other', location: "Pont de l'Alma", notes: 'Magical at sunset', cost: 2200, done: false },
        ]
      },
      { id: 'd3', date: '2025-06-12', label: 'Day 3 – Montmartre', weather: '🌥 19°C', activities: [] },
    ]
  },
  {
    id: 't2', title: 'Tokyo Neon Chronicles', destination: 'Tokyo, Japan',
    startDate: '2025-08-20', endDate: '2025-08-28', budget: 200000, currency: '₹',
    status: 'draft', spent: 0, type: '🎭 Culture', companions: 'Friends 👯',
    moods: ['🎭 Nightlife', '🛍️ Shopping', '📸 Photography'],
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    rating: 4, notes: 'Plan JR Pass purchase ahead.',
    packingLists: {
      Essentials: [
        { id: 'q1', label: 'Passport + Japan visa', done: false, priority: 'high' },
        { id: 'q2', label: 'JR Pass', done: false, priority: 'high' },
        { id: 'q3', label: 'Pocket WiFi reservation', done: false, priority: 'med' },
      ],
      Clothing: [
        { id: 'q4', label: 'Comfortable sneakers', done: false, priority: 'med' },
        { id: 'q5', label: 'Rain poncho', done: false, priority: 'low' },
      ]
    },
    days: [
      {
        id: 'd1', date: '2025-08-20', label: 'Day 1 – Shibuya', weather: '🌩 32°C',
        activities: [
          { id: 'b1', time: '18:00', title: 'Shibuya Crossing', category: 'sightseeing', location: 'Shibuya', notes: 'Best at night', cost: 0, done: false },
          { id: 'b2', time: '20:00', title: 'Ramen at Ichiran', category: 'food', location: 'Shibuya', notes: 'Solo booth experience', cost: 1200, done: false },
        ]
      },
      { id: 'd2', date: '2025-08-21', label: 'Day 2 – Asakusa', weather: '⛅ 30°C', activities: [] },
    ]
  },
  {
    id: 't3', title: 'Bali Retreat & Wellness', destination: 'Bali, Indonesia',
    startDate: '2025-03-01', endDate: '2025-03-07', budget: 80000, currency: '₹',
    status: 'completed', spent: 76000, type: '💆 Wellness', companions: 'Solo 🧍',
    moods: ['🧘 Relaxation', '🌅 Sunrise walks', '🥾 Hiking'],
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    rating: 5, notes: 'Perfect solo trip. Go again!',
    packingLists: {
      Essentials: [
        { id: 'r1', label: 'Sunscreen SPF 50', done: true, priority: 'high' },
        { id: 'r2', label: 'Mosquito repellent', done: true, priority: 'high' },
      ]
    },
    days: []
  }
];

@Injectable({ providedIn: 'root' })
export class TripService {

    
  private readonly KEY = 'wp_trips';
  trips = signal<Trip[]>([]);

  constructor() {
    const raw = localStorage.getItem(this.KEY);
    this.trips.set(raw ? JSON.parse(raw) : SEED_TRIPS);
  }

  private save() {
    localStorage.setItem(this.KEY, JSON.stringify(this.trips()));
  }

  addTrip(trip: Trip) {
    this.trips.update(t => [trip, ...t]);
    this.save();
  }

  updateTrip(id: string, updates: Partial<Trip>) {
    this.trips.update(ts => ts.map(t => t.id === id ? { ...t, ...updates } : t));
    this.save();
  }

  deleteTrip(id: string) {
    this.trips.update(ts => ts.filter(t => t.id !== id));
    this.save();
  }

  getTrip(id: string): Trip | undefined {
    return this.trips().find(t => t.id === id);
  }

  addActivity(tripId: string, dayId: string, activity: Activity) {
    this.trips.update(ts => ts.map(t => {
      if (t.id !== tripId) return t;
      return {
        ...t,
        days: t.days.map(d => {
          if (d.id !== dayId) return d;
          const acts = [...d.activities, activity].sort((a, b) => a.time.localeCompare(b.time));
          return { ...d, activities: acts };
        })
      };
    }));
    this.save();
  }

  toggleActivity(tripId: string, dayId: string, actId: string) {
    this.trips.update(ts => ts.map(t => {
      if (t.id !== tripId) return t;
      return {
        ...t,
        days: t.days.map(d => {
          if (d.id !== dayId) return d;
          return { ...d, activities: d.activities.map(a => a.id === actId ? { ...a, done: !a.done } : a) };
        })
      };
    }));
    this.save();
  }

  deleteActivity(tripId: string, dayId: string, actId: string) {
    this.trips.update(ts => ts.map(t => {
      if (t.id !== tripId) return t;
      return {
        ...t,
        days: t.days.map(d => {
          if (d.id !== dayId) return d;
          return { ...d, activities: d.activities.filter(a => a.id !== actId) };
        })
      };
    }));
    this.save();
  }

  togglePackItem(tripId: string, section: string, itemId: string) {
    this.trips.update(ts => ts.map(t => {
      if (t.id !== tripId) return t;
      return {
        ...t,
        packingLists: {
          ...t.packingLists,
          [section]: t.packingLists[section].map(i => i.id === itemId ? { ...i, done: !i.done } : i)
        }
      };
    }));
    this.save();
  }

  deletePackItem(tripId: string, section: string, itemId: string) {
    this.trips.update(ts => ts.map(t => {
      if (t.id !== tripId) return t;
      return {
        ...t,
        packingLists: {
          ...t.packingLists,
          [section]: t.packingLists[section].filter(i => i.id !== itemId)
        }
      };
    }));
    this.save();
  }

  addPackItem(tripId: string, section: string, value: string, item: PackingItem) {
    this.trips.update(ts => ts.map(t => {
      if (t.id !== tripId) return t;
      return {
        ...t,
        packingLists: {
          ...t.packingLists,
          [section]: [...(t.packingLists[section] || []), item]
        }
      };
    }));
    this.save();
  }

  getTotalSpent(trip: Trip): number {
    return trip.days.reduce((s, d) => s + d.activities.reduce((ss, a) => ss + a.cost, 0), 0);
  }

  getTripDays(trip: Trip): number {
    const s = new Date(trip.startDate), e = new Date(trip.endDate);
    return Math.ceil((e.getTime() - s.getTime()) / 86400000) + 1;
  }


  
}
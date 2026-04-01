import { Injectable, signal } from '@angular/core';

export interface Trip {
  id: string;
  name: string;
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  status: 'planning' | 'upcoming' | 'ongoing' | 'completed';
  coverEmoji: string;
  notes?: string;
  days: TripDay[];
  packingItems: PackingItem[];
  budgetItems: BudgetItem[];
  companions?: string[];
  rating?: number;
  weather?: string;
  createdAt: string;
}

export interface TripDay {
  id: string;
  date: string;
  activities: Activity[];
}

export interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
  type: 'transport' | 'accommodation' | 'food' | 'attraction' | 'leisure' | 'other';
  cost?: number;
  location?: string;
  completed: boolean;
}

export interface PackingItem {
  id: string;
  name: string;
  category: 'clothing' | 'toiletries' | 'documents' | 'electronics' | 'health' | 'other';
  packed: boolean;
  essential: boolean;
  quantity: number;
}

export interface BudgetItem {
  id: string;
  category: 'accommodation' | 'transport' | 'food' | 'activities' | 'shopping' | 'other';
  name: string;
  planned: number;
  actual: number;
  date?: string;
}

const STORAGE_KEY = 'wanderplan_trips';

@Injectable({ providedIn: 'root' })
export class TripService {
  trips = signal<Trip[]>([]);

  constructor() {
    this.loadTrips();
    if (this.trips().length === 0) {
      this.loadSampleData();
    }
  }

  private loadTrips(): void {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) this.trips.set(JSON.parse(data));
    } catch {}
  }

  private saveTrips(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.trips()));
  }

  private loadSampleData(): void {
    const samples: Trip[] = [
      {
        id: '1',
        name: 'Tokyo Adventure',
        destination: 'Tokyo',
        country: 'Japan',
        startDate: '2025-04-10',
        endDate: '2025-04-20',
        budget: 3000,
        currency: 'USD',
        status: 'upcoming',
        coverEmoji: '🗾',
        notes: 'Cherry blossom season trip!',
        companions: ['Alice', 'Bob'],
        rating: 5,
        weather: 'Mild, 15-20°C',
        days: [
          {
            id: 'd1',
            date: '2025-04-10',
            activities: [
              { id: 'a1', time: '09:00', title: 'Arrive at Narita Airport', description: 'Flight lands at 9am', type: 'transport', cost: 0, location: 'Narita Airport', completed: false },
              { id: 'a2', time: '12:00', title: 'Check into Hotel', description: 'Shinjuku area hotel', type: 'accommodation', cost: 150, location: 'Shinjuku', completed: false },
              { id: 'a3', time: '15:00', title: 'Explore Shinjuku', description: 'Walk around Shinjuku Gyoen', type: 'attraction', cost: 10, location: 'Shinjuku Gyoen', completed: false },
            ]
          },
          {
            id: 'd2',
            date: '2025-04-11',
            activities: [
              { id: 'a4', time: '08:00', title: 'Breakfast at Tsukiji', description: 'Fresh sushi breakfast', type: 'food', cost: 30, location: 'Tsukiji Market', completed: false },
              { id: 'a5', time: '11:00', title: 'Senso-ji Temple', description: 'Visit the famous temple in Asakusa', type: 'attraction', cost: 0, location: 'Asakusa', completed: false },
            ]
          }
        ],
        packingItems: [
          { id: 'p1', name: 'Passport', category: 'documents', packed: true, essential: true, quantity: 1 },
          { id: 'p2', name: 'JR Pass', category: 'documents', packed: false, essential: true, quantity: 1 },
          { id: 'p3', name: 'Adapter', category: 'electronics', packed: true, essential: true, quantity: 1 },
          { id: 'p4', name: 'Camera', category: 'electronics', packed: false, essential: false, quantity: 1 },
          { id: 'p5', name: 'Light jacket', category: 'clothing', packed: false, essential: true, quantity: 2 },
        ],
        budgetItems: [
          { id: 'b1', category: 'accommodation', name: 'Hotel (10 nights)', planned: 1500, actual: 1450, date: '2025-04-10' },
          { id: 'b2', category: 'transport', name: 'Flights', planned: 800, actual: 780, date: '2025-04-10' },
          { id: 'b3', category: 'food', name: 'Daily meals', planned: 400, actual: 0, date: '' },
          { id: 'b4', category: 'activities', name: 'Attractions & tours', planned: 200, actual: 0, date: '' },
          { id: 'b5', category: 'shopping', name: 'Souvenirs', planned: 100, actual: 0, date: '' },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Paris Getaway',
        destination: 'Paris',
        country: 'France',
        startDate: '2025-06-15',
        endDate: '2025-06-22',
        budget: 2500,
        currency: 'EUR',
        status: 'planning',
        coverEmoji: '🗼',
        notes: 'Romantic anniversary trip',
        companions: ['Partner'],
        rating: 4,
        weather: 'Warm, 22-26°C',
        days: [],
        packingItems: [
          { id: 'p1', name: 'Passport', category: 'documents', packed: false, essential: true, quantity: 1 },
          { id: 'p2', name: 'Travel Insurance', category: 'documents', packed: false, essential: true, quantity: 1 },
        ],
        budgetItems: [
          { id: 'b1', category: 'accommodation', name: 'Hotel', planned: 1200, actual: 0, date: '' },
          { id: 'b2', category: 'transport', name: 'Flights', planned: 700, actual: 720, date: '' },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Bali Retreat',
        destination: 'Bali',
        country: 'Indonesia',
        startDate: '2024-11-01',
        endDate: '2024-11-10',
        budget: 1800,
        currency: 'USD',
        status: 'completed',
        coverEmoji: '🌴',
        rating: 5,
        days: [],
        packingItems: [],
        budgetItems: [
          { id: 'b1', category: 'accommodation', name: 'Villa', planned: 600, actual: 580, date: '' },
          { id: 'b2', category: 'transport', name: 'Flights', planned: 600, actual: 610, date: '' },
          { id: 'b3', category: 'food', name: 'Meals', planned: 300, actual: 280, date: '' },
          { id: 'b4', category: 'activities', name: 'Tours', planned: 200, actual: 230, date: '' },
          { id: 'b5', category: 'shopping', name: 'Shopping', planned: 100, actual: 150, date: '' },
        ],
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ];
    this.trips.set(samples);
    this.saveTrips();
  }

  getTrip(id: string): Trip | undefined {
    return this.trips().find(t => t.id === id);
  }

  addTrip(trip: Omit<Trip, 'id' | 'createdAt'>): Trip {
    const newTrip: Trip = { ...trip, id: Date.now().toString(), createdAt: new Date().toISOString() };
    this.trips.update(trips => [...trips, newTrip]);
    this.saveTrips();
    return newTrip;
  }

  updateTrip(id: string, updates: Partial<Trip>): void {
    this.trips.update(trips => trips.map(t => t.id === id ? { ...t, ...updates } : t));
    this.saveTrips();
  }

  deleteTrip(id: string): void {
    this.trips.update(trips => trips.filter(t => t.id !== id));
    this.saveTrips();
  }

  addPackingItem(tripId: string, item: Omit<PackingItem, 'id'>): void {
    this.trips.update(trips => trips.map(t => {
      if (t.id !== tripId) return t;
      return { ...t, packingItems: [...t.packingItems, { ...item, id: Date.now().toString() }] };
    }));
    this.saveTrips();
  }

  togglePackingItem(tripId: string, itemId: string): void {
    this.trips.update(trips => trips.map(t => {
      if (t.id !== tripId) return t;
      return {
        ...t,
        packingItems: t.packingItems.map(i => i.id === itemId ? { ...i, packed: !i.packed } : i)
      };
    }));
    this.saveTrips();
  }

  addBudgetItem(tripId: string, item: Omit<BudgetItem, 'id'>): void {
    this.trips.update(trips => trips.map(t => {
      if (t.id !== tripId) return t;
      return { ...t, budgetItems: [...t.budgetItems, { ...item, id: Date.now().toString() }] };
    }));
    this.saveTrips();
  }

  addActivity(tripId: string, dayId: string, activity: Omit<Activity, 'id'>): void {
    this.trips.update(trips => trips.map(t => {
      if (t.id !== tripId) return t;
      const days = t.days.map(d => {
        if (d.id !== dayId) return d;
        return { ...d, activities: [...d.activities, { ...activity, id: Date.now().toString() }] };
      });
      return { ...t, days };
    }));
    this.saveTrips();
  }

  addDay(tripId: string, date: string): void {
    this.trips.update(trips => trips.map(t => {
      if (t.id !== tripId) return t;
      const newDay: TripDay = { id: Date.now().toString(), date, activities: [] };
      return { ...t, days: [...t.days, newDay].sort((a, b) => a.date.localeCompare(b.date)) };
    }));
    this.saveTrips();
  }
}

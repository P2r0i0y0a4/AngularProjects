export interface Activity {
  id: string;
  time: string;
  title: string;
  category: 'flight' | 'hotel' | 'food' | 'sightseeing' | 'transport' | 'shopping' | 'other';
  location: string;
  notes?: string;
  cost: number;
  done: boolean;
}

export interface DayPlan {
  id: string;
  date: string;
  label: string;
  weather?: string;
  activities: Activity[];
}

export interface PackingItem {
  id: string;
  label: string;
  done: boolean;
  priority: 'high' | 'med' | 'low';
}

export interface PackingLists {
  [section: string]: PackingItem[];
}

export type TripStatus = 'upcoming' | 'ongoing' | 'completed' | 'draft';

export interface Trip {
  packing: any;
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  status: TripStatus;
  spent: number;
  type: string;
  companions: string;
  moods: string[];
  coverImage: string;
  packingLists: PackingLists;
  days: DayPlan[];
  rating?: number;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  createdAt: string;
}

export interface WeatherInfo {
  temp: string;
  desc: string;
  forecast: { day: string; ico: string; h: string; l: string }[];
  humidity: string;
  wind: string;
  uv: string;
  visibility: string;
}
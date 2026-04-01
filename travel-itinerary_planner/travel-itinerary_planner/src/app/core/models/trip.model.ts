export type TripStatus       = 'upcoming' | 'ongoing' | 'completed' | 'draft';
export type ActivityCategory = 'flight' | 'hotel' | 'food' | 'sightseeing' | 'transport' | 'shopping' | 'other';
export type Priority         = 'high' | 'med' | 'low';

export interface Trip {
  id:           string;
  title:        string;
  destination:  string;
  startDate:    string;
  endDate:      string;
  budget:       number;
  currency:     string;
  status:       TripStatus;
  spent:        number;
  type:         string;
  companions:   string;
  moods:        string[];
  coverImage:   string;
  days:         TripDay[];
  packingLists: PackingLists;
}

export interface TripDay {
  id:         string;
  date:       string;
  label:      string;
  weather:    string;
  activities: Activity[];
}

export interface Activity {
  id:       string;
  time:     string;
  title:    string;
  category: ActivityCategory;
  location: string;
  notes:    string;
  cost:     number;
  done:     boolean;
}

export interface PackingItem {
  id:       string;
  label:    string;
  done:     boolean;
  priority: Priority;
}

export type PackingLists = Record<string, PackingItem[]>;

export interface TripFormData {
  title:       string;
  destination: string;
  startDate:   string;
  endDate:     string;
  budget:      number;
  currency:    string;
  type:        string;
  companions:  string;
  moods:       string[];
}

export interface BudgetSummary {
  total:     number;
  spent:     number;
  remaining: number;
  percent:   number;
}

export interface WeatherDay {
  day: string;
  ico: string;
  h:   string;
  l:   string;
}

export interface WeatherData {
  temp:       string;
  desc:       string;
  forecast:   WeatherDay[];
  humidity:   string;
  wind:       string;
  uv:         string;
  visibility: string;
}

export interface CompareRow {
  icon:  string;
  label: string;
  valA:  string | number;
  valB:  string | number;
  winA:  boolean;
  winB:  boolean;
}
import { Routes } from '@angular/router';
import { TripPlanner } from './features/trip-planner/trip.planner.component/trip.planner.component';
import { Dashboard } from './features/dashboard/dashboard.component/dashboard.component';
import { Itinerary } from './features/itinerary/itinerary.component/itinerary.component';
import { Compare, Weather } from './features/weather-compare/weather-compare/weather-compare';

export const routes: Routes = [
  { path: '',           component: Dashboard   },
  { path: 'trips/new',  component: TripPlanner },
  { path: 'trips/:id',  component: Itinerary   },
  { path: 'weather',    component: Weather     },
  { path: 'compare',    component: Compare     },
  { path: '**',         redirectTo: ''         }
];
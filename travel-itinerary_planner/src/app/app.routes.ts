import { Routes } from '@angular/router';

import { Dashboard } from './features/dashboard/dashboard.component/dashboard.component';
import { TripPlanner } from './features/trip-planner/trip.planner.component/trip.planner.component';
import { Itinerary } from './features/itinerary/itinerary.component/itinerary.component';
import { Compare, WeatherCompareComponent } from './features/weather-compare/weather.compare.component/weather.compare.component';

export const routes: Routes = [
  { path: '',          component: Dashboard  },
  { path: 'trips/new', component: TripPlanner  },
  { path: 'trips/:id', component: Itinerary  },
  { path: 'weather',   component: WeatherCompareComponent },
  { path: 'compare',   component: Compare },
  { path: '**',  redirectTo: '' }
];
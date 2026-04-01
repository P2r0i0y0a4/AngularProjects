import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { TripService } from './core/services/trip.service';
import { Dashboard } from './features/dashboard/dashboard.component/dashboard.component';
import { TripPlanner } from './features/trip-planner/trip.planner.component/trip.planner.component';
import { Compare, WeatherCompareComponent } from './features/weather-compare/weather.compare.component/weather.compare.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // Only import what is used directly in THIS template
  imports: [RouterOutlet, RouterLink, RouterLinkActive,Dashboard,TripPlanner,WeatherCompareComponent,Compare],
  template: `
    <nav class="navbar">
      <div class="nav-inner">
        <a routerLink="/" class="nav-logo"> <span class="logo-dot"></span>WanderPlan </a>
        <div class="nav-links">
          <a
            routerLink="/"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            class="nav-link"
            >My Trips</a
          >
          <a routerLink="/trips/new" routerLinkActive="active" class="nav-link">Plan Trip</a>
          <a routerLink="/weather" routerLinkActive="active" class="nav-link">Weather</a>
          <a routerLink="/compare" routerLinkActive="active" class="nav-link">Compare</a>
        </div>
        <div class="nav-right">

          @if (tripService.upcomingTrips().length > 0) {
            <span class="upcoming-pill">✈️ {{ tripService.upcomingTrips().length }} upcoming</span>
          }
          <a routerLink="/trips/new" class="nav-cta">+ New Trip</a>
        </div>
      </div>
    </nav>
    <main>
      <router-outlet />
    </main>
  `,
  styles: [
    `
      /* ... your existing styles ... */
      .logo-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #d4a017;
        display: inline-block;
      }
      .nav-cta {
        background: #d4a017;
        color: #fff;
        text-decoration: none;
        padding: 9px 20px;
        border-radius: 30px;
        font-size: 13.5px;
        font-weight: 600;
      }
    `,
  ],
})
export class AppComponent {
  tripService = inject(TripService);
}

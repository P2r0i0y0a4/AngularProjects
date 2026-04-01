import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { TripService } from './core/services/trip.service';
import { Dashboard } from './features/dashboard/dashboard.component/dashboard.component';
import { Weather } from './features/weather-compare/weather-compare/weather-compare';
import { TripPlanner } from './features/trip-planner/trip.planner.component/trip.planner.component';
import { Itinerary } from './features/itinerary/itinerary.component/itinerary.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive,Dashboard,Weather,TripPlanner,Itinerary],
  template: `
    <nav class="navbar">
      <div class="nav-inner">
        <a routerLink="/" class="nav-logo">
          <span class="logo-dot"></span>WanderPlan
        </a>
        <div class="nav-links">
          <a routerLink="/"          routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="nav-link">My Trips</a>
          <a routerLink="/trips/new" routerLinkActive="active" class="nav-link">Plan Trip</a>
          <a routerLink="/weather"   routerLinkActive="active" class="nav-link">Weather</a>
          <a routerLink="/compare"   routerLinkActive="active" class="nav-link">Compare</a>
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
  styles: [`
    * { box-sizing: border-box; }
    .navbar { background:#16120e; height:62px; display:flex; align-items:center; position:sticky; top:0; z-index:300; }
    .nav-inner { max-width:1200px; margin:0 auto; padding:0 1.5rem; display:flex; align-items:center; justify-content:space-between; width:100%; gap:1rem; }
    .nav-logo { font-family:'Cormorant Garamond',serif; font-size:1.3rem; font-weight:700; color:#f7f2ea; text-decoration:none; display:flex; align-items:center; gap:8px; }
    .logo-dot { width:8px; height:8px; border-radius:50%; background:#d4581a; display:inline-block; }
    .nav-links { display:flex; gap:4px; }
    .nav-link { color:rgba(247,242,234,.55); text-decoration:none; padding:8px 15px; border-radius:30px; font-size:13.5px; font-weight:500; transition:all .2s; }
    .nav-link:hover { color:#f7f2ea; background:rgba(255,255,255,.08); }
    .nav-link.active { color:#f7f2ea; background:rgba(255,255,255,.13); }
    .nav-right { display:flex; align-items:center; gap:10px; }
    .upcoming-pill { background:rgba(212,88,26,.25); color:#f7a87a; border:1px solid rgba(212,88,26,.3); padding:5px 13px; border-radius:30px; font-size:12.5px; }
    .nav-cta { background:#d4581a; color:#fff; text-decoration:none; padding:9px 20px; border-radius:30px; font-size:13.5px; font-weight:600; transition:all .2s; }
    .nav-cta:hover { background:#bc4c14; }
    main { min-height:calc(100vh - 62px); background:#f7f2ea; }
  `]
})
export class App {
  tripService = inject(TripService);
}
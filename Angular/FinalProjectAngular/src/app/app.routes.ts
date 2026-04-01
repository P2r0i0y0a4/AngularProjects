import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './login.component/login.component';
import { SignupComponent } from './signup.component/signup.component';
import { DashboardComponent } from './dashboard.component/dashboard.component';
import { PlannerComponent } from './planner.component/planner.component';
import { ItineraryComponent } from './itinerary.component/itinerary.component';
import { WeatherComponent } from './weather.component/weather.component';
import { CompareComponent } from './compare.component/compare.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component:LoginComponent},
  { path: 'signup', component:SignupComponent },
  { path: 'dashboard', canActivate: [authGuard],component:DashboardComponent },
  { path: 'planner', canActivate: [authGuard],component:PlannerComponent},
  { path: 'itinerary/:id', canActivate: [authGuard], component:ItineraryComponent },
  { path: 'weather', canActivate: [authGuard],component:WeatherComponent },
  { path: 'compare', canActivate: [authGuard], component:CompareComponent},
  { path: '**', redirectTo: 'login' }
];
import { Component, computed, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../services/auth.services';
import { TripService } from '../services/trip.services';
import { Trip } from '../models/trip.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink,FormsModule,CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  searchQ = '';
  viewMode: 'grid' | 'list' = 'grid';
  activeFilter: string = 'all';
  deleteId = '';

  filters = [
    { value: 'all', label: 'All' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
    { value: 'draft', label: 'Draft' },
  ];

  userName = computed(() => this.auth.currentUser()?.name?.split(' ')[0] || 'Explorer');

  upcomingTrips = computed(() =>
    this.tripSvc.trips().filter(t => t.status === 'upcoming').slice(0, 3)
  );

  upcomingCount = computed(() =>
    this.tripSvc.trips().filter(t => t.status === 'upcoming').length
  );

  kpis = computed(() => [
    { value: this.tripSvc.trips().length, label: 'Total Trips' },
    { value: this.tripSvc.trips().filter(t => t.status === 'upcoming').length, label: 'Upcoming' },
    { value: this.tripSvc.trips().filter(t => t.status === 'completed').length, label: 'Completed' },
  ]);

  filteredTrips = computed(() => {
    const q = this.searchQ.toLowerCase();
    return this.tripSvc.trips().filter(t => {
      const fm = this.activeFilter === 'all' || t.status === this.activeFilter;
      const sm = !q || t.title.toLowerCase().includes(q) || t.destination.toLowerCase().includes(q);
      return fm && sm;
    });
  });

  constructor(private auth: AuthService, private tripSvc: TripService, private router: Router) {}

  daysUntil(date: string): string | number {
    const d = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
    return d < 0 ? 'Now' : d;
  }

  fmtRange(s: string, e: string): string {
    const fmt = (d: string) => new Date(d).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    return `${fmt(s)} – ${fmt(e)}`;
  }

  tripDays(t: Trip): number { return this.tripSvc.getTripDays(t); }

  spentOf(t: Trip): number { return this.tripSvc.getTotalSpent(t); }

  pct(t: Trip): number {
    return t.budget ? Math.min(Math.round((this.spentOf(t) / t.budget) * 100), 100) : 0;
  }

  openItin(id: string) { this.router.navigate(['/itinerary', id]); }

  goWeather() { this.router.navigate(['/weather']); }

  promptDelete(id: string) { this.deleteId = id; }

  confirmDelete() {
    this.tripSvc.deleteTrip(this.deleteId);
    this.deleteId = '';
  }
}
import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TripService } from '../../../core/services/trip.service';
import { Trip } from '../../../core/models/trip.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, FormsModule, DatePipe, DecimalPipe, TitleCasePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class Dashboard {
  tripService    = inject(TripService);
  activeFilter   = signal<string>('all');
  viewMode       = signal<'grid' | 'list'>('grid');
  deleteTargetId = signal<string | null>(null);
  searchQuery    = '';

  filterTabs = [
    { label: 'All',       value: 'all'       },
    { label: 'Upcoming',  value: 'upcoming'  },
    { label: 'Ongoing',   value: 'ongoing'   },
    { label: 'Completed', value: 'completed' },
    { label: 'Draft',     value: 'draft'     }
  ];

  filteredTrips = computed(() => {
    const q = this.searchQuery.toLowerCase();
    return this.tripService.trips().filter(t => {
      const matchStatus = this.activeFilter() === 'all' || t.status === this.activeFilter();
      const matchSearch = !q || t.title.toLowerCase().includes(q) || t.destination.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  });

  kpis = computed(() => [
    { label: 'Total Trips',  value: this.tripService.totalTrips()           },
    { label: 'Upcoming',     value: this.tripService.upcomingTrips().length  },
    { label: 'Completed',    value: this.tripService.completedTrips().length }
  ]);

  getBudgetPct(trip: Trip): number {
    return trip.budget ? Math.min(Math.round((trip.spent / trip.budget) * 100), 100) : 0;
  }

  getCount(status: string): number {
    return status === 'all'
      ? this.tripService.trips().length
      : this.tripService.trips().filter(t => t.status === status).length;
  }

  onDelete(id: string): void {
    this.deleteTargetId.set(id);
  }

  confirmDelete(): void {
    if (this.deleteTargetId()) {
      this.tripService.deleteTrip(this.deleteTargetId()!);
      this.deleteTargetId.set(null);
    }
  }
}

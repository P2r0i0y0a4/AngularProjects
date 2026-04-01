import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripService } from '../services/trip.services';
import { Trip } from '../models/trip.model';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compare.component.html'
})
export class CompareComponent {
  private tripSvc = inject(TripService);

  // Get all trips from the signal
  trips = this.tripSvc.trips;

  // Calculate global stats
  stats = computed(() => {
    const allTrips = this.trips();
    const totalBudget = allTrips.reduce((sum, t) => sum + (t.budget || 0), 0);
    const totalSpent = allTrips.reduce((sum, t) => {
      // Calculate spent from activities if 'spent' property isn't manually updated
      const activityTotal = t.days?.reduce((dSum, day) => 
        dSum + day.activities.reduce((aSum, act) => aSum + (act.cost || 0), 0), 0) || 0;
      return sum + Math.max(t.spent || 0, activityTotal);
    }, 0);

    return {
      totalBudget,
      totalSpent,
      avgRating: allTrips.filter(t => t.rating).reduce((sum, t) => sum + (t.rating || 0), 0) / (allTrips.filter(t => t.rating).length || 1),
      tripCount: allTrips.length
    };
  });
Math: any;

  getStatusColor(status: string): string {
    const colors: any = { 
      completed: 'bg-green-100 text-green-700', 
      ongoing: 'bg-blue-100 text-blue-700', 
      upcoming: 'bg-stone-100 text-stone-700',
      draft: 'bg-amber-100 text-amber-700' 
    };
    return colors[status] || 'bg-gray-100';
  }
}
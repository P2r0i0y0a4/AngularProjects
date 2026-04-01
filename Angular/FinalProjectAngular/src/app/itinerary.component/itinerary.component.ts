import { Component, computed, signal, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TripService } from '../services/trip.services';
import { Activity, Trip } from '../models/trip.model';

@Component({
  selector: 'app-itinerary',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './itinerary.component.html'
})
export class ItineraryComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private tripSvc = inject(TripService);

  // --- Component State ---
  tripId = '';
  activeFeatTab: 'timeline' | 'budget' | 'packing' = 'timeline';
  activeDayIdx = 0;
  showAddForm = false;
  Math = Math; // Needed for Math.abs in template

  featTabs: { id: 'timeline' | 'budget' | 'packing', label: string, icon: string }[] = [
    { id: 'timeline', label: 'Timeline', icon: '🗓️' },
    { id: 'budget', label: 'Budget', icon: '💰' },
    { id: 'packing', label: 'Packing', icon: '🎒' }
  ];

  // Activity Form Object
  af: Partial<Activity> = {
    time: '09:00',
    category: 'sightseeing',
    cost: 0,
    title: '',
    location: '',
    notes: '',
    done: false
  };

  ngOnInit() {
    this.tripId = this.route.snapshot.params['id'];
  }

  // --- Computed Signals ---
  trip = computed(() => this.tripSvc.trips().find(t => t.id === this.tripId));

  activeDay = computed(() => {
    const t = this.trip();
    return t && t.days ? t.days[this.activeDayIdx] : null;
  });

  totalSpent = computed(() => {
    const t = this.trip();
    if (!t) return 0;
    return t.days.reduce((total, day) => 
      total + day.activities.reduce((sum, act) => sum + (act.cost || 0), 0), 0);
  });

  remaining = computed(() => (this.trip()?.budget || 0) - this.totalSpent());

  budgetPct = computed(() => {
    const budget = this.trip()?.budget || 1; // Avoid division by zero
    return Math.round((this.totalSpent() / budget) * 100);
  });

  // --- Budget Breakdown Logic ---
  catBreakdown = computed(() => {
    const t = this.trip();
    if (!t) return [];
    const map: Record<string, number> = {};
    t.days.forEach(d => d.activities.forEach(a => {
      map[a.category] = (map[a.category] || 0) + (a.cost || 0);
    }));
    const total = this.totalSpent() || 1;
    return Object.entries(map).map(([cat, amt]) => ({
      cat,
      amt,
      pct: Math.round((amt / total) * 100)
    }));
  });

  // --- Packing Logic ---
  packingEntries = computed(() => {
    const t = this.trip();
    if (!t || !t.packing) return [];
    return Object.entries(t.packing).map(([section, items]) => {
      const done = items.filter(i => i.done).length;
      return {
        section,
        items,
        done,
        pct: Math.round((done / (items.length || 1)) * 100)
      };
    });
  });

  // --- Helper Methods ---
  fmtDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  fmtRange() {
    const t = this.trip();
    if (!t) return '';
    return `${this.fmtDate(t.startDate)} - ${this.fmtDate(t.endDate)}`;
  }

  catColor(cat: string): string {
    const colors: Record<string, string> = {
      sightseeing: '#1a6b9e', food: '#d4581a', hotel: '#b8861b',
      flight: '#2d7a50', transport: '#6b5ebd', shopping: '#bd5e91'
    };
    return colors[cat] || '#888';
  }

  catIcon(cat: string): string {
    const icons: Record<string, string> = {
      sightseeing: '🏛️', food: '🍽️', hotel: '🏨',
      flight: '✈️', transport: '🚌', shopping: '🛍️'
    };
    return icons[cat] || '📌';
  }

  // --- Actions ---
  addActivity() {
    const day = this.activeDay();
    if (day && this.af.title) {
      const newAct = { ...this.af, id: crypto.randomUUID() } as Activity;
      this.tripSvc.addActivity(this.tripId, day.id, newAct);
      this.showAddForm = false;
      this.af.title = ''; // Reset
    }
  }

  toggleAct(actId: string) {
    const day = this.activeDay();
    if (day) this.tripSvc.toggleActivity(this.tripId, day.id, actId);
  }

  delAct(actId: string) {
    const day = this.activeDay();
    if (day && confirm('Delete activity?')) {
      this.tripSvc.deleteActivity(this.tripId, day.id, actId);
    }
  }

  togglePack(section: string, itemId: string) {
    this.tripSvc.togglePackItem(this.tripId, section, itemId);
  }

  addPackItem(section: string) {
    const inp = document.getElementById(`pack-inp-${section}`) as HTMLInputElement;
    const pri = document.getElementById(`pack-pri-${section}`) as HTMLSelectElement;
    if (inp.value) {
      this.tripSvc.addPackItem(this.tripId, section, inp.value, pri.value as any);
      inp.value = '';
    }
  }

  delPack(section: string, itemId: string) {
    this.tripSvc.deletePackItem(this.tripId, section, itemId);
  }
}

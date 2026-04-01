import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TripService, Trip } from '../../services/trip.service';

@Component({
  selector: 'app-trip-compare',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-6xl mx-auto animate-fade-in">
      <div class="mb-8">
        <h1 class="font-display text-4xl font-bold text-white mb-1">Compare Trips ⚖️</h1>
        <p class="text-slate-400">Compare your trips side by side</p>
      </div>

      <!-- Selectors -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        @for (slot of [0,1]; track slot) {
          <div class="glass rounded-2xl p-5">
            <h3 class="font-semibold text-slate-300 mb-3">Trip {{ slot + 1 }}</h3>
            <div class="space-y-2">
              @for (trip of trips.trips(); track trip.id) {
                <button (click)="selectTrip(slot, trip)"
                        class="w-full text-left px-4 py-3 rounded-xl text-sm flex items-center gap-3 transition-all"
                        [class]="getSelectedTrip(slot)?.id === trip.id ? 'bg-sky-500/20 border border-sky-500/30 text-white' : 'glass hover:bg-white/5 text-slate-300'">
                  <span class="text-xl">{{ trip.coverEmoji }}</span>
                  <div>
                    <p class="font-medium">{{ trip.name }}</p>
                    <p class="text-slate-500 text-xs">{{ trip.destination }} · {{ formatDate(trip.startDate) }}</p>
                  </div>
                  @if (getSelectedTrip(slot)?.id === trip.id) {
                    <span class="ml-auto text-sky-400">✓</span>
                  }
                </button>
              }
            </div>
          </div>
        }
      </div>

      @if (tripA() && tripB()) {
        <!-- Compare table -->
        <div class="glass rounded-2xl overflow-hidden mb-6 animate-slide-up">
          <div class="grid grid-cols-3 bg-white/5">
            <div class="p-4 border-r border-white/5 text-slate-400 text-sm font-semibold">Criteria</div>
            <div class="p-4 border-r border-white/5 text-center">
              <div class="text-2xl mb-1">{{ tripA()!.coverEmoji }}</div>
              <p class="text-white font-semibold text-sm">{{ tripA()!.name }}</p>
              <span class="badge" [class]="getStatusBadge(tripA()!.status)">{{ tripA()!.status }}</span>
            </div>
            <div class="p-4 text-center">
              <div class="text-2xl mb-1">{{ tripB()!.coverEmoji }}</div>
              <p class="text-white font-semibold text-sm">{{ tripB()!.name }}</p>
              <span class="badge" [class]="getStatusBadge(tripB()!.status)">{{ tripB()!.status }}</span>
            </div>
          </div>

          @for (row of compareRows(); track row.label) {
            <div class="grid grid-cols-3 border-t border-white/5 hover:bg-white/2 transition-colors">
              <div class="p-4 border-r border-white/5">
                <p class="text-slate-400 text-sm flex items-center gap-2">{{ row.icon }} {{ row.label }}</p>
              </div>
              <div class="p-4 border-r border-white/5 text-center">
                <p class="text-white text-sm font-medium" [class]="row.winnerA ? 'text-emerald-400 font-bold' : ''">{{ row.valueA }}</p>
                @if (row.winnerA) { <span class="text-xs text-emerald-400">🏆 Better</span> }
              </div>
              <div class="p-4 text-center">
                <p class="text-white text-sm font-medium" [class]="row.winnerB ? 'text-emerald-400 font-bold' : ''">{{ row.valueB }}</p>
                @if (row.winnerB) { <span class="text-xs text-emerald-400">🏆 Better</span> }
              </div>
            </div>
          }
        </div>

        <!-- Visual budget comparison -->
        <div class="glass rounded-2xl p-5 mb-6">
          <h3 class="font-semibold text-white mb-5">Budget Comparison</h3>
          <div class="space-y-5">
            @for (cat of budgetCompare(); track cat.name) {
              <div>
                <div class="flex justify-between text-xs text-slate-400 mb-2">
                  <span>{{ cat.icon }} {{ cat.name }}</span>
                  <span>{{ tripA()!.currency }} {{ cat.a }} vs {{ cat.b }}</span>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div class="text-right text-xs text-sky-400 mb-1">{{ tripA()!.name }}</div>
                  <div class="text-xs text-emerald-400 mb-1">{{ tripB()!.name }}</div>
                  <div class="progress-bar">
                    <div class="h-full bg-sky-500 rounded-full transition-all" [style.width.%]="getBarWidth(cat.a, cat.a, cat.b)"></div>
                  </div>
                  <div class="progress-bar">
                    <div class="h-full bg-emerald-500 rounded-full transition-all" [style.width.%]="getBarWidth(cat.b, cat.a, cat.b)"></div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Rating comparison -->
        <div class="grid grid-cols-2 gap-5">
          @for (trip of [tripA()!, tripB()!]; track trip.id) {
            <div class="glass rounded-2xl p-5 text-center">
              <div class="text-4xl mb-2">{{ trip.coverEmoji }}</div>
              <h3 class="font-bold text-white mb-1">{{ trip.name }}</h3>
              <p class="text-slate-400 text-sm mb-3">{{ trip.destination }}, {{ trip.country }}</p>
              <div class="flex justify-center gap-1 mb-3">
                @for (s of [1,2,3,4,5]; track s) {
                  <span class="text-xl" [class]="s <= (trip.rating || 0) ? 'text-yellow-400' : 'text-slate-700'">★</span>
                }
              </div>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div class="glass rounded-xl p-2">
                  <p class="text-slate-400 text-xs">Duration</p>
                  <p class="text-white font-semibold">{{ getDuration(trip) }}d</p>
                </div>
                <div class="glass rounded-xl p-2">
                  <p class="text-slate-400 text-xs">Activities</p>
                  <p class="text-white font-semibold">{{ getTotalActivities(trip) }}</p>
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="glass rounded-2xl p-16 text-center">
          <div class="text-5xl mb-4">⚖️</div>
          <h2 class="font-display text-2xl font-bold text-white mb-3">Select Two Trips</h2>
          <p class="text-slate-400">Choose two trips above to compare them side by side</p>
        </div>
      }
    </div>
  `
})
export class TripCompareComponent {
  trips = inject(TripService);
  tripAId = signal<string | null>(null);
  tripBId = signal<string | null>(null);

  tripA = () => this.trips.trips().find(t => t.id === this.tripAId()) || null;
  tripB = () => this.trips.trips().find(t => t.id === this.tripBId()) || null;

  getSelectedTrip(slot: number) { return slot === 0 ? this.tripA() : this.tripB(); }

  selectTrip(slot: number, trip: Trip) {
    if (slot === 0) this.tripAId.set(trip.id);
    else this.tripBId.set(trip.id);
  }

  getDuration(trip: Trip) { return Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / 86400000) + 1; }
  getTotalActivities(trip: Trip) { return trip.days.reduce((s, d) => s + d.activities.length, 0); }
  getBudgetSpent(trip: Trip) { return trip.budgetItems.reduce((s, i) => s + i.actual, 0); }

  compareRows = () => {
    const a = this.tripA()!;
    const b = this.tripB()!;
    return [
      { icon: '📍', label: 'Destination', valueA: a.destination, valueB: b.destination, winnerA: false, winnerB: false },
      { icon: '📅', label: 'Start Date', valueA: this.formatDate(a.startDate), valueB: this.formatDate(b.startDate), winnerA: false, winnerB: false },
      { icon: '⏱️', label: 'Duration', valueA: this.getDuration(a) + ' days', valueB: this.getDuration(b) + ' days', winnerA: this.getDuration(a) > this.getDuration(b), winnerB: this.getDuration(b) > this.getDuration(a) },
      { icon: '💰', label: 'Total Budget', valueA: a.currency + ' ' + a.budget.toLocaleString(), valueB: b.currency + ' ' + b.budget.toLocaleString(), winnerA: a.budget < b.budget, winnerB: b.budget < a.budget },
      { icon: '🧳', label: 'Packing Items', valueA: a.packingItems.length + ' items', valueB: b.packingItems.length + ' items', winnerA: false, winnerB: false },
      { icon: '📊', label: 'Activities', valueA: this.getTotalActivities(a) + '', valueB: this.getTotalActivities(b) + '', winnerA: this.getTotalActivities(a) > this.getTotalActivities(b), winnerB: this.getTotalActivities(b) > this.getTotalActivities(a) },
      { icon: '⭐', label: 'Rating', valueA: (a.rating || 0) + '/5 ★', valueB: (b.rating || 0) + '/5 ★', winnerA: (a.rating || 0) > (b.rating || 0), winnerB: (b.rating || 0) > (a.rating || 0) },
      { icon: '📝', label: 'Notes', valueA: a.notes ? '✓ Yes' : '—', valueB: b.notes ? '✓ Yes' : '—', winnerA: false, winnerB: false },
    ];
  };

  budgetCompare = () => {
    const a = this.tripA()!;
    const b = this.tripB()!;
    const cats = ['accommodation', 'transport', 'food', 'activities', 'shopping'];
    const icons: Record<string, string> = { accommodation: '🏨', transport: '✈️', food: '🍽️', activities: '🎯', shopping: '🛍️' };
    return cats.map(cat => ({
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      icon: icons[cat],
      a: a.budgetItems.filter(i => i.category === cat).reduce((s, i) => s + i.planned, 0),
      b: b.budgetItems.filter(i => i.category === cat).reduce((s, i) => s + i.planned, 0),
    })).filter(c => c.a > 0 || c.b > 0);
  };

  getBarWidth(val: number, a: number, b: number) {
    const max = Math.max(a, b, 1);
    return (val / max) * 100;
  }

  formatDate(d: string) { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }

  getStatusBadge(status: string) {
    const m: Record<string, string> = { planning: 'badge-warning', upcoming: 'badge-primary', ongoing: 'badge-success', completed: 'bg-purple-500/15 text-purple-400 border border-purple-500/30' };
    return m[status] || 'badge-primary';
  }
}

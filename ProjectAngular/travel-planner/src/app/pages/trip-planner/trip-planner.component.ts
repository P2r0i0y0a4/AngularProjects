import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { TripService, Trip } from '../../services/trip.service';

@Component({
  selector: 'app-trip-planner',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="p-6 max-w-7xl mx-auto animate-fade-in">
      <div class="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 class="font-display text-4xl font-bold text-white mb-1">Trip Planner</h1>
          <p class="text-slate-400">Create and manage your travel itineraries</p>
        </div>
        <button (click)="showNewTripModal.set(true)" class="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
          <span>➕</span> New Trip
        </button>
      </div>

      @if (!selectedTrip()) {
        @if (trips.trips().length === 0) {
          <div class="glass rounded-2xl p-16 text-center">
            <div class="text-6xl mb-4 animate-float">✈️</div>
            <h2 class="font-display text-2xl font-bold text-white mb-3">No Trips Yet</h2>
            <p class="text-slate-400 mb-6">Start planning your first adventure!</p>
            <button (click)="showNewTripModal.set(true)" class="btn-primary px-8 py-3 rounded-xl font-semibold">Plan My Trip</button>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            @for (trip of trips.trips(); track trip.id) {
              <div class="glass rounded-2xl overflow-hidden card-hover cursor-pointer group" (click)="selectTrip(trip)">
                <div class="h-32 flex items-center justify-center text-6xl relative"
                     [class]="getCoverBg(trip.status)">
                  {{ trip.coverEmoji }}
                  <div class="absolute top-3 right-3">
                    <span class="badge" [class]="getStatusBadge(trip.status)">{{ trip.status }}</span>
                  </div>
                </div>
                <div class="p-5">
                  <h3 class="font-bold text-white text-lg mb-1 group-hover:text-sky-400 transition-colors">{{ trip.name }}</h3>
                  <p class="text-slate-400 text-sm mb-3">📍 {{ trip.destination }}, {{ trip.country }}</p>
                  <div class="flex items-center justify-between text-xs text-slate-500">
                    <span>📅 {{ formatDate(trip.startDate) }}</span>
                    <span>{{ getDuration(trip.startDate, trip.endDate) }} days</span>
                  </div>
                  <div class="mt-4 flex items-center justify-between">
                    <span class="text-white font-semibold">{{ trip.currency }} {{ trip.budget.toLocaleString() }}</span>
                    <div class="flex gap-1">
                      <button (click)="$event.stopPropagation(); deleteTrip(trip.id)" class="p-1.5 text-slate-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10">🗑️</button>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      } @else {
        <div class="animate-slide-up">
          <button (click)="selectedTrip.set(null)" class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group">
            <span class="group-hover:-translate-x-1 transition-transform">←</span> Back to Trips
          </button>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="space-y-4">
              <div class="glass rounded-2xl p-5">
                <div class="flex items-center gap-3 mb-4">
                  <div class="text-4xl">{{ selectedTrip()!.coverEmoji }}</div>
                  <div>
                    <h2 class="font-display text-xl font-bold text-white">{{ selectedTrip()!.name }}</h2>
                    <p class="text-slate-400 text-sm">{{ selectedTrip()!.destination }}, {{ selectedTrip()!.country }}</p>
                  </div>
                </div>
                <div class="space-y-3 text-sm">
                  <div class="flex justify-between">
                    <span class="text-slate-400">Duration</span>
                    <span class="text-white font-medium">{{ getDuration(selectedTrip()!.startDate, selectedTrip()!.endDate) }} days</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Start</span>
                    <span class="text-white font-medium">{{ formatDate(selectedTrip()!.startDate) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">End</span>
                    <span class="text-white font-medium">{{ formatDate(selectedTrip()!.endDate) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Budget</span>
                    <span class="text-white font-semibold">{{ selectedTrip()!.currency }} {{ selectedTrip()!.budget.toLocaleString() }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Status</span>
                    <span class="badge" [class]="getStatusBadge(selectedTrip()!.status)">{{ selectedTrip()!.status }}</span>
                  </div>
                </div>
              </div>

              </div>

            <div class="lg:col-span-2">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-display text-xl font-bold text-white">Day-by-Day Itinerary</h3>
                <button (click)="showAddDay.set(true)" class="btn-secondary px-4 py-2 rounded-xl text-xs font-semibold">
                  + Add Day
                </button>
              </div>

              <div class="space-y-4">
                @for (day of selectedTrip()!.days; track day.id) {
                  <div class="glass rounded-2xl p-5">
                    <div class="flex items-center justify-between mb-4">
                      <h4 class="font-semibold text-white flex items-center gap-2">
                        <span class="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-xs font-bold">
                          {{ getDayNumber(day.date, selectedTrip()!.startDate) }}
                        </span>
                        {{ formatDate(day.date) }}
                      </h4>
                      <button (click)="openAddActivity(day.id)" class="text-xs text-sky-400 hover:text-sky-300 transition-colors">+ Activity</button>
                    </div>

                    <div class="space-y-3">
                      @for (act of day.activities; track act.id) {
                        <div class="flex gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                          <div class="text-lg">{{ getActivityIcon(act.type) }}</div>
                          <div class="flex-1">
                            <span class="text-white text-sm font-medium">{{ act.title }}</span>
                            <p class="text-slate-500 text-xs">{{ act.time }} - {{ act.location }}</p>
                          </div>
                          @if (act.cost) {
                            <div class="text-right">
                              <span class="text-emerald-400 text-xs font-medium">
                                {{ '$' }}{{ act.cost }}
                              </span>
                            </div>
                          }
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      }

      @if (showNewTripModal()) {
        <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" (click)="showNewTripModal.set(false)">
           </div>
      }
    </div>
  `
})
export class TripPlannerComponent implements OnInit {
  trips = inject(TripService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  selectedTrip = signal<Trip | null>(null);
  showNewTripModal = signal(false);
  showAddDay = signal(false);
  showAddActivity = signal(false);
  currentDayId = signal('');
  newDayDate = '';

  emojiOptions = ['✈️', '🗾', '🗼', '🏖️', '🌴', '🏔️'];
  newTrip = this.getEmptyTrip();
  newActivity = this.getEmptyActivity();

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const trip = this.trips.getTrip(id);
      if (trip) this.selectedTrip.set(trip);
    }
  }

  getEmptyTrip() {
    return { name: '', destination: '', country: '', startDate: '', endDate: '', budget: 0, currency: 'USD', status: 'planning' as const, coverEmoji: '✈️', notes: '', companions: [], packingItems: [], budgetItems: [], days: [] };
  }

  getEmptyActivity() {
    return { time: '09:00', title: '', description: '', type: 'attraction' as const, location: '', cost: 0, completed: false };
  }

  selectTrip(trip: Trip) { this.selectedTrip.set(trip); }

  createTrip() {
    if (!this.newTrip.name || !this.newTrip.destination || !this.newTrip.startDate) return;
    const created = this.trips.addTrip(this.newTrip as any);
    this.showNewTripModal.set(false);
    this.newTrip = this.getEmptyTrip();
    this.selectedTrip.set(created);
  }

  deleteTrip(id: string) {
    if (confirm('Delete this trip?')) {
      this.trips.deleteTrip(id);
      if (this.selectedTrip()?.id === id) this.selectedTrip.set(null);
    }
  }

  openAddActivity(dayId: string) {
    this.currentDayId.set(dayId);
    this.newActivity = this.getEmptyActivity();
    this.showAddActivity.set(true);
  }

  addDay() {
    if (!this.newDayDate || !this.selectedTrip()) return;
    this.trips.addDay(this.selectedTrip()!.id, this.newDayDate);
    const updated = this.trips.getTrip(this.selectedTrip()!.id);
    if (updated) this.selectedTrip.set(updated);
    this.showAddDay.set(false);
  }

  addActivity() {
    if (!this.newActivity.title || !this.selectedTrip()) return;
    this.trips.addActivity(this.selectedTrip()!.id, this.currentDayId(), this.newActivity);
    const updated = this.trips.getTrip(this.selectedTrip()!.id);
    if (updated) this.selectedTrip.set(updated);
    this.showAddActivity.set(false);
  }

  formatDate(d: string) { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  getDuration(start: string, end: string) { return Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86400000) + 1; }
  getDayNumber(date: string, start: string) { return Math.ceil((new Date(date).getTime() - new Date(start).getTime()) / 86400000) + 1; }

  getCoverBg(status: string) {
    const m: Record<string, string> = { planning: 'bg-slate-700', upcoming: 'bg-sky-900', ongoing: 'bg-emerald-900', completed: 'bg-purple-900' };
    return m[status] || m['planning'];
  }

  getStatusBadge(status: string) {
    const m: Record<string, string> = { planning: 'badge-warning', upcoming: 'badge-primary', ongoing: 'badge-success', completed: 'badge-secondary' };
    return m[status] || 'badge-primary';
  }

  getActivityIcon(type: string) {
    const m: Record<string, string> = { transport: '🚌', accommodation: '🏨', food: '🍽️', attraction: '🎯', leisure: '🎉', other: '📌' };
    return m[type] || '📌';
  }
}
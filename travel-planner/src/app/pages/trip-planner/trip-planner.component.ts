import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { TripService, Trip, Activity } from '../../services/trip.service';

@Component({
  selector: 'app-trip-planner',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="p-6 max-w-7xl mx-auto animate-fade-in">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 class="font-display text-4xl font-bold text-white mb-1">Trip Planner</h1>
          <p class="text-slate-400">Create and manage your travel itineraries</p>
        </div>
        <button (click)="showNewTripModal.set(true)" class="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
          <span>➕</span> New Trip
        </button>
      </div>

      <!-- Trip list / detail -->
      @if (!selectedTrip()) {
        <!-- Trip grid -->
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
        <!-- Trip detail -->
        <div class="animate-slide-up">
          <button (click)="selectedTrip.set(null)" class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group">
            <span class="group-hover:-translate-x-1 transition-transform">←</span> Back to Trips
          </button>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Left: Trip info -->
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

              <!-- Companions -->
              @if (selectedTrip()!.companions?.length) {
                <div class="glass rounded-2xl p-5">
                  <h3 class="font-semibold text-white mb-3">👥 Companions</h3>
                  <div class="flex flex-wrap gap-2">
                    @for (c of selectedTrip()!.companions; track c) {
                      <span class="badge badge-primary">{{ c }}</span>
                    }
                  </div>
                </div>
              }

              <!-- Notes -->
              @if (selectedTrip()!.notes) {
                <div class="glass rounded-2xl p-5">
                  <h3 class="font-semibold text-white mb-2">📝 Notes</h3>
                  <p class="text-slate-400 text-sm">{{ selectedTrip()!.notes }}</p>
                </div>
              }

              <!-- Quick Links -->
              <div class="glass rounded-2xl p-5">
                <h3 class="font-semibold text-white mb-3">Quick Links</h3>
                <div class="space-y-2">
                  <a routerLink="/packing" class="flex items-center gap-2 text-sm text-slate-400 hover:text-sky-400 transition-colors">
                    🧳 Packing List ({{ selectedTrip()!.packingItems.length }} items)
                  </a>
                  <a routerLink="/budget" class="flex items-center gap-2 text-sm text-slate-400 hover:text-sky-400 transition-colors">
                    💰 Budget ({{ selectedTrip()!.currency }} {{ selectedTrip()!.budget.toLocaleString() }})
                  </a>
                  <a routerLink="/timeline" class="flex items-center gap-2 text-sm text-slate-400 hover:text-sky-400 transition-colors">
                    📅 View Timeline
                  </a>
                </div>
              </div>
            </div>

            <!-- Right: Day-by-day itinerary -->
            <div class="lg:col-span-2">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-display text-xl font-bold text-white">Day-by-Day Itinerary</h3>
                <button (click)="showAddDay.set(true)" class="btn-secondary px-4 py-2 rounded-xl text-xs font-semibold">
                  + Add Day
                </button>
              </div>

              @if (selectedTrip()!.days.length === 0) {
                <div class="glass rounded-2xl p-10 text-center">
                  <div class="text-4xl mb-3">📅</div>
                  <p class="text-slate-400 mb-4">No days added yet. Start building your itinerary!</p>
                  <button (click)="showAddDay.set(true)" class="btn-primary px-5 py-2 rounded-xl text-sm">Add First Day</button>
                </div>
              } @else {
                <div class="space-y-4">
                  @for (day of selectedTrip()!.days; track day.id) {
                    <div class="glass rounded-2xl p-5">
                      <div class="flex items-center justify-between mb-4">
                        <h4 class="font-semibold text-white flex items-center gap-2">
                          <span class="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold">
                            {{ getDayNumber(day.date, selectedTrip()!.startDate) }}
                          </span>
                          {{ formatDate(day.date) }}
                        </h4>
                        <button (click)="openAddActivity(day.id)" class="text-xs text-sky-400 hover:text-sky-300 transition-colors">+ Activity</button>
                      </div>

                      @if (day.activities.length === 0) {
                        <p class="text-slate-500 text-sm text-center py-3">No activities yet</p>
                      } @else {
                        <div class="space-y-3">
                          @for (act of day.activities; track act.id) {
                            <div class="flex gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors group">
                              <div class="text-lg mt-0.5">{{ getActivityIcon(act.type) }}</div>
                              <div class="flex-1">
                                <div class="flex items-center gap-2">
                                  <span class="text-xs text-slate-500">{{ act.time }}</span>
                                  <span class="text-white text-sm font-medium">{{ act.title }}</span>
                                </div>
                                @if (act.description) {
                                  <p class="text-slate-500 text-xs mt-0.5">{{ act.description }}</p>
                                }
                                @if (act.location) {
                                  <p class="text-sky-500 text-xs mt-0.5">📍 {{ act.location }}</p>
                                }
                              </div>
                              @if (act.cost) {
                                <div class="text-right">
                                  <span class="text-emerald-400 text-xs font-medium">${{ act.cost }}</span>
                                </div>
                              }
                            </div>
                          }
                        </div>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      }

      <!-- New Trip Modal -->
      @if (showNewTripModal()) {
        <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" (click)="showNewTripModal.set(false)">
          <div class="glass-strong rounded-2xl p-6 w-full max-w-lg animate-slide-up max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
            <h2 class="font-display text-2xl font-bold text-white mb-6">✈️ Create New Trip</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm text-slate-300 mb-1.5">Trip Name *</label>
                <input type="text" [(ngModel)]="newTrip.name" placeholder="e.g. Tokyo Adventure" class="input-field w-full px-4 py-2.5 rounded-xl text-sm">
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm text-slate-300 mb-1.5">Destination *</label>
                  <input type="text" [(ngModel)]="newTrip.destination" placeholder="City" class="input-field w-full px-4 py-2.5 rounded-xl text-sm">
                </div>
                <div>
                  <label class="block text-sm text-slate-300 mb-1.5">Country *</label>
                  <input type="text" [(ngModel)]="newTrip.country" placeholder="Country" class="input-field w-full px-4 py-2.5 rounded-xl text-sm">
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm text-slate-300 mb-1.5">Start Date *</label>
                  <input type="date" [(ngModel)]="newTrip.startDate" class="input-field w-full px-4 py-2.5 rounded-xl text-sm">
                </div>
                <div>
                  <label class="block text-sm text-slate-300 mb-1.5">End Date *</label>
                  <input type="date" [(ngModel)]="newTrip.endDate" class="input-field w-full px-4 py-2.5 rounded-xl text-sm">
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm text-slate-300 mb-1.5">Budget</label>
                  <input type="number" [(ngModel)]="newTrip.budget" placeholder="0" class="input-field w-full px-4 py-2.5 rounded-xl text-sm">
                </div>
                <div>
                  <label class="block text-sm text-slate-300 mb-1.5">Currency</label>
                  <select [(ngModel)]="newTrip.currency" class="input-field w-full px-4 py-2.5 rounded-xl text-sm">
                    <option>USD</option><option>EUR</option><option>GBP</option><option>INR</option><option>JPY</option><option>AUD</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-sm text-slate-300 mb-1.5">Cover Emoji</label>
                <div class="flex flex-wrap gap-2">
                  @for (e of emojiOptions; track e) {
                    <button (click)="newTrip.coverEmoji = e"
                            class="text-2xl p-2 rounded-xl transition-all"
                            [class]="newTrip.coverEmoji === e ? 'bg-sky-500/20 ring-2 ring-sky-500' : 'hover:bg-white/5'">{{ e }}</button>
                  }
                </div>
              </div>
              <div>
                <label class="block text-sm text-slate-300 mb-1.5">Status</label>
                <select [(ngModel)]="newTrip.status" class="input-field w-full px-4 py-2.5 rounded-xl text-sm">
                  <option value="planning">Planning</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label class="block text-sm text-slate-300 mb-1.5">Notes</label>
                <textarea [(ngModel)]="newTrip.notes" rows="2" placeholder="Any notes..." class="input-field w-full px-4 py-2.5 rounded-xl text-sm resize-none"></textarea>
              </div>
            </div>
            <div class="flex gap-3 mt-6">
              <button (click)="showNewTripModal.set(false)" class="btn-secondary flex-1 py-2.5 rounded-xl text-sm font-medium">Cancel</button>
              <button (click)="createTrip()" class="btn-primary flex-1 py-2.5 rounded-xl text-sm font-semibold">Create Trip ✈️</button>
            </div>
          </div>
        </div>
      }

      <!-- Add Day Modal -->
      @if (showAddDay()) {
        <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" (click)="showAddDay.set(false)">
          <div class="glass-strong rounded-2xl p-6 w-full max-w-sm animate-slide-up" (click)="$event.stopPropagation()">
            <h2 class="font-display text-xl font-bold text-white mb-4">Add Day</h2>
            <label class="block text-sm text-slate-300 mb-1.5">Date</label>
            <input type="date" [(ngModel)]="newDayDate" class="input-field w-full px-4 py-2.5 rounded-xl text-sm mb-4">
            <div class="flex gap-3">
              <button (click)="showAddDay.set(false)" class="btn-secondary flex-1 py-2.5 rounded-xl text-sm">Cancel</button>
              <button (click)="addDay()" class="btn-primary flex-1 py-2.5 rounded-xl text-sm font-semibold">Add Day</button>
            </div>
          </div>
        </div>
      }

      <!-- Add Activity Modal -->
      @if (showAddActivity()) {
        <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" (click)="showAddActivity.set(false)">
          <div class="glass-strong rounded-2xl p-6 w-full max-w-md animate-slide-up" (click)="$event.stopPropagation()">
            <h2 class="font-display text-xl font-bold text-white mb-4">Add Activity</h2>
            <div class="space-y-3">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm text-slate-300 mb-1.5">Time</label>
                  <input type="time" [(ngModel)]="newActivity.time" class="input-field w-full px-4 py-2.5 rounded-xl text-sm">
                </div>
                <div>
                  <label class="block text-sm text-slate-300 mb-1.5">Type</label>
                  <select [(ngModel)]="newActivity.type" class="input-field w-full px-4 py-2.5 rounded-xl text-sm">
                    <option value="transport">Transport</option>
                    <option value="accommodation">Accommodation</option>
                    <option value="food">Food</option>
                    <option value="attraction">Attraction</option>
                    <option value="leisure">Leisure</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-sm text-slate-300 mb-1.5">Title *</label>
                <input type="text" [(ngModel)]="newActivity.title" placeholder="Activity title" class="input-field w-full px-4 py-2.5 rounded-xl text-sm">
              </div>
              <div>
                <label class="block text-sm text-slate-300 mb-1.5">Description</label>
                <input type="text" [(ngModel)]="newActivity.description" placeholder="Optional details" class="input-field w-full px-4 py-2.5 rounded-xl text-sm">
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm text-slate-300 mb-1.5">Location</label>
                  <input type="text" [(ngModel)]="newActivity.location" placeholder="Place" class="input-field w-full px-4 py-2.5 rounded-xl text-sm">
                </div>
                <div>
                  <label class="block text-sm text-slate-300 mb-1.5">Cost ($)</label>
                  <input type="number" [(ngModel)]="newActivity.cost" placeholder="0" class="input-field w-full px-4 py-2.5 rounded-xl text-sm">
                </div>
              </div>
            </div>
            <div class="flex gap-3 mt-5">
              <button (click)="showAddActivity.set(false)" class="btn-secondary flex-1 py-2.5 rounded-xl text-sm">Cancel</button>
              <button (click)="addActivity()" class="btn-primary flex-1 py-2.5 rounded-xl text-sm font-semibold">Add Activity</button>
            </div>
          </div>
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

  emojiOptions = ['✈️', '🗾', '🗼', '🏖️', '🌴', '🏔️', '🏛️', '🗽', '🌊', '🎭', '🏜️', '🌸', '🎪', '🚂', '⛵'];

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
    return { name: '', destination: '', country: '', startDate: '', endDate: '', budget: 0, currency: 'USD', status: 'planning' as const, coverEmoji: '✈️', notes: '', companions: [] as string[], packingItems: [], budgetItems: [], days: [] };
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
    this.newDayDate = '';
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
    const m: Record<string, string> = { planning: 'bg-gradient-to-br from-slate-700/50 to-slate-800/50', upcoming: 'bg-gradient-to-br from-sky-900/50 to-blue-800/30', ongoing: 'bg-gradient-to-br from-emerald-900/50 to-teal-800/30', completed: 'bg-gradient-to-br from-purple-900/50 to-indigo-800/30' };
    return m[status] || m['planning'];
  }

  getStatusBadge(status: string) {
    const m: Record<string, string> = { planning: 'badge-warning', upcoming: 'badge-primary', ongoing: 'badge-success', completed: 'bg-purple-500/15 text-purple-400 border border-purple-500/30' };
    return m[status] || 'badge-primary';
  }

  getActivityIcon(type: string) {
    const m: Record<string, string> = { transport: '🚌', accommodation: '🏨', food: '🍽️', attraction: '🎯', leisure: '🎉', other: '📌' };
    return m[type] || '📌';
  }
}

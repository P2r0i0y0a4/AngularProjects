import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TripService } from '../../services/trip.service';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-5xl mx-auto animate-fade-in">
      <div class="mb-8">
        <h1 class="font-display text-4xl font-bold text-white mb-1">Timeline 📅</h1>
        <p class="text-slate-400">Your trip activities at a glance</p>
      </div>

      <!-- Trip selector -->
      <div class="glass rounded-2xl p-4 mb-6 flex flex-wrap gap-2 items-center">
        <span class="text-slate-400 text-sm mr-2">Trip:</span>
        @for (trip of trips.trips(); track trip.id) {
          <button (click)="selectedTripId.set(trip.id)"
                  class="px-4 py-1.5 rounded-xl text-sm font-medium transition-all"
                  [class]="selectedTripId() === trip.id ? 'bg-gradient-primary text-white' : 'btn-secondary'">
            {{ trip.coverEmoji }} {{ trip.name }}
          </button>
        }
      </div>

      @if (selectedTrip()) {
        <!-- Trip summary header -->
        <div class="glass rounded-2xl p-5 mb-6 bg-gradient-to-r from-sky-500/10 to-emerald-500/10 border border-sky-500/10">
          <div class="flex items-center gap-4 flex-wrap">
            <span class="text-4xl">{{ selectedTrip()!.coverEmoji }}</span>
            <div>
              <h2 class="font-display text-xl font-bold text-white">{{ selectedTrip()!.name }}</h2>
              <p class="text-slate-400 text-sm">{{ selectedTrip()!.destination }} · {{ formatDate(selectedTrip()!.startDate) }} → {{ formatDate(selectedTrip()!.endDate) }}</p>
            </div>
            <div class="ml-auto flex gap-4 text-center">
              <div>
                <p class="text-2xl font-display font-bold gradient-text">{{ getDuration() }}</p>
                <p class="text-slate-500 text-xs">Days</p>
              </div>
              <div>
                <p class="text-2xl font-display font-bold text-emerald-400">{{ totalActivities() }}</p>
                <p class="text-slate-500 text-xs">Activities</p>
              </div>
            </div>
          </div>
        </div>

        @if (selectedTrip()!.days.length === 0) {
          <div class="glass rounded-2xl p-16 text-center">
            <div class="text-5xl mb-4">📅</div>
            <p class="text-slate-400 mb-4">No itinerary added yet.</p>
            <a href="/trips" class="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">Go to Trip Planner</a>
          </div>
        } @else {
          <!-- Timeline view -->
          <div class="relative">
            <!-- Vertical line -->
            <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-500 via-emerald-500 to-purple-500 opacity-30"></div>

            @for (day of selectedTrip()!.days; track day.id; let dayIdx = $index) {
              <div class="mb-8 animate-slide-in" [style.animation-delay]="dayIdx * 0.1 + 's'">
                <!-- Day header -->
                <div class="flex items-center gap-4 mb-4">
                  <div class="relative z-10 w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-glow flex-shrink-0">
                    {{ dayIdx + 1 }}
                  </div>
                  <div>
                    <p class="text-white font-semibold">Day {{ dayIdx + 1 }}</p>
                    <p class="text-slate-400 text-sm">{{ formatDate(day.date) }}</p>
                  </div>
                  <div class="ml-auto">
                    <span class="badge badge-primary">{{ day.activities.length }} activities</span>
                  </div>
                </div>

                <!-- Activities -->
                <div class="ml-16 space-y-3">
                  @for (activity of day.activities.slice().sort(sortByTime); track activity.id; let actIdx = $index) {
                    <div class="glass rounded-xl p-4 flex gap-3 hover:bg-white/5 transition-all group border-l-2"
                         [class]="getActivityBorder(activity.type)">
                      <div class="text-2xl mt-0.5">{{ getActivityIcon(activity.type) }}</div>
                      <div class="flex-1">
                        <div class="flex items-start justify-between gap-2">
                          <div>
                            <div class="flex items-center gap-2 flex-wrap">
                              <span class="text-xs text-slate-500 font-mono">{{ activity.time }}</span>
                              <h4 class="text-white font-medium text-sm">{{ activity.title }}</h4>
                              <span class="badge text-xs" [class]="getTypeBadge(activity.type)">{{ activity.type }}</span>
                            </div>
                            @if (activity.description) {
                              <p class="text-slate-400 text-xs mt-1">{{ activity.description }}</p>
                            }
                            @if (activity.location) {
                              <p class="text-sky-500 text-xs mt-0.5 flex items-center gap-1">
                                <span>📍</span> {{ activity.location }}
                              </p>
                            }
                          </div>
                          @if (activity.cost && activity.cost > 0) {
                            <div class="badge badge-success text-xs flex-shrink-0">+${{ activity.cost }}</div>
                          }
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Stats summary -->
          <div class="glass rounded-2xl p-5 mt-4">
            <h3 class="font-semibold text-white mb-4">Activity Summary</h3>
            <div class="grid grid-cols-3 sm:grid-cols-6 gap-3">
              @for (type of activityTypes; track type.value) {
                <div class="text-center p-3 rounded-xl" [class]="getTypeBg(type.value)">
                  <div class="text-2xl mb-1">{{ type.icon }}</div>
                  <p class="text-white font-bold text-lg">{{ getTypeCount(type.value) }}</p>
                  <p class="text-slate-400 text-xs">{{ type.label }}</p>
                </div>
              }
            </div>
          </div>
        }
      } @else {
        <div class="glass rounded-2xl p-16 text-center">
          <div class="text-5xl mb-4">📅</div>
          <p class="text-slate-400">Select a trip to view its timeline</p>
        </div>
      }
    </div>
  `
})
export class TimelineComponent {
  trips = inject(TripService);
  selectedTripId = signal(this.trips.trips()[0]?.id || '');

  activityTypes = [
    { value: 'transport', label: 'Transport', icon: '🚌' },
    { value: 'accommodation', label: 'Stay', icon: '🏨' },
    { value: 'food', label: 'Food', icon: '🍽️' },
    { value: 'attraction', label: 'Sights', icon: '🎯' },
    { value: 'leisure', label: 'Leisure', icon: '🎉' },
    { value: 'other', label: 'Other', icon: '📌' },
  ];

  selectedTrip = () => this.trips.trips().find(t => t.id === this.selectedTripId());
  getDuration = () => {
    const t = this.selectedTrip();
    if (!t) return 0;
    return Math.ceil((new Date(t.endDate).getTime() - new Date(t.startDate).getTime()) / 86400000) + 1;
  };
  totalActivities = () => this.selectedTrip()?.days.reduce((s, d) => s + d.activities.length, 0) || 0;

  sortByTime = (a: any, b: any) => a.time.localeCompare(b.time);

  getTypeCount(type: string) {
    return this.selectedTrip()?.days.reduce((s, d) => s + d.activities.filter(a => a.type === type).length, 0) || 0;
  }

  formatDate(d: string) { return new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); }

  getActivityIcon(type: string): string {
    const m: Record<string, string> = { transport: '🚌', accommodation: '🏨', food: '🍽️', attraction: '🎯', leisure: '🎉', other: '📌' };
    return m[type] || '📌';
  }

  getActivityBorder(type: string): string {
    const m: Record<string, string> = { transport: 'border-blue-500/50', accommodation: 'border-purple-500/50', food: 'border-orange-500/50', attraction: 'border-sky-500/50', leisure: 'border-emerald-500/50', other: 'border-slate-500/50' };
    return m[type] || 'border-slate-500/50';
  }

  getTypeBadge(type: string): string {
    const m: Record<string, string> = { transport: 'badge-primary', accommodation: 'bg-purple-500/15 text-purple-400 border border-purple-500/30', food: 'badge-warning', attraction: 'badge-primary', leisure: 'badge-success', other: 'bg-slate-500/15 text-slate-400 border border-slate-500/30' };
    return m[type] || 'badge-primary';
  }

  getTypeBg(type: string): string {
    const m: Record<string, string> = { transport: 'bg-blue-500/10', accommodation: 'bg-purple-500/10', food: 'bg-orange-500/10', attraction: 'bg-sky-500/10', leisure: 'bg-emerald-500/10', other: 'bg-slate-500/10' };
    return m[type] || 'bg-slate-500/10';
  }
}

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

      <div class="glass rounded-2xl p-4 mb-6 flex flex-wrap gap-2 items-center">
        <span class="text-slate-400 text-sm mr-2">Trip:</span>
        @for (trip of trips.trips(); track trip.id) {
          <button (click)="selectedTripId.set(trip.id)"
                  class="px-4 py-1.5 rounded-xl text-sm font-medium transition-all"
                  [class]="selectedTripId() === trip.id ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'bg-white/5 text-slate-300 hover:bg-white/10'">
            {{ trip.coverEmoji }} {{ trip.name }}
          </button>
        }
      </div>

      @if (selectedTrip()) {
        <div class="glass rounded-2xl p-5 mb-6 bg-gradient-to-r from-sky-500/10 to-emerald-500/10 border border-sky-500/10">
          <div class="flex items-center gap-4 flex-wrap">
            <span class="text-4xl">{{ selectedTrip()!.coverEmoji }}</span>
            <div>
              <h2 class="font-display text-xl font-bold text-white">{{ selectedTrip()!.name }}</h2>
              <p class="text-slate-400 text-sm">{{ selectedTrip()!.destination }} · {{ formatDate(selectedTrip()!.startDate) }} → {{ formatDate(selectedTrip()!.endDate) }}</p>
            </div>
            <div class="ml-auto flex gap-4 text-center">
              <div>
                <p class="text-2xl font-display font-bold text-sky-400">{{ getDuration() }}</p>
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
            <button class="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">Go to Trip Planner</button>
          </div>
        } @else {
          <div class="relative">
            <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-500 via-emerald-500 to-slate-700 opacity-30"></div>

            @for (day of selectedTrip()!.days; track day.id; let dayIdx = $index) {
              <div class="mb-8 animate-slide-in">
                <div class="flex items-center gap-4 mb-4">
                  <div class="relative z-10 w-12 h-12 rounded-full bg-sky-600 flex items-center justify-center text-white font-bold text-sm shadow-xl flex-shrink-0">
                    {{ dayIdx + 1 }}
                  </div>
                  <div>
                    <p class="text-white font-semibold">Day {{ dayIdx + 1 }}</p>
                    <p class="text-slate-400 text-sm">{{ formatDate(day.date) }}</p>
                  </div>
                </div>

                <div class="ml-16 space-y-3">
                  @for (activity of sortActivities(day.activities); track activity.id) {
                    <div class="glass rounded-xl p-4 flex gap-3 hover:bg-white/5 transition-all group border-l-2"
                         [class]="getActivityBorder(activity.type)">
                      <div class="text-2xl mt-0.5">{{ getActivityIcon(activity.type) }}</div>
                      <div class="flex-1">
                        <div class="flex items-start justify-between gap-2">
                          <div>
                            <div class="flex items-center gap-2 flex-wrap">
                              <span class="text-xs text-slate-500 font-mono">{{ activity.time }}</span>
                              <h4 class="text-white font-medium text-sm">{{ activity.title }}</h4>
                              <span class="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold" [class]="getTypeBadge(activity.type)">
                                {{ activity.type }}
                              </span>
                            </div>
                            @if (activity.description) {
                              <p class="text-slate-400 text-xs mt-1">{{ activity.description }}</p>
                            }
                          </div>
                          @if (activity.cost && activity.cost > 0) {
                            <div class="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-lg">
                              {{ '$' }}{{ activity.cost }}
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
          </div>

          <div class="glass rounded-2xl p-5 mt-4">
            <h3 class="font-semibold text-white mb-4">Activity Summary</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              @for (type of activityTypes; track type.value) {
                <div class="text-center p-3 rounded-xl border border-white/5" [class]="getTypeBg(type.value)">
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

  selectedTrip = computed(() => this.trips.trips().find(t => t.id === this.selectedTripId()));

  getDuration() {
    const t = this.selectedTrip();
    if (!t) return 0;
    return Math.ceil((new Date(t.endDate).getTime() - new Date(t.startDate).getTime()) / 86400000) + 1;
  }

  totalActivities() {
    return this.selectedTrip()?.days.reduce((s, d) => s + d.activities.length, 0) || 0;
  }

  sortActivities(activities: any[]) {
    return [...activities].sort((a, b) => a.time.localeCompare(b.time));
  }

  getTypeCount(type: string) {
    return this.selectedTrip()?.days.reduce((s, d) => s + d.activities.filter(a => a.type === type).length, 0) || 0;
  }

  formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  getActivityIcon(type: string): string {
    const m: Record<string, string> = { transport: '🚌', accommodation: '🏨', food: '🍽️', attraction: '🎯', leisure: '🎉', other: '📌' };
    return m[type] || '📌';
  }

  getActivityBorder(type: string): string {
    const m: Record<string, string> = { 
        transport: 'border-blue-500/50', 
        accommodation: 'border-purple-500/50', 
        food: 'border-slate-500/50', 
        attraction: 'border-sky-500/50', 
        leisure: 'border-emerald-500/50', 
        other: 'border-slate-400/30' 
    };
    return m[type] || 'border-slate-500/50';
  }

  getTypeBadge(type: string): string {
    const m: Record<string, string> = { 
        transport: 'bg-blue-500/20 text-blue-400', 
        accommodation: 'bg-purple-500/20 text-purple-400', 
        food: 'bg-slate-500/20 text-slate-300', 
        attraction: 'bg-sky-500/20 text-sky-400', 
        leisure: 'bg-emerald-500/20 text-emerald-400', 
        other: 'bg-slate-700/20 text-slate-400' 
    };
    return m[type] || 'bg-slate-500/20';
  }

  getTypeBg(type: string): string {
    const m: Record<string, string> = { 
        transport: 'bg-blue-500/5', 
        accommodation: 'bg-purple-500/5', 
        food: 'bg-slate-500/5', 
        attraction: 'bg-sky-500/5', 
        leisure: 'bg-emerald-500/5', 
        other: 'bg-slate-700/5' 
    };
    return m[type] || 'bg-slate-500/5';
  }
}
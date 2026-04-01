import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TripService } from '../../services/trip.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-6 max-w-7xl mx-auto animate-fade-in">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 class="font-display text-4xl font-bold text-white mb-1">
              Good {{ greeting() }}, {{ firstName() }}! 👋
            </h1>
            <p class="text-slate-400">Here's your travel overview</p>
          </div>
          <a routerLink="/trips" class="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
            <span>➕</span> New Trip
          </a>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        @for (stat of stats(); track stat.label) {
          <div class="glass rounded-2xl p-5 card-hover">
            <div class="flex items-center justify-between mb-3">
              <span class="text-2xl">{{ stat.icon }}</span>
              <span class="badge" [class]="stat.badgeClass">{{ stat.trend }}</span>
            </div>
            <p class="text-3xl font-bold text-white font-display">{{ stat.value }}</p>
            <p class="text-sm text-slate-400 mt-1">{{ stat.label }}</p>
          </div>
        }
      </div>

      <!-- Main content grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Upcoming trips (2/3 width) -->
        <div class="lg:col-span-2">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-display text-xl font-bold text-white">Your Trips</h2>
            <a routerLink="/trips" class="text-sky-400 hover:text-sky-300 text-sm font-medium">View all →</a>
          </div>

          @if (trips().trips().length === 0) {
            <div class="glass rounded-2xl p-12 text-center">
              <div class="text-5xl mb-4">🗺️</div>
              <h3 class="text-xl font-semibold text-white mb-2">No trips yet</h3>
              <p class="text-slate-400 mb-6">Start planning your first adventure!</p>
              <a routerLink="/trips" class="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
                Plan a Trip
              </a>
            </div>
          } @else {
            <div class="space-y-4">
              @for (trip of trips().trips().slice(0, 4); track trip.id) {
                <a [routerLink]="['/trips', trip.id]" class="glass rounded-2xl p-5 flex items-center gap-4 card-hover block no-underline group">
                  <div class="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                       [class]="getTripBg(trip.status)">{{ trip.coverEmoji }}</div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <h3 class="text-white font-semibold group-hover:text-sky-400 transition-colors truncate">{{ trip.name }}</h3>
                      <span class="badge" [class]="getStatusBadge(trip.status)">{{ trip.status }}</span>
                    </div>
                    <p class="text-slate-400 text-sm">{{ trip.destination }}, {{ trip.country }}</p>
                    <p class="text-slate-500 text-xs mt-1">{{ formatDate(trip.startDate) }} → {{ formatDate(trip.endDate) }}</p>
                  </div>
                  <div class="text-right flex-shrink-0">
                    <p class="text-white font-semibold">{{ trip.currency }} {{ trip.budget.toLocaleString() }}</p>
                    <p class="text-slate-500 text-xs">budget</p>
                    <div class="flex mt-1 justify-end">
                      @for (s of [1,2,3,4,5]; track s) {
                        <span class="text-xs" [class]="s <= (trip.rating || 0) ? 'text-yellow-400' : 'text-slate-700'">★</span>
                      }
                    </div>
                  </div>
                </a>
              }
            </div>
          }
        </div>

        <!-- Sidebar widgets -->
        <div class="space-y-5">
          <!-- Quick actions -->
          <div>
            <h2 class="font-display text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div class="grid grid-cols-2 gap-3">
              @for (action of quickActions; track action.label) {
                <a [routerLink]="action.link" class="glass rounded-2xl p-4 text-center card-hover block">
                  <div class="text-2xl mb-2">{{ action.icon }}</div>
                  <p class="text-xs text-slate-300 font-medium">{{ action.label }}</p>
                </a>
              }
            </div>
          </div>

          <!-- Travel Tips -->
          <div class="glass rounded-2xl p-5">
            <h3 class="font-semibold text-white mb-3 flex items-center gap-2">💡 Travel Tip</h3>
            <div class="bg-gradient-to-br from-sky-500/10 to-emerald-500/10 rounded-xl p-4 border border-white/5">
              <p class="text-slate-300 text-sm leading-relaxed">{{ currentTip() }}</p>
            </div>
            <button (click)="nextTip()" class="mt-3 text-xs text-sky-400 hover:text-sky-300 transition-colors">
              Next tip →
            </button>
          </div>

          <!-- Upcoming countdown -->
          @if (nextTrip()) {
            <div class="rounded-2xl p-5 bg-gradient-to-br from-sky-500/20 to-emerald-500/20 border border-sky-500/20">
              <p class="text-xs text-sky-400 font-semibold uppercase tracking-wider mb-2">Next Adventure</p>
              <h3 class="text-white font-bold text-lg mb-1">{{ nextTrip()!.name }}</h3>
              <p class="text-slate-400 text-sm">{{ nextTrip()!.destination }}</p>
              <div class="mt-4 flex items-baseline gap-2">
                <span class="text-4xl font-display font-bold gradient-text">{{ daysUntilNextTrip() }}</span>
                <span class="text-slate-400 text-sm">days away</span>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Recent activity -->
      <div class="mt-8">
        <h2 class="font-display text-xl font-bold text-white mb-4">Explore Destinations</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          @for (dest of destinations; track dest.name) {
            <a routerLink="/explore" class="glass rounded-2xl overflow-hidden card-hover block group">
              <div class="h-24 flex items-center justify-center text-5xl"
                   [class]="dest.bg">{{ dest.emoji }}</div>
              <div class="p-3">
                <p class="text-white text-sm font-semibold group-hover:text-sky-400 transition-colors">{{ dest.name }}</p>
                <p class="text-slate-500 text-xs">{{ dest.country }}</p>
              </div>
            </a>
          }
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  auth = inject(AuthService);
  trips = inject(TripService);

  tipIndex = signal(0);

  tips = [
    'Book flights 6-8 weeks in advance for the best prices on international routes.',
    'Always purchase travel insurance before your trip — it\'s worth every penny.',
    'Use a local SIM card or portable WiFi for seamless connectivity abroad.',
    'Notify your bank before traveling to avoid card blocks overseas.',
    'Pack a day bag inside your luggage — perfect for day trips.',
    'Download offline maps before you fly — saves data and works without WiFi.',
  ];

  quickActions = [
    { icon: '✈️', label: 'New Trip', link: '/trips' },
    { icon: '🌤️', label: 'Weather', link: '/weather' },
    { icon: '🧳', label: 'Packing', link: '/packing' },
    { icon: '💰', label: 'Budget', link: '/budget' },
    { icon: '📅', label: 'Timeline', link: '/timeline' },
    { icon: '⚖️', label: 'Compare', link: '/compare' },
  ];

  destinations = [
    { name: 'Santorini', country: 'Greece', emoji: '🏛️', bg: 'bg-gradient-to-br from-blue-600/20 to-white/10' },
    { name: 'Kyoto', country: 'Japan', emoji: '⛩️', bg: 'bg-gradient-to-br from-red-600/20 to-orange-500/10' },
    { name: 'Machu Picchu', country: 'Peru', emoji: '🏔️', bg: 'bg-gradient-to-br from-emerald-600/20 to-teal-500/10' },
    { name: 'Maldives', country: 'Maldives', emoji: '🌊', bg: 'bg-gradient-to-br from-cyan-500/20 to-blue-500/10' },
  ];

  firstName = computed(() => (this.auth.currentUser()?.name || 'Traveler').split(' ')[0]);

  greeting = computed(() => {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
  });

  stats = computed(() => {
    const ts = this.trips.trips();
    return [
      { icon: '✈️', value: ts.length, label: 'Total Trips', trend: '+2', badgeClass: 'badge-success' },
      { icon: '🌍', value: new Set(ts.map(t => t.country)).size, label: 'Countries', trend: 'new', badgeClass: 'badge-primary' },
      { icon: '📅', value: ts.filter(t => t.status === 'upcoming').length, label: 'Upcoming', trend: 'soon', badgeClass: 'badge-warning' },
      {
        icon: '💰',
        value: '$' + ts.reduce((sum, t) => sum + t.budget, 0).toLocaleString(),
        label: 'Total Budgeted',
        trend: 'planned',
        badgeClass: 'badge-primary'
      },
    ];
  });

  nextTrip = computed(() => {
    const now = new Date();
    return this.trips.trips()
      .filter(t => new Date(t.startDate) > now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0] || null;
  });

  daysUntilNextTrip = computed(() => {
    const trip = this.nextTrip();
    if (!trip) return 0;
    const diff = new Date(trip.startDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  });

  currentTip = computed(() => this.tips[this.tipIndex()]);

  nextTip() { this.tipIndex.update(i => (i + 1) % this.tips.length); }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  getTripBg(status: string): string {
    const map: Record<string, string> = {
      planning: 'bg-slate-700/50',
      upcoming: 'bg-sky-500/20',
      ongoing: 'bg-emerald-500/20',
      completed: 'bg-purple-500/20',
    };
    return map[status] || 'bg-slate-700/50';
  }

  getStatusBadge(status: string): string {
    const map: Record<string, string> = {
      planning: 'badge-warning',
      upcoming: 'badge-primary',
      ongoing: 'badge-success',
      completed: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
    };
    return map[status] || 'badge-primary';
  }
}

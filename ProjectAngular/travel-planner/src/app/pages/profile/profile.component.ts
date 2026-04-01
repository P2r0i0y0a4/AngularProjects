import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TripService } from '../../services/trip.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-4xl mx-auto animate-fade-in">
      <div class="mb-8">
        <h1 class="font-display text-4xl font-bold text-white mb-1">Profile 👤</h1>
        <p class="text-slate-400">Manage your account settings</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left: Avatar & stats -->
        <div class="space-y-5">
          <!-- Avatar card -->
          <div class="glass rounded-2xl p-6 text-center">
            <div class="w-24 h-24 rounded-2xl bg-gradient-primary flex items-center justify-center text-4xl font-bold text-white mx-auto mb-4 shadow-glow">
              {{ getInitials() }}
            </div>
            <h2 class="font-display text-xl font-bold text-white">{{ auth.currentUser()?.name }}</h2>
            <p class="text-slate-400 text-sm mb-4">{{ auth.currentUser()?.email }}</p>
            <div class="flex items-center justify-center gap-1 mb-4">
              @for (s of [1,2,3,4,5]; track s) { <span class="text-yellow-400">★</span> }
            </div>
            <p class="text-slate-500 text-xs">Member since {{ formatJoinDate() }}</p>
          </div>

          <!-- Travel stats -->
          <div class="glass rounded-2xl p-5">
            <h3 class="font-semibold text-white mb-4">Travel Stats</h3>
            <div class="space-y-4">
              @for (stat of travelStats(); track stat.label) {
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-lg">{{ stat.icon }}</span>
                    <span class="text-slate-400 text-sm">{{ stat.label }}</span>
                  </div>
                  <span class="font-bold text-white text-lg font-display">{{ stat.value }}</span>
                </div>
              }
            </div>
          </div>

          <!-- Achievements -->
          <div class="glass rounded-2xl p-5">
            <h3 class="font-semibold text-white mb-4">🏆 Achievements</h3>
            <div class="grid grid-cols-3 gap-2">
              @for (badge of achievements(); track badge.name) {
                <div class="text-center p-2 rounded-xl transition-all"
                     [class]="badge.earned ? 'bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-yellow-500/20' : 'glass opacity-40'">
                  <div class="text-2xl mb-1">{{ badge.icon }}</div>
                  <p class="text-xs text-slate-400 leading-tight">{{ badge.name }}</p>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Right: Edit form -->
        <div class="lg:col-span-2 space-y-5">
          @if (saveSuccess()) {
            <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
              ✅ Profile updated successfully!
            </div>
          }

          <!-- Edit profile -->
          <div class="glass rounded-2xl p-6">
            <h3 class="font-semibold text-white text-lg mb-5">Edit Profile</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm text-slate-300 mb-1.5">Full Name</label>
                <input type="text" [(ngModel)]="editName" class="input-field w-full px-4 py-2.5 rounded-xl text-sm">
              </div>
              <div>
                <label class="block text-sm text-slate-300 mb-1.5">Email</label>
                <input type="email" [value]="auth.currentUser()?.email" disabled class="input-field w-full px-4 py-2.5 rounded-xl text-sm opacity-50 cursor-not-allowed">
                <p class="text-xs text-slate-500 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label class="block text-sm text-slate-300 mb-1.5">Travel Style</label>
                <div class="flex flex-wrap gap-2">
                  @for (style of travelStyles; track style) {
                    <button (click)="toggleStyle(style)"
                            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                            [class]="selectedStyles().includes(style) ? 'bg-gradient-primary text-white' : 'glass text-slate-400 hover:text-white'">
                      {{ style }}
                    </button>
                  }
                </div>
              </div>
              <div>
                <label class="block text-sm text-slate-300 mb-1.5">Bio</label>
                <textarea [(ngModel)]="editBio" rows="3" placeholder="Tell us about your travel passions..." class="input-field w-full px-4 py-2.5 rounded-xl text-sm resize-none"></textarea>
              </div>
              <button (click)="saveProfile()" class="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold">
                Save Changes
              </button>
            </div>
          </div>

          <!-- Recent trips -->
          <div class="glass rounded-2xl p-6">
            <h3 class="font-semibold text-white text-lg mb-4">Recent Trips</h3>
            @if (trips.trips().length === 0) {
              <p class="text-slate-500 text-sm">No trips yet. Start planning!</p>
            } @else {
              <div class="space-y-3">
                @for (trip of trips.trips().slice(0, 4); track trip.id) {
                  <div class="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                    <span class="text-2xl">{{ trip.coverEmoji }}</span>
                    <div class="flex-1 min-w-0">
                      <p class="text-white text-sm font-medium truncate">{{ trip.name }}</p>
                      <p class="text-slate-500 text-xs">{{ trip.destination }} · {{ formatDate(trip.startDate) }}</p>
                    </div>
                    <span class="badge" [class]="getStatusBadge(trip.status)">{{ trip.status }}</span>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Danger zone -->
          <div class="glass rounded-2xl p-6 border border-red-500/10">
            <h3 class="font-semibold text-red-400 mb-3">Danger Zone</h3>
            <button (click)="auth.logout()" class="px-4 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors flex items-center gap-2">
              <span>🚪</span> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent {
  auth = inject(AuthService);
  trips = inject(TripService);

  editName = this.auth.currentUser()?.name || '';
  editBio = '';
  selectedStyles = signal<string[]>(['Adventure', 'Culture']);
  saveSuccess = signal(false);

  travelStyles = ['Adventure', 'Culture', 'Beach', 'Food', 'Luxury', 'Budget', 'Solo', 'Family', 'Romantic'];

  getInitials() {
    return (this.auth.currentUser()?.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  formatJoinDate() {
    const d = this.auth.currentUser()?.joinDate;
    return d ? new Date(d).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently';
  }

  formatDate(d: string) { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }

  travelStats = () => [
    { icon: '✈️', label: 'Trips Taken', value: this.trips.trips().length },
    { icon: '🌍', label: 'Countries', value: new Set(this.trips.trips().map(t => t.country)).size },
    { icon: '📅', label: 'Days Traveled', value: this.trips.trips().reduce((s, t) => s + Math.ceil((new Date(t.endDate).getTime() - new Date(t.startDate).getTime()) / 86400000), 0) },
    { icon: '💰', label: 'Budget Planned', value: '$' + this.trips.trips().reduce((s, t) => s + t.budget, 0).toLocaleString() },
  ];

  achievements = () => {
    const tripCount = this.trips.trips().length;
    const countries = new Set(this.trips.trips().map(t => t.country)).size;
    return [
      { icon: '✈️', name: 'First Trip', earned: tripCount >= 1 },
      { icon: '🌍', name: 'Globe Trotter', earned: countries >= 3 },
      { icon: '🗺️', name: 'Planner', earned: tripCount >= 3 },
      { icon: '💰', name: 'Budget Master', earned: true },
      { icon: '⭐', name: 'Explorer', earned: countries >= 5 },
      { icon: '🏆', name: 'Adventurer', earned: tripCount >= 5 },
    ];
  };

  toggleStyle(style: string) {
    this.selectedStyles.update(s => s.includes(style) ? s.filter(x => x !== style) : [...s, style]);
  }

  saveProfile() {
    if (this.editName) {
      this.auth.updateUser({ name: this.editName });
    }
    this.saveSuccess.set(true);
    setTimeout(() => this.saveSuccess.set(false), 3000);
  }

  getStatusBadge(status: string) {
    const m: Record<string, string> = { planning: 'badge-warning', upcoming: 'badge-primary', ongoing: 'badge-success', completed: 'bg-purple-500/15 text-purple-400 border border-purple-500/30' };
    return m[status] || 'badge-primary';
  }
}

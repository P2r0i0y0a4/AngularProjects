import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TripService, BudgetItem } from '../../services/trip.service';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-6xl mx-auto animate-fade-in">
      <div class="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 class="font-display text-4xl font-bold text-white mb-1">Budget Breakdown 💰</h1>
          <p class="text-slate-400">Track your travel spending</p>
        </div>
        <button (click)="showModal.set(true)" class="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
          <span>➕</span> Add Expense
        </button>
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
        <!-- Overview cards -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div class="glass rounded-2xl p-5">
            <p class="text-slate-400 text-sm mb-1">Total Budget</p>
            <p class="text-3xl font-display font-bold text-white">{{ selectedTrip()!.currency }} {{ selectedTrip()!.budget.toLocaleString() }}</p>
          </div>
          <div class="glass rounded-2xl p-5">
            <p class="text-slate-400 text-sm mb-1">Planned</p>
            <p class="text-3xl font-display font-bold gradient-text">{{ selectedTrip()!.currency }} {{ totalPlanned().toLocaleString() }}</p>
          </div>
          <div class="glass rounded-2xl p-5">
            <p class="text-slate-400 text-sm mb-1">Actual Spent</p>
            <p class="text-3xl font-display font-bold" [class]="totalActual() > totalPlanned() ? 'text-red-400' : 'text-emerald-400'">
              {{ selectedTrip()!.currency }} {{ totalActual().toLocaleString() }}
            </p>
          </div>
        </div>

        <!-- Budget bar -->
        <div class="glass rounded-2xl p-5 mb-6">
          <div class="flex justify-between text-sm text-slate-400 mb-2">
            <span>Budget Used</span>
            <span [class]="budgetPercent() > 100 ? 'text-red-400' : 'text-slate-400'">{{ budgetPercent() }}%</span>
          </div>
          <div class="progress-bar h-3">
            <div class="h-full rounded-full transition-all"
                 [style.width.%]="Math.min(budgetPercent(), 100)"
                 [class]="budgetPercent() > 90 ? 'bg-red-500' : budgetPercent() > 70 ? 'bg-amber-500' : 'bg-gradient-primary'">
            </div>
          </div>
          <div class="flex justify-between text-xs text-slate-500 mt-2">
            <span>Spent: {{ selectedTrip()!.currency }} {{ totalActual() }}</span>
            <span>Remaining: {{ selectedTrip()!.currency }} {{ (selectedTrip()!.budget - totalActual()).toLocaleString() }}</span>
          </div>
        </div>

        <!-- Category breakdown -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div class="glass rounded-2xl p-5">
            <h3 class="font-semibold text-white mb-4">Category Breakdown</h3>
            <div class="space-y-4">
              @for (cat of categoryBreakdown(); track cat.name) {
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <div class="flex items-center gap-2">
                      <span>{{ cat.icon }}</span>
                      <span class="text-sm text-slate-300">{{ cat.name }}</span>
                    </div>
                    <div class="text-right">
                      <span class="text-white text-sm font-medium">{{ selectedTrip()!.currency }} {{ cat.actual }}</span>
                      <span class="text-slate-500 text-xs"> / {{ cat.planned }}</span>
                    </div>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width.%]="cat.planned > 0 ? (cat.actual / cat.planned) * 100 : 0"
                         [class]="(cat.actual / cat.planned) > 1 ? 'bg-red-500' : ''"></div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Donut chart simulation -->
          <div class="glass rounded-2xl p-5">
            <h3 class="font-semibold text-white mb-4">Spending Distribution</h3>
            <div class="flex items-center justify-center mb-4">
              <div class="relative w-40 h-40">
                <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90">
                  @for (segment of donutSegments(); track segment.category; let i = $index) {
                    <circle r="35" cx="50" cy="50"
                            fill="none"
                            [attr.stroke]="segment.color"
                            stroke-width="20"
                            [attr.stroke-dasharray]="segment.dash + ' ' + (220 - segment.dash)"
                            [attr.stroke-dashoffset]="-segment.offset"
                            class="transition-all"/>
                  }
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <p class="text-white font-bold text-lg">{{ budgetPercent() }}%</p>
                  <p class="text-slate-500 text-xs">Used</p>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2">
              @for (seg of donutSegments(); track seg.category) {
                <div class="flex items-center gap-2">
                  <div class="w-2.5 h-2.5 rounded-full" [style.background]="seg.color"></div>
                  <span class="text-xs text-slate-400 truncate">{{ seg.category }}</span>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Expense list -->
        <div class="glass rounded-2xl p-5">
          <h3 class="font-semibold text-white mb-4">All Expenses</h3>
          @if (selectedTrip()!.budgetItems.length === 0) {
            <p class="text-slate-500 text-center py-6">No expenses yet. Add your first expense!</p>
          } @else {
            <div class="space-y-3">
              @for (item of selectedTrip()!.budgetItems; track item.id) {
                <div class="flex items-center gap-4 p-3 rounded-xl hover:bg-white/3 transition-colors">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                       [class]="getCategoryBg(item.category)">{{ getCategoryIcon(item.category) }}</div>
                  <div class="flex-1 min-w-0">
                    <p class="text-white font-medium text-sm">{{ item.name }}</p>
                    <p class="text-slate-500 text-xs">{{ item.category | titlecase }}{{ item.date ? ' · ' + formatDate(item.date) : '' }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-white font-semibold text-sm">{{ selectedTrip()!.currency }} {{ item.planned.toLocaleString() }}</p>
                    @if (item.actual > 0) {
                      <p class="text-xs" [class]="item.actual > item.planned ? 'text-red-400' : 'text-emerald-400'">
                        actual: {{ item.actual.toLocaleString() }}
                      </p>
                    }
                  </div>
                </div>
              }
            </div>
          }
        </div>
      } @else {
        <div class="glass rounded-2xl p-16 text-center">
          <div class="text-5xl mb-4">💰</div>
          <p class="text-slate-400">Select a trip to view its budget</p>
        </div>
      }

      <!-- Add Expense Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" (click)="showModal.set(false)">
          <div class="glass-strong rounded-2xl p-6 w-full max-w-sm animate-slide-up" (click)="$event.stopPropagation()">
            <h2 class="font-display text-xl font-bold text-white mb-5">Add Expense</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm text-slate-300 mb-1.5">Name *</label>
                <input type="text" [(ngModel)]="newItem.name" placeholder="e.g. Hotel booking" class="input-field w-full px-4 py-2.5 rounded-xl text-sm">
              </div>
              <div>
                <label class="block text-sm text-slate-300 mb-1.5">Category</label>
                <select [(ngModel)]="newItem.category" class="input-field w-full px-4 py-2.5 rounded-xl text-sm">
                  <option value="accommodation">🏨 Accommodation</option>
                  <option value="transport">✈️ Transport</option>
                  <option value="food">🍽️ Food</option>
                  <option value="activities">🎯 Activities</option>
                  <option value="shopping">🛍️ Shopping</option>
                  <option value="other">📦 Other</option>
                </select>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm text-slate-300 mb-1.5">Planned</label>
                  <input type="number" [(ngModel)]="newItem.planned" placeholder="0" class="input-field w-full px-4 py-2.5 rounded-xl text-sm">
                </div>
                <div>
                  <label class="block text-sm text-slate-300 mb-1.5">Actual</label>
                  <input type="number" [(ngModel)]="newItem.actual" placeholder="0" class="input-field w-full px-4 py-2.5 rounded-xl text-sm">
                </div>
              </div>
              <div>
                <label class="block text-sm text-slate-300 mb-1.5">Date</label>
                <input type="date" [(ngModel)]="newItem.date" class="input-field w-full px-4 py-2.5 rounded-xl text-sm">
              </div>
            </div>
            <div class="flex gap-3 mt-5">
              <button (click)="showModal.set(false)" class="btn-secondary flex-1 py-2.5 rounded-xl text-sm">Cancel</button>
              <button (click)="addExpense()" class="btn-primary flex-1 py-2.5 rounded-xl text-sm font-semibold">Add</button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class BudgetComponent {
  trips = inject(TripService);
  selectedTripId = signal(this.trips.trips()[0]?.id || '');
  showModal = signal(false);
  Math = Math;

  newItem: Partial<BudgetItem> & { name: string; planned: number; actual: number } = { name: '', category: 'other', planned: 0, actual: 0, date: '' };

  selectedTrip = () => this.trips.trips().find(t => t.id === this.selectedTripId());
  totalPlanned = () => this.selectedTrip()?.budgetItems.reduce((s, i) => s + i.planned, 0) || 0;
  totalActual = () => this.selectedTrip()?.budgetItems.reduce((s, i) => s + i.actual, 0) || 0;
  budgetPercent = () => {
    const budget = this.selectedTrip()?.budget || 1;
    return Math.round((this.totalActual() / budget) * 100);
  };

  categoryBreakdown = () => {
    const trip = this.selectedTrip();
    if (!trip) return [];
    const cats = ['accommodation', 'transport', 'food', 'activities', 'shopping', 'other'];
    return cats.map(cat => ({
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      icon: this.getCategoryIcon(cat as any),
      planned: trip.budgetItems.filter(i => i.category === cat).reduce((s, i) => s + i.planned, 0),
      actual: trip.budgetItems.filter(i => i.category === cat).reduce((s, i) => s + i.actual, 0),
    })).filter(c => c.planned > 0 || c.actual > 0);
  };

  donutSegments = () => {
    const total = this.totalPlanned() || 1;
    const circumference = 220;
    let offset = 0;
    const colors = ['#0ea5e9', '#10b981', '#f97316', '#6366f1', '#ec4899', '#f59e0b'];
    return this.categoryBreakdown().map((cat, i) => {
      const dash = (cat.planned / total) * circumference;
      const seg = { category: cat.name, dash, offset, color: colors[i % colors.length] };
      offset += dash;
      return seg;
    });
  };

  addExpense() {
    if (!this.newItem.name || !this.selectedTripId()) return;
    this.trips.addBudgetItem(this.selectedTripId(), this.newItem as BudgetItem);
    this.newItem = { name: '', category: 'other', planned: 0, actual: 0, date: '' };
    this.showModal.set(false);
  }

  getCategoryIcon(cat: string): string {
    const m: Record<string, string> = { accommodation: '🏨', transport: '✈️', food: '🍽️', activities: '🎯', shopping: '🛍️', other: '📦' };
    return m[cat] || '📦';
  }

  getCategoryBg(cat: string): string {
    const m: Record<string, string> = { accommodation: 'bg-sky-500/20', transport: 'bg-blue-500/20', food: 'bg-orange-500/20', activities: 'bg-emerald-500/20', shopping: 'bg-pink-500/20', other: 'bg-slate-500/20' };
    return m[cat] || 'bg-slate-500/20';
  }

  formatDate(d: string) { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
}

import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TripService, PackingItem } from '../../services/trip.service';

@Component({
  selector: 'app-packing-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-5xl mx-auto animate-fade-in">
      <div class="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 class="font-display text-4xl font-bold text-white mb-1">Packing List 🧳</h1>
          <p class="text-slate-400">Never forget anything important again</p>
        </div>
        <button (click)="showModal.set(true)" class="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
          <span>➕</span> Add Item
        </button>
      </div>

      <!-- Trip selector -->
      <div class="glass rounded-2xl p-4 mb-6 flex items-center gap-4 flex-wrap">
        <span class="text-slate-400 text-sm">Trip:</span>
        <div class="flex flex-wrap gap-2">
          @for (trip of trips.trips(); track trip.id) {
            <button (click)="selectedTripId.set(trip.id)"
                    class="px-4 py-1.5 rounded-xl text-sm font-medium transition-all"
                    [class]="selectedTripId() === trip.id ? 'bg-gradient-primary text-white' : 'btn-secondary'">
              {{ trip.coverEmoji }} {{ trip.name }}
            </button>
          }
        </div>
      </div>

      @if (selectedTrip()) {
        <!-- Progress -->
        <div class="glass rounded-2xl p-5 mb-6">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-white">Packing Progress</h3>
            <span class="text-2xl font-display font-bold gradient-text">{{ packedCount() }}/{{ totalCount() }}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="progressPercent()"></div>
          </div>
          <div class="flex justify-between text-xs text-slate-500 mt-2">
            <span>{{ packedCount() }} items packed</span>
            <span>{{ progressPercent() }}% complete</span>
          </div>
        </div>

        <!-- Category filters -->
        <div class="flex flex-wrap gap-2 mb-5">
          @for (cat of categories; track cat.value) {
            <button (click)="filterCategory.set(cat.value)"
                    class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                    [class]="filterCategory() === cat.value ? 'bg-gradient-primary text-white shadow-glow' : 'glass text-slate-400 hover:text-white'">
              {{ cat.icon }} {{ cat.label }}
              <span class="text-xs opacity-70">({{ getCategoryCount(cat.value) }})</span>
            </button>
          }
        </div>

        <!-- Items grid by category -->
        @for (cat of getActiveCategories(); track cat) {
          <div class="mb-6">
            <h3 class="font-semibold text-slate-300 mb-3 flex items-center gap-2">
              {{ getCategoryIcon(cat) }} {{ cat | titlecase }}
              <span class="text-xs text-slate-500">({{ getCategoryItems(cat).length }})</span>
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              @for (item of getCategoryItems(cat); track item.id) {
                <div class="glass rounded-xl p-4 flex items-start gap-3 cursor-pointer hover:bg-white/5 transition-all group"
                     (click)="toggleItem(item.id)"
                     [class.opacity-60]="item.packed">
                  <div class="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                       [class]="item.packed ? 'bg-emerald-500' : 'border-2 border-slate-600 group-hover:border-sky-500'">
                    @if (item.packed) { <span class="text-white text-xs">✓</span> }
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium transition-all" [class]="item.packed ? 'text-slate-500 line-through' : 'text-white'">
                      {{ item.name }}
                    </p>
                    <div class="flex items-center gap-2 mt-1">
                      @if (item.essential) {
                        <span class="badge badge-danger text-xs">Essential</span>
                      }
                      @if (item.quantity > 1) {
                        <span class="text-slate-500 text-xs">×{{ item.quantity }}</span>
                      }
                    </div>
                  </div>
                  <button (click)="$event.stopPropagation(); removeItem(item.id)" class="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-sm">✕</button>
                </div>
              }
            </div>
          </div>
        }

        <!-- Quick add templates -->
        <div class="glass rounded-2xl p-5 mt-4">
          <h3 class="font-semibold text-white mb-4">Quick Add Templates</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            @for (template of templates; track template.name) {
              <button (click)="addTemplate(template)" class="glass rounded-xl p-4 text-left hover:bg-white/5 transition-all group">
                <div class="text-2xl mb-2">{{ template.icon }}</div>
                <p class="text-white font-medium text-sm group-hover:text-sky-400 transition-colors">{{ template.name }}</p>
                <p class="text-slate-500 text-xs">{{ template.items.length }} items</p>
              </button>
            }
          </div>
        </div>
      } @else {
        <div class="glass rounded-2xl p-16 text-center">
          <div class="text-5xl mb-4">🧳</div>
          <p class="text-slate-400">Select a trip to manage its packing list</p>
        </div>
      }

      <!-- Add Item Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" (click)="showModal.set(false)">
          <div class="glass-strong rounded-2xl p-6 w-full max-w-sm animate-slide-up" (click)="$event.stopPropagation()">
            <h2 class="font-display text-xl font-bold text-white mb-5">Add Packing Item</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm text-slate-300 mb-1.5">Item Name *</label>
                <input type="text" [(ngModel)]="newItem.name" placeholder="e.g. Passport" class="input-field w-full px-4 py-2.5 rounded-xl text-sm">
              </div>
              <div>
                <label class="block text-sm text-slate-300 mb-1.5">Category</label>
                <select [(ngModel)]="newItem.category" class="input-field w-full px-4 py-2.5 rounded-xl text-sm">
                  @for (cat of categories.slice(1); track cat.value) {
                    <option [value]="cat.value">{{ cat.icon }} {{ cat.label }}</option>
                  }
                </select>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm text-slate-300 mb-1.5">Quantity</label>
                  <input type="number" [(ngModel)]="newItem.quantity" min="1" class="input-field w-full px-4 py-2.5 rounded-xl text-sm">
                </div>
                <div class="flex items-end pb-0.5">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" [(ngModel)]="newItem.essential" class="w-4 h-4 accent-sky-500">
                    <span class="text-sm text-slate-300">Essential</span>
                  </label>
                </div>
              </div>
            </div>
            <div class="flex gap-3 mt-5">
              <button (click)="showModal.set(false)" class="btn-secondary flex-1 py-2.5 rounded-xl text-sm">Cancel</button>
              <button (click)="addItem()" class="btn-primary flex-1 py-2.5 rounded-xl text-sm font-semibold">Add Item</button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class PackingListComponent {
  trips = inject(TripService);
  selectedTripId = signal(this.trips.trips()[0]?.id || '');
  showModal = signal(false);
  filterCategory = signal('all');

  newItem = { name: '', category: 'other' as PackingItem['category'], quantity: 1, essential: false };

  categories = [
    { value: 'all', label: 'All Items', icon: '📦' },
    { value: 'documents', label: 'Documents', icon: '📄' },
    { value: 'clothing', label: 'Clothing', icon: '👕' },
    { value: 'toiletries', label: 'Toiletries', icon: '🧴' },
    { value: 'electronics', label: 'Electronics', icon: '📱' },
    { value: 'health', label: 'Health', icon: '💊' },
    { value: 'other', label: 'Other', icon: '🎒' },
  ];

  templates = [
    { name: 'Beach Trip', icon: '🏖️', items: ['Swimsuit', 'Sunscreen', 'Sunglasses', 'Beach towel', 'Flip flops', 'Water bottle'] },
    { name: 'City Break', icon: '🏙️', items: ['Comfortable shoes', 'Day backpack', 'City map/guide', 'Portable charger', 'Reusable bag'] },
    { name: 'Adventure Trip', icon: '🏔️', items: ['Hiking boots', 'First aid kit', 'Water purifier', 'Headlamp', 'Rain jacket', 'Trekking poles'] },
  ];

  selectedTrip = () => this.trips.trips().find(t => t.id === this.selectedTripId());

  items = () => {
    const trip = this.selectedTrip();
    if (!trip) return [];
    const cat = this.filterCategory();
    return cat === 'all' ? trip.packingItems : trip.packingItems.filter(i => i.category === cat);
  };

  totalCount = () => this.selectedTrip()?.packingItems.length || 0;
  packedCount = () => this.selectedTrip()?.packingItems.filter(i => i.packed).length || 0;
  progressPercent = () => this.totalCount() === 0 ? 0 : Math.round((this.packedCount() / this.totalCount()) * 100);

  getCategoryCount(cat: string) {
    if (cat === 'all') return this.totalCount();
    return this.selectedTrip()?.packingItems.filter(i => i.category === cat).length || 0;
  }

  getActiveCategories(): string[] {
    if (this.filterCategory() !== 'all') return [this.filterCategory()];
    const trip = this.selectedTrip();
    if (!trip) return [];
    return [...new Set(trip.packingItems.map(i => i.category))];
  }

  getCategoryItems(cat: string) {
    return this.selectedTrip()?.packingItems.filter(i => i.category === cat) || [];
  }

  getCategoryIcon(cat: string) {
    return this.categories.find(c => c.value === cat)?.icon || '📦';
  }

  toggleItem(itemId: string) {
    this.trips.togglePackingItem(this.selectedTripId(), itemId);
  }

  removeItem(itemId: string) {
    const trip = this.selectedTrip();
    if (!trip) return;
    const updated = { ...trip, packingItems: trip.packingItems.filter(i => i.id !== itemId) };
    this.trips.updateTrip(trip.id, updated);
  }

  addItem() {
    if (!this.newItem.name || !this.selectedTripId()) return;
    this.trips.addPackingItem(this.selectedTripId(), { ...this.newItem, packed: false });
    this.newItem = { name: '', category: 'other', quantity: 1, essential: false };
    this.showModal.set(false);
  }

  addTemplate(template: { name: string; icon: string; items: string[] }) {
    const tripId = this.selectedTripId();
    if (!tripId) return;
    template.items.forEach(name => {
      this.trips.addPackingItem(tripId, { name, category: 'other', packed: false, essential: false, quantity: 1 });
    });
  }
}

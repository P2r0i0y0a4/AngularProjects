import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Destination {
  id: string;
  name: string;
  country: string;
  continent: string;
  emoji: string;
  description: string;
  bestTime: string;
  avgCost: string;
  rating: number;
  tags: string[];
  highlights: string[];
  climate: string;
  bg: string;
}

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="p-6 max-w-7xl mx-auto animate-fade-in">
      <div class="mb-8">
        <h1 class="font-display text-4xl font-bold text-white mb-1">Explore Destinations 🔭</h1>
        <p class="text-slate-400">Discover your next adventure</p>
      </div>

      <!-- Search & Filters -->
      <div class="glass rounded-2xl p-5 mb-6">
        <div class="flex flex-col sm:flex-row gap-3 mb-4">
          <div class="relative flex-1">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
            <input type="text" [(ngModel)]="searchQuery" placeholder="Search destinations..."
                   class="input-field w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                   (input)="updateFilter()">
          </div>
          <select [(ngModel)]="selectedContinent" (change)="updateFilter()" class="input-field px-4 py-3 rounded-xl text-sm">
            <option value="">All Continents</option>
            <option>Asia</option><option>Europe</option><option>Americas</option><option>Africa</option><option>Oceania</option>
          </select>
        </div>

        <!-- Tag filters -->
        <div class="flex flex-wrap gap-2">
          @for (tag of allTags; track tag) {
            <button (click)="toggleTag(tag)"
                    class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    [class]="selectedTags().includes(tag) ? 'bg-gradient-primary text-white' : 'glass text-slate-400 hover:text-white'">
              {{ tag }}
            </button>
          }
        </div>
      </div>

      <!-- Results count -->
      <p class="text-slate-500 text-sm mb-4">{{ filteredDestinations().length }} destinations found</p>

      <!-- Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        @for (dest of filteredDestinations(); track dest.id) {
          <div class="glass rounded-2xl overflow-hidden card-hover cursor-pointer group"
               (click)="selectedDest.set(dest)">
            <div class="h-40 flex items-center justify-center relative overflow-hidden" [class]="dest.bg">
              <div class="text-7xl group-hover:scale-110 transition-transform duration-300">{{ dest.emoji }}</div>
              <div class="absolute top-3 right-3 flex gap-1 flex-wrap justify-end">
                @for (tag of dest.tags.slice(0,2); track tag) {
                  <span class="badge badge-primary text-xs">{{ tag }}</span>
                }
              </div>
            </div>
            <div class="p-5">
              <div class="flex items-start justify-between mb-2">
                <div>
                  <h3 class="font-bold text-white text-lg group-hover:text-sky-400 transition-colors">{{ dest.name }}</h3>
                  <p class="text-slate-400 text-sm">🌍 {{ dest.country }} · {{ dest.continent }}</p>
                </div>
                <div class="flex">
                  @for (s of [1,2,3,4,5]; track s) {
                    <span class="text-xs" [class]="s <= dest.rating ? 'text-yellow-400' : 'text-slate-700'">★</span>
                  }
                </div>
              </div>
              <p class="text-slate-400 text-xs leading-relaxed mb-3 line-clamp-2">{{ dest.description }}</p>
              <div class="flex items-center justify-between text-xs">
                <span class="text-slate-500">🕐 Best: {{ dest.bestTime }}</span>
                <span class="text-emerald-400 font-medium">{{ dest.avgCost }}</span>
              </div>
            </div>
          </div>
        }
      </div>

      @if (filteredDestinations().length === 0) {
        <div class="glass rounded-2xl p-12 text-center mt-4">
          <div class="text-4xl mb-3">🔭</div>
          <p class="text-slate-400">No destinations match your filters</p>
          <button (click)="clearFilters()" class="btn-primary px-5 py-2 rounded-xl text-sm mt-4">Clear Filters</button>
        </div>
      }

      <!-- Destination detail modal -->
      @if (selectedDest()) {
        <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" (click)="selectedDest.set(null)">
          <div class="glass-strong rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up" (click)="$event.stopPropagation()">
            <div class="h-48 flex items-center justify-center relative" [class]="selectedDest()!.bg">
              <div class="text-8xl">{{ selectedDest()!.emoji }}</div>
              <button (click)="selectedDest.set(null)" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors">✕</button>
            </div>
            <div class="p-6">
              <div class="flex items-start justify-between mb-1">
                <h2 class="font-display text-2xl font-bold text-white">{{ selectedDest()!.name }}</h2>
                <div class="flex">
                  @for (s of [1,2,3,4,5]; track s) {
                    <span [class]="s <= selectedDest()!.rating ? 'text-yellow-400' : 'text-slate-700'">★</span>
                  }
                </div>
              </div>
              <p class="text-slate-400 text-sm mb-4">{{ selectedDest()!.country }} · {{ selectedDest()!.continent }}</p>
              <p class="text-slate-300 text-sm leading-relaxed mb-5">{{ selectedDest()!.description }}</p>

              <div class="grid grid-cols-2 gap-3 mb-5">
                <div class="glass rounded-xl p-3">
                  <p class="text-slate-500 text-xs mb-1">Best Time</p>
                  <p class="text-white text-sm font-medium">{{ selectedDest()!.bestTime }}</p>
                </div>
                <div class="glass rounded-xl p-3">
                  <p class="text-slate-500 text-xs mb-1">Average Cost</p>
                  <p class="text-emerald-400 text-sm font-medium">{{ selectedDest()!.avgCost }}</p>
                </div>
                <div class="glass rounded-xl p-3">
                  <p class="text-slate-500 text-xs mb-1">Climate</p>
                  <p class="text-white text-sm font-medium">{{ selectedDest()!.climate }}</p>
                </div>
              </div>

              <div class="mb-5">
                <h4 class="text-white font-semibold mb-2">🌟 Highlights</h4>
                <div class="space-y-1.5">
                  @for (h of selectedDest()!.highlights; track h) {
                    <div class="flex items-center gap-2 text-sm text-slate-300">
                      <span class="w-1.5 h-1.5 rounded-full bg-sky-400"></span> {{ h }}
                    </div>
                  }
                </div>
              </div>

              <div class="flex flex-wrap gap-2 mb-5">
                @for (tag of selectedDest()!.tags; track tag) {
                  <span class="badge badge-primary">{{ tag }}</span>
                }
              </div>

              <a routerLink="/trips" (click)="selectedDest.set(null)"
                 class="btn-primary w-full py-3 rounded-xl text-sm font-semibold text-center block">
                ✈️ Plan a Trip Here
              </a>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class ExploreComponent {
  searchQuery = '';
  selectedContinent = '';
  selectedTags = signal<string[]>([]);
  selectedDest = signal<Destination | null>(null);

  allTags = ['Beach', 'Culture', 'Adventure', 'Food', 'History', 'Nature', 'Luxury', 'Budget', 'Romantic', 'Family'];

  destinations: Destination[] = [
    { id: '1', name: 'Kyoto', country: 'Japan', continent: 'Asia', emoji: '⛩️', description: 'Ancient capital of Japan with stunning temples, traditional tea houses, and mesmerizing geisha culture.', bestTime: 'Mar–May, Oct–Nov', avgCost: '$120/day', rating: 5, tags: ['Culture', 'History', 'Nature'], highlights: ['Fushimi Inari Shrine', 'Arashiyama Bamboo Grove', 'Geisha district Gion', 'Traditional ryokan stays'], climate: 'Temperate', bg: 'bg-gradient-to-br from-red-800/40 to-orange-700/30' },
    { id: '2', name: 'Santorini', country: 'Greece', continent: 'Europe', emoji: '🏛️', description: 'Iconic whitewashed villages perched on volcanic cliffs with breathtaking sunsets and azure waters.', bestTime: 'May–Oct', avgCost: '$180/day', rating: 5, tags: ['Romantic', 'Beach', 'Luxury'], highlights: ['Oia sunset views', 'Caldera boat tours', 'Akrotiri ruins', 'Local wine tasting'], climate: 'Mediterranean', bg: 'bg-gradient-to-br from-blue-700/40 to-sky-600/30' },
    { id: '3', name: 'Machu Picchu', country: 'Peru', continent: 'Americas', emoji: '🏔️', description: 'Mystical Incan citadel perched high in the Andes, one of the world\'s most iconic archaeological sites.', bestTime: 'May–Sep', avgCost: '$90/day', rating: 5, tags: ['Adventure', 'History', 'Nature'], highlights: ['Sun Gate hike', 'Huayna Picchu peak', 'Incan Trail trek', 'Sacred Valley tours'], climate: 'Subtropical highland', bg: 'bg-gradient-to-br from-emerald-800/40 to-teal-700/30' },
    { id: '4', name: 'Maldives', country: 'Maldives', continent: 'Asia', emoji: '🌊', description: 'Paradise of overwater bungalows, crystal-clear lagoons, and some of the world\'s finest coral reefs.', bestTime: 'Nov–Apr', avgCost: '$350/day', rating: 5, tags: ['Beach', 'Luxury', 'Romantic'], highlights: ['Overwater bungalows', 'Snorkeling & diving', 'Sunset dolphin cruises', 'Underwater dining'], climate: 'Tropical', bg: 'bg-gradient-to-br from-cyan-700/40 to-blue-600/30' },
    { id: '5', name: 'Serengeti', country: 'Tanzania', continent: 'Africa', emoji: '🦁', description: 'Witness the Great Migration across endless golden savannah in one of Africa\'s finest wildlife sanctuaries.', bestTime: 'Jun–Oct', avgCost: '$200/day', rating: 5, tags: ['Adventure', 'Nature', 'Family'], highlights: ['Great Migration', 'Big Five game drives', 'Hot air balloon safaris', 'Maasai village visits'], climate: 'Tropical savanna', bg: 'bg-gradient-to-br from-amber-700/40 to-yellow-600/30' },
    { id: '6', name: 'Amalfi Coast', country: 'Italy', continent: 'Europe', emoji: '🚢', description: 'Dramatic cliffside villages, turquoise waters, and exquisite cuisine along Italy\'s most scenic coastline.', bestTime: 'Apr–Jun, Sep–Oct', avgCost: '$150/day', rating: 5, tags: ['Romantic', 'Food', 'Culture'], highlights: ['Positano village', 'Boat to Capri', 'Fresh limoncello', 'Coastal hiking paths'], climate: 'Mediterranean', bg: 'bg-gradient-to-br from-teal-700/40 to-blue-600/30' },
    { id: '7', name: 'Bali', country: 'Indonesia', continent: 'Asia', emoji: '🌴', description: 'Island of the Gods with lush rice terraces, sacred temples, world-class surf, and vibrant arts scene.', bestTime: 'Apr–Oct', avgCost: '$70/day', rating: 5, tags: ['Beach', 'Culture', 'Budget'], highlights: ['Ubud rice terraces', 'Tanah Lot temple', 'Seminyak beach clubs', 'Traditional kecak dance'], climate: 'Tropical', bg: 'bg-gradient-to-br from-green-700/40 to-emerald-600/30' },
    { id: '8', name: 'Iceland', country: 'Iceland', continent: 'Europe', emoji: '🌋', description: 'Land of fire and ice with dramatic landscapes, Northern Lights, midnight sun, and geothermal wonders.', bestTime: 'Jun–Aug, Dec–Feb', avgCost: '$200/day', rating: 5, tags: ['Adventure', 'Nature', 'Romantic'], highlights: ['Northern Lights', 'Golden Circle', 'Blue Lagoon', 'Glacier hiking'], climate: 'Subarctic', bg: 'bg-gradient-to-br from-indigo-700/40 to-purple-600/30' },
    { id: '9', name: 'New York City', country: 'USA', continent: 'Americas', emoji: '🗽', description: 'The city that never sleeps—iconic skyline, world-class arts, diverse cuisine, and endless energy.', bestTime: 'Apr–Jun, Sep–Nov', avgCost: '$200/day', rating: 4, tags: ['Culture', 'Food', 'Family'], highlights: ['Central Park', 'Brooklyn Bridge', 'Times Square', 'Metropolitan Museum'], climate: 'Humid continental', bg: 'bg-gradient-to-br from-slate-700/40 to-gray-600/30' },
  ];

  filteredDestinations = computed(() => {
    let result = this.destinations;
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(d => d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q) || d.description.toLowerCase().includes(q));
    }
    if (this.selectedContinent) {
      result = result.filter(d => d.continent === this.selectedContinent);
    }
    if (this.selectedTags().length > 0) {
      result = result.filter(d => this.selectedTags().some(t => d.tags.includes(t)));
    }
    return result;
  });

  toggleTag(tag: string) {
    this.selectedTags.update(tags => tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]);
  }

  updateFilter() { /* triggers computed */ }

  clearFilters() {
    this.searchQuery = '';
    this.selectedContinent = '';
    this.selectedTags.set([]);
  }
}

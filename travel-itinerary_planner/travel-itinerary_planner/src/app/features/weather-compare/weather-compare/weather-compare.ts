import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TripService as TS } from '../../../core/services/trip.service';

@Component({
  selector: 'app-weather',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="weather-pg">
    <h2 class="page-title">🌤 Destination Weather</h2>
    <p class="page-sub">Check weather for your trip destinations before you pack</p>

    <div class="search-row">
      <input type="text" class="w-search" placeholder="Search destination…" [(ngModel)]="searchQuery" />
      <div class="trip-chips">
        @for (trip of tripService.trips(); track trip.id) {
          <button class="chip" [class.active]="selectedDest() === trip.destination" (click)="selectedDest.set(trip.destination)">
            {{ trip.destination }}
          </button>
        }
      </div>
    </div>

    <div class="w-hero">
      <div class="w-hero-left">
        <h2>{{ selectedDest() }}</h2>
        <p>{{ activeTripDateRange() }}</p>
      </div>
      <div class="w-hero-right">
        <div class="big-temp">{{ weather().temp }}</div>
        <div class="big-desc">{{ weather().desc }}</div>
      </div>
    </div>

    <div class="forecast-grid">
      @for (day of weather().forecast; track day.day; let i = $index) {
        <div class="forecast-card" [class.today]="i === 0">
          <div class="fc-day">{{ i === 0 ? 'Today' : day.day }}</div>
          <div class="fc-ico">{{ day.ico }}</div>
          <div class="fc-high">{{ day.h }}</div>
          <div class="fc-low">{{ day.l }}</div>
        </div>
      }
    </div>

    <div class="detail-grid">
      @for (d of weatherDetails(); track d.label) {
        <div class="detail-card">
          <div class="detail-ico">{{ d.ico }}</div>
          <div class="detail-val">{{ d.val }}</div>
          <div class="detail-label">{{ d.label }}</div>
        </div>
      }
    </div>
  </div>
  `,
  styles: [`
    .weather-pg { max-width:960px; margin:0 auto; padding:2rem 1.5rem; }
    .page-title { font-family:'Cormorant Garamond',serif; font-size:2rem; margin-bottom:6px; }
    .page-sub { color:#8a7f74; font-size:14px; margin-bottom:1.5rem; }
    .search-row { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:1.5rem; align-items:center; }
    .w-search { padding:10px 16px; border:1.5px solid #ddd3c2; border-radius:30px; font-size:14px; font-family:'DM Sans',sans-serif; outline:none; min-width:220px; }
    .w-search:focus { border-color:#1a6b9e; }
    .trip-chips { display:flex; gap:8px; flex-wrap:wrap; }
    .chip { padding:8px 15px; border-radius:30px; border:1.5px solid #ddd3c2; background:#fff; font-size:13px; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all .2s; }
    .chip:hover { border-color:#1a6b9e; color:#1a6b9e; }
    .chip.active { background:#16120e; border-color:#16120e; color:#f7f2ea; }
    .w-hero { background:#16120e; border-radius:22px; padding:2.5rem; margin-bottom:1.5rem; display:flex; justify-content:space-between; align-items:center; }
    .w-hero-left h2 { font-family:'Cormorant Garamond',serif; font-size:2rem; color:#f7f2ea; margin-bottom:6px; }
    .w-hero-left p { color:#8a7f74; font-size:14px; margin:0; }
    .big-temp { font-family:'Cormorant Garamond',serif; font-size:4rem; font-weight:700; color:#f7f2ea; }
    .big-desc { color:#8a7f74; font-size:14px; }
    .forecast-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:10px; margin-bottom:1.5rem; }
    .forecast-card { background:#fff; border-radius:14px; padding:14px 10px; text-align:center; box-shadow:0 2px 12px rgba(22,18,14,.07); }
    .forecast-card.today { background:#1a6b9e; color:#fff; }
    .fc-day { font-size:12px; font-weight:600; margin-bottom:8px; }
    .fc-ico { font-size:1.8rem; margin-bottom:6px; }
    .fc-high { font-size:14px; font-weight:600; }
    .fc-low { font-size:12px; opacity:.6; }
    .detail-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
    .detail-card { background:#fff; border-radius:14px; padding:1.2rem; text-align:center; box-shadow:0 2px 12px rgba(22,18,14,.07); }
    .detail-ico { font-size:1.6rem; margin-bottom:8px; }
    .detail-val { font-family:'Cormorant Garamond',serif; font-size:1.3rem; font-weight:600; margin-bottom:4px; }
    .detail-label { font-size:12px; color:#8a7f74; }
  `]
})
export class Weather {
  tripService  = inject(TripService);
  searchQuery  = '';
  selectedDest = signal(this.tripService.trips()[0]?.destination || 'Paris, France');

  weather = computed(() => this.tripService.getWeatherForDestination(this.selectedDest()));

  activeTripDateRange = computed(() => {
    const trip = this.tripService.trips().find(t => t.destination === this.selectedDest());
    if (!trip) return 'Select a trip above';
    const s = new Date(trip.startDate).toLocaleDateString('en-IN', { month:'short', day:'numeric' });
    const e = new Date(trip.endDate).toLocaleDateString('en-IN', { month:'short', day:'numeric', year:'numeric' });
    return s + ' – ' + e;
  });

  weatherDetails = computed(() => [
    { ico:'💧', val: this.weather().humidity,    label:'Humidity'    },
    { ico:'💨', val: this.weather().wind,        label:'Wind Speed'  },
    { ico:'☀️', val: this.weather().uv,          label:'UV Index'    },
    { ico:'👁',  val: this.weather().visibility,  label:'Visibility'  }
  ]);
}


import { Component as Comp2, signal as sig2, computed as comp2, inject as inj2 } from '@angular/core';
import { CommonModule as CM } from '@angular/common';
import { TripService } from '../../../core/services/trip.service';
import { CompareRow } from '../../../core/models/trip.model';

@Comp2({
  selector: 'app-compare',
  imports: [CM],
  template: `
  <div class="compare-pg">
    <h2 class="page-title">⚖️ Compare Trips</h2>
    <p class="page-sub">Side-by-side comparison to help you prioritise</p>

    <div class="selector-row">
      <div class="selector-group">
        <label>Trip A</label>
        <select (change)="tripAId.set(getVal($event))">
          @for (t of svc.trips(); track t.id) { <option [value]="t.id">{{ t.title }}</option> }
        </select>
      </div>
      <div class="vs-divider">VS</div>
      <div class="selector-group">
        <label>Trip B</label>
        <select (change)="tripBId.set(getVal($event))">
          @for (t of svc.trips(); track t.id; let i = $index) {
            <option [value]="t.id" [selected]="i === 1">{{ t.title }}</option>
          }
        </select>
      </div>
    </div>

    @if (tripA() && tripB() && tripA()!.id !== tripB()!.id) {
      <div class="compare-table">
        <div class="cmp-hdr">
          <div class="cmp-metric">Metric</div>
          <div class="cmp-val"><img class="trip-thumb" [src]="tripA()!.coverImage" alt=""/> {{ tripA()!.title }}</div>
          <div class="cmp-val"><img class="trip-thumb" [src]="tripB()!.coverImage" alt=""/> {{ tripB()!.title }}</div>
        </div>
        @for (row of compareRows(); track row.label) {
          <div class="cmp-row">
            <div class="cmp-metric">{{ row.icon }} {{ row.label }}</div>
            <div class="cmp-val" [class.win]="row.winA" [class.lose]="!row.winA && (row.winA || row.winB)">
              {{ row.valA }} @if (row.winA) { <span>🏆</span> }
            </div>
            <div class="cmp-val" [class.win]="row.winB" [class.lose]="!row.winB && (row.winA || row.winB)">
              {{ row.valB }} @if (row.winB) { <span>🏆</span> }
            </div>
          </div>
        }
      </div>
    } @else {
      <div class="cmp-placeholder"><div style="font-size:2.5rem;margin-bottom:1rem">⚖️</div><p>Select two different trips to compare.</p></div>
    }
  </div>
  `,
  styles: [`
    .compare-pg { max-width:960px; margin:0 auto; padding:2rem 1.5rem; }
    .page-title { font-family:'Cormorant Garamond',serif; font-size:2rem; margin-bottom:6px; }
    .page-sub { color:#8a7f74; font-size:14px; margin-bottom:1.5rem; }
    .selector-row { display:flex; gap:16px; align-items:center; margin-bottom:2rem; flex-wrap:wrap; }
    .selector-group { flex:1; min-width:180px; display:flex; flex-direction:column; gap:5px; }
    .selector-group label { font-size:12px; font-weight:600; color:#8a7f74; text-transform:uppercase; letter-spacing:.05em; }
    .selector-group select { padding:11px 14px; border:1.5px solid #ddd3c2; border-radius:8px; font-size:14px; font-family:'DM Sans',sans-serif; outline:none; background:#fff; }
    .vs-divider { font-family:'Cormorant Garamond',serif; font-size:1.5rem; font-weight:700; color:#8a7f74; padding:0 8px; }
    .compare-table { background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 2px 16px rgba(22,18,14,.09); }
    .cmp-hdr { display:grid; grid-template-columns:180px 1fr 1fr; background:#16120e; color:#f7f2ea; font-size:13px; font-weight:600; }
    .cmp-hdr .cmp-metric,.cmp-hdr .cmp-val { padding:14px 16px; display:flex; align-items:center; gap:10px; }
    .trip-thumb { width:32px; height:32px; border-radius:6px; object-fit:cover; flex-shrink:0; }
    .cmp-row { display:grid; grid-template-columns:180px 1fr 1fr; border-bottom:1px solid #ede6d8; }
    .cmp-row:last-child { border-bottom:none; }
    .cmp-metric { padding:14px 16px; font-size:13px; color:#8a7f74; background:#f7f2ea; display:flex; align-items:center; gap:8px; }
    .cmp-val { padding:14px 16px; font-size:13.5px; font-weight:500; display:flex; align-items:center; gap:6px; }
    .cmp-val.win { color:#2d7a50; font-weight:700; background:#e5f4ec; }
    .cmp-val.lose { color:#8a7f74; }
    .cmp-placeholder { text-align:center; padding:4rem; color:#8a7f74; background:#fff; border-radius:16px; box-shadow:0 2px 16px rgba(22,18,14,.09); }
  `]
})
export class Compare {
  svc     = inj2(TS);
  tripAId = sig2(this.svc.trips()[0]?.id || '');
  tripBId = sig2(this.svc.trips()[1]?.id || '');
  tripA   = comp2(() => this.svc.getTripById(this.tripAId()));
  tripB   = comp2(() => this.svc.getTripById(this.tripBId()));

  compareRows = comp2((): CompareRow[] => {
    const a = this.tripA(), b = this.tripB();
    if (!a || !b || a.id === b.id) return [];
    const daysA = this.svc.getDayCount(a), daysB = this.svc.getDayCount(b);
    const spentA = this.svc.getBudgetSummary(a).spent, spentB = this.svc.getBudgetSummary(b).spent;
    const actsA  = a.days.reduce((s, d) => s + d.activities.length, 0);
    const actsB  = b.days.reduce((s, d) => s + d.activities.length, 0);
    const pdA    = daysA ? Math.round(a.budget / daysA) : 0;
    const pdB    = daysB ? Math.round(b.budget / daysB) : 0;
    return [
      { icon:'📍', label:'Destination',        valA:a.destination,                         valB:b.destination,                         winA:false, winB:false },
      { icon:'📅', label:'Duration',           valA:daysA+'d',                             valB:daysB+'d',                             winA:daysA>daysB, winB:daysB>daysA },
      { icon:'💰', label:'Total Budget',       valA:a.currency+a.budget.toLocaleString(),  valB:b.currency+b.budget.toLocaleString(),  winA:a.budget>b.budget, winB:b.budget>a.budget },
      { icon:'💸', label:'Amount Spent',       valA:a.currency+spentA.toLocaleString(),    valB:b.currency+spentB.toLocaleString(),    winA:spentA<spentB, winB:spentB<spentA },
      { icon:'📊', label:'Budget / Day',       valA:a.currency+pdA.toLocaleString(),       valB:b.currency+pdB.toLocaleString(),       winA:pdA<pdB, winB:pdB<pdA },
      { icon:'🎯', label:'Activities Planned', valA:actsA,                                 valB:actsB,                                 winA:actsA>actsB, winB:actsB>actsA },
      { icon:'🧭', label:'Trip Type',          valA:a.type,                                valB:b.type,                                winA:false, winB:false },
      { icon:'🔖', label:'Status',             valA:a.status,                              valB:b.status,                              winA:false, winB:false },
      { icon:'👥', label:'Companions',         valA:a.companions,                          valB:b.companions,                          winA:false, winB:false }
    ];
  });

  getVal(e: Event): string { return (e.target as HTMLSelectElement).value; }
}
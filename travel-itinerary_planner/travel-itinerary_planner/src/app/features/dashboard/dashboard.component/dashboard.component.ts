import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TripService } from '../../../core/services/trip.service';
import { Trip } from '../../../core/models/trip.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, FormsModule, DatePipe, DecimalPipe, TitleCasePipe],
  template: `
  <div class="dashboard">

    <div class="dash-hero">
      <div class="glow1"></div>
      <div class="glow2"></div>
      <div class="dash-top">
        <div class="hero-text">
          <h1>Welcome back,<br/>Explorer 🌍</h1>
          @if (tripService.upcomingTrips().length > 0) {
            <p>You have {{ tripService.upcomingTrips().length }} upcoming trip{{ tripService.upcomingTrips().length > 1 ? 's' : '' }}</p>
          } @else {
            <p>No upcoming trips — plan one! ✈️</p>
          }
        </div>
        <div class="kpi-row">
          @for (k of kpis(); track k.label) {
            <div class="kpi-card">
              <span class="kpi-val">{{ k.value }}</span>
              <span class="kpi-lab">{{ k.label }}</span>
            </div>
          }
        </div>
      </div>

      <div class="countdown-strip">
        @for (trip of tripService.upcomingTrips().slice(0, 3); track trip.id) {
          <div class="cd-card" [routerLink]="['/trips', trip.id]">
            <div class="cd-days">{{ tripService.getDaysUntil(trip) > 0 ? tripService.getDaysUntil(trip) : 'Now' }}</div>
            <div class="cd-info">
              <p>{{ trip.title }}</p>
              <span>{{ trip.destination }}</span>
            </div>
          </div>
        } @empty {
          <p class="no-upcoming">Plan your first trip to see countdowns here!</p>
        }
      </div>
    </div>

    <div class="controls-row">
      <div class="search-wrap">
        <span class="s-icon">🔍</span>
        <input type="text" placeholder="Search trips…" [(ngModel)]="searchQuery" />
      </div>
      <div class="view-toggle">
        <button [class.active]="viewMode() === 'grid'" (click)="viewMode.set('grid')">⊞</button>
        <button [class.active]="viewMode() === 'list'" (click)="viewMode.set('list')">☰</button>
      </div>
      <div class="chips">
        @for (tab of filterTabs; track tab.value) {
          <button class="chip" [class.active]="activeFilter() === tab.value" (click)="activeFilter.set(tab.value)">
            {{ tab.label }} <span class="chip-n">{{ getCount(tab.value) }}</span>
          </button>
        }
      </div>
    </div>

    @if (viewMode() === 'grid') {
      <div class="trips-grid">
        @for (trip of filteredTrips(); track trip.id) {
          <div class="trip-card" [routerLink]="['/trips', trip.id]">
            <div class="card-cover" [style.background-image]="'url(' + trip.coverImage + ')'">
              <div class="cover-overlay"></div>
              <div class="cover-btm">
                <span class="dest-lbl">{{ trip.destination }}</span>
                <span class="status-badge" [class]="'sb-' + trip.status">{{ trip.status | titlecase }}</span>
              </div>
            </div>
            <div class="card-body">
              <h3>{{ trip.title }}</h3>
              <div class="card-meta">
                <span>📅 {{ trip.startDate | date:'MMM d' }} – {{ trip.endDate | date:'MMM d, y' }}</span>
                <span class="tag">{{ tripService.getDayCount(trip) }}d</span>
                <span class="tag">{{ trip.type }}</span>
              </div>
              <div class="budget-row">
                <div class="b-nums">
                  <span>{{ trip.currency }}{{ trip.budget | number }}</span>
                  <span class="spent-lbl">{{ trip.currency }}{{ trip.spent | number }} spent</span>
                </div>
                <div class="prog-track">
                  <div class="prog-fill" [style.width.%]="getBudgetPct(trip)" [class.warn]="getBudgetPct(trip)>=70" [class.over]="getBudgetPct(trip)>=90"></div>
                </div>
              </div>
              <div class="card-foot">
                <button class="btn-view" [routerLink]="['/trips', trip.id]" (click)="$event.stopPropagation()">View →</button>
                <button class="ibtn" (click)="$event.stopPropagation(); onDelete(trip.id)">🗑️</button>
              </div>
            </div>
          </div>
        } @empty {
          <div class="empty-state">
            <div class="empty-icon">🗺️</div>
            <h3>No trips found</h3>
            <p>{{ searchQuery ? 'Try a different search.' : 'Plan your first adventure!' }}</p>
            <a routerLink="/trips/new" class="btn-primary">Plan a Trip</a>
          </div>
        }
      </div>
    } @else {
      <div class="trips-list">
        @for (trip of filteredTrips(); track trip.id) {
          <div class="trip-row" [routerLink]="['/trips', trip.id]">
            <div class="row-thumb" [style.background-image]="'url(' + trip.coverImage + ')'"></div>
            <div class="row-info">
              <div class="row-title">{{ trip.title }}</div>
              <div class="row-sub">📍 {{ trip.destination }} | {{ trip.type }} | {{ trip.companions }}</div>
            </div>
            <span class="status-badge" [class]="'sb-' + trip.status">{{ trip.status }}</span>
            <button class="ibtn" (click)="$event.stopPropagation(); onDelete(trip.id)">🗑️</button>
          </div>
        } @empty {
          <div class="empty-state"><h3>No trips found</h3></div>
        }
      </div>
    }

  </div>

  @if (deleteTargetId()) {
    <div class="modal-backdrop" (click)="deleteTargetId.set(null)">
      <div class="modal" (click)="$event.stopPropagation()">
        <h3>Delete Trip?</h3>
        <p>This will permanently remove all itinerary data and packing lists.</p>
        <div class="modal-actions">
          <button class="btn-sec" (click)="deleteTargetId.set(null)">Cancel</button>
          <button class="btn-danger" (click)="confirmDelete()">Delete</button>
        </div>
      </div>
    </div>
  }
  `,
  styles: [`
    .dashboard { max-width:1160px; margin:0 auto; padding:2rem 1.5rem; }
    .dash-hero { background:#16120e; border-radius:22px; padding:2.5rem 3rem; margin-bottom:2rem; position:relative; overflow:hidden; }
    .glow1 { position:absolute;top:-80px;right:-80px;width:300px;height:300px;background:radial-gradient(circle,rgba(212,88,26,.3),transparent 70%);pointer-events:none; }
    .glow2 { position:absolute;bottom:-100px;left:35%;width:260px;height:260px;background:radial-gradient(circle,rgba(26,107,158,.2),transparent 70%);pointer-events:none; }
    .dash-top { display:flex; justify-content:space-between; align-items:flex-start; position:relative; z-index:1; margin-bottom:1.5rem; }
    .hero-text h1 { font-family:'Cormorant Garamond',serif; font-size:2rem; color:#f7f2ea; line-height:1.15; margin-bottom:6px; }
    .hero-text p { color:#8a7f74; font-size:14px; margin:0; }
    .kpi-row { display:flex; gap:1.8rem; }
    .kpi-card { text-align:right; }
    .kpi-val { display:block; font-family:'Cormorant Garamond',serif; font-size:2rem; font-weight:700; color:#f7f2ea; }
    .kpi-lab { font-size:11.5px; color:#8a7f74; text-transform:uppercase; letter-spacing:.06em; }
    .countdown-strip { display:flex; gap:12px; position:relative; z-index:1; flex-wrap:wrap; }
    .cd-card { background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.1); border-radius:12px; padding:12px 16px; display:flex; gap:12px; align-items:center; min-width:200px; flex:1; cursor:pointer; transition:background .2s; text-decoration:none; }
    .cd-card:hover { background:rgba(255,255,255,.14); }
    .cd-days { font-family:'Cormorant Garamond',serif; font-size:2rem; font-weight:700; color:#d4581a; min-width:48px; text-align:center; }
    .cd-info p { font-size:13px; color:#f7f2ea; font-weight:500; margin:0 0 2px; }
    .cd-info span { font-size:11.5px; color:#8a7f74; }
    .no-upcoming { color:#8a7f74; font-size:14px; }
    .controls-row { display:flex; gap:12px; margin-bottom:1.5rem; align-items:center; flex-wrap:wrap; }
    .search-wrap { flex:1; min-width:200px; position:relative; }
    .search-wrap input { width:100%; padding:11px 16px 11px 40px; border:1.5px solid #ddd3c2; border-radius:30px; font-size:14px; font-family:'DM Sans',sans-serif; background:#fff; outline:none; }
    .search-wrap input:focus { border-color:#1a6b9e; }
    .s-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); font-size:15px; }
    .view-toggle { display:flex; background:#fff; border:1.5px solid #ddd3c2; border-radius:30px; overflow:hidden; }
    .view-toggle button { background:none; border:none; padding:8px 14px; font-size:16px; cursor:pointer; transition:background .2s; }
    .view-toggle button.active { background:#16120e; color:#f7f2ea; }
    .chips { display:flex; gap:7px; flex-wrap:wrap; }
    .chip { padding:8px 14px; border-radius:30px; border:1.5px solid #ddd3c2; background:#fff; font-size:13px; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all .2s; font-weight:500; color:#3d3529; display:flex; align-items:center; gap:6px; }
    .chip:hover { border-color:#1a6b9e; color:#1a6b9e; }
    .chip.active { background:#16120e; border-color:#16120e; color:#f7f2ea; }
    .chip-n { background:rgba(255,255,255,.2); padding:1px 6px; border-radius:10px; font-size:11px; }
    .chip:not(.active) .chip-n { background:#f0ebe2; color:#8a7f74; }
    .trips-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(310px,1fr)); gap:1.5rem; }
    .trip-card { background:#fff; border-radius:14px; overflow:hidden; box-shadow:0 2px 16px rgba(22,18,14,.09); transition:transform .25s,box-shadow .25s; cursor:pointer; }
    .trip-card:hover { transform:translateY(-5px); box-shadow:0 8px 40px rgba(22,18,14,.16); }
    .card-cover { height:170px; background-size:cover; background-position:center; position:relative; }
    .cover-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(22,18,14,.65) 0%,transparent 55%); }
    .cover-btm { position:absolute; bottom:12px; left:14px; right:14px; display:flex; justify-content:space-between; align-items:flex-end; }
    .dest-lbl { font-family:'Cormorant Garamond',serif; color:#fff; font-size:1.1rem; font-weight:600; text-shadow:0 1px 5px rgba(0,0,0,.5); }
    .status-badge { font-size:11px; font-weight:600; padding:3px 10px; border-radius:20px; }
    .sb-upcoming  { background:rgba(26,107,158,.85);  color:#fff; }
    .sb-ongoing   { background:rgba(45,122,80,.85);   color:#fff; }
    .sb-completed { background:rgba(92,61,143,.85);   color:#fff; }
    .sb-draft     { background:rgba(184,134,27,.85);  color:#fff; }
    .card-body { padding:15px 18px 17px; }
    .card-body h3 { font-size:1rem; font-weight:600; margin-bottom:5px; }
    .card-meta { display:flex; gap:8px; font-size:12.5px; color:#8a7f74; margin-bottom:11px; flex-wrap:wrap; align-items:center; }
    .tag { background:#f0ebe2; color:#3d3529; padding:2px 8px; border-radius:8px; font-size:11.5px; }
    .budget-row { margin-bottom:13px; }
    .b-nums { display:flex; justify-content:space-between; font-size:12px; margin-bottom:5px; }
    .spent-lbl { color:#d4581a; font-weight:500; }
    .prog-track { height:5px; background:#ede6d8; border-radius:4px; overflow:hidden; }
    .prog-fill { height:100%; border-radius:4px; background:#1a6b9e; transition:width .5s; }
    .prog-fill.warn { background:#b8861b; }
    .prog-fill.over { background:#d4581a; }
    .card-foot { display:flex; justify-content:space-between; align-items:center; }
    .btn-view { background:#e5f1f9; color:#1a6b9e; border:none; padding:8px 16px; border-radius:20px; font-size:13px; font-weight:600; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all .2s; }
    .btn-view:hover { background:#1a6b9e; color:#fff; }
    .ibtn { background:none; border:none; cursor:pointer; font-size:15px; padding:6px; border-radius:8px; transition:background .2s; }
    .ibtn:hover { background:#fdecea; }
    .trips-list { display:flex; flex-direction:column; gap:10px; }
    .trip-row { background:#fff; border-radius:12px; box-shadow:0 2px 12px rgba(22,18,14,.07); display:flex; align-items:center; gap:16px; padding:14px 18px; cursor:pointer; transition:box-shadow .2s; }
    .trip-row:hover { box-shadow:0 6px 24px rgba(22,18,14,.14); }
    .row-thumb { width:60px; height:60px; border-radius:10px; background-size:cover; background-position:center; flex-shrink:0; }
    .row-info { flex:1; min-width:0; }
    .row-title { font-size:14.5px; font-weight:600; margin-bottom:3px; }
    .row-sub { font-size:12.5px; color:#8a7f74; }
    .empty-state { grid-column:1/-1; text-align:center; padding:4rem 2rem; color:#8a7f74; }
    .empty-icon { font-size:3.5rem; margin-bottom:1rem; }
    .empty-state h3 { font-family:'Cormorant Garamond',serif; font-size:1.4rem; color:#3d3529; margin-bottom:8px; }
    .btn-primary { background:#16120e; color:#f7f2ea; text-decoration:none; padding:10px 24px; border-radius:30px; font-size:14px; font-weight:600; display:inline-block; margin-top:1rem; transition:background .2s; }
    .btn-primary:hover { background:#d4581a; }
    .modal-backdrop { position:fixed; inset:0; background:rgba(22,18,14,.55); z-index:500; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(3px); }
    .modal { background:#fff; border-radius:22px; max-width:440px; width:90%; padding:2rem; box-shadow:0 24px 80px rgba(22,18,14,.3); }
    .modal h3 { font-family:'Cormorant Garamond',serif; font-size:1.5rem; margin-bottom:8px; }
    .modal p { font-size:14px; color:#8a7f74; margin-bottom:1.5rem; line-height:1.6; }
    .modal-actions { display:flex; gap:10px; justify-content:flex-end; }
    .btn-sec { background:#f7f2ea; border:none; padding:10px 20px; border-radius:30px; font-size:14px; font-family:'DM Sans',sans-serif; font-weight:600; cursor:pointer; color:#3d3529; }
    .btn-danger { background:#d4581a; color:#fff; border:none; padding:10px 24px; border-radius:30px; font-size:14px; font-family:'DM Sans',sans-serif; font-weight:600; cursor:pointer; }
  `]
})
export class Dashboard {
  tripService    = inject(TripService);
  activeFilter   = signal<string>('all');
  viewMode       = signal<'grid' | 'list'>('grid');
  deleteTargetId = signal<string | null>(null);
  searchQuery    = '';

  filterTabs = [
    { label: 'All',       value: 'all'       },
    { label: 'Upcoming',  value: 'upcoming'  },
    { label: 'Ongoing',   value: 'ongoing'   },
    { label: 'Completed', value: 'completed' },
    { label: 'Draft',     value: 'draft'     }
  ];

  filteredTrips = computed(() => {
    const q = this.searchQuery.toLowerCase();
    return this.tripService.trips().filter(t => {
      const matchStatus = this.activeFilter() === 'all' || t.status === this.activeFilter();
      const matchSearch = !q || t.title.toLowerCase().includes(q) || t.destination.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  });

  kpis = computed(() => [
    { label: 'Total Trips',  value: this.tripService.totalTrips()            },
    { label: 'Upcoming',     value: this.tripService.upcomingTrips().length   },
    { label: 'Completed',    value: this.tripService.completedTrips().length  }
  ]);

  getBudgetPct(trip: Trip): number {
    return trip.budget ? Math.min(Math.round((trip.spent / trip.budget) * 100), 100) : 0;
  }

  getCount(status: string): number {
    return status === 'all' ? this.tripService.trips().length : this.tripService.trips().filter(t => t.status === status).length;
  }

  onDelete(id: string): void {
    this.deleteTargetId.set(id);
  }

  confirmDelete(): void {
    if (this.deleteTargetId()) {
      this.tripService.deleteTrip(this.deleteTargetId()!);
      this.deleteTargetId.set(null);
    }
  }
}
import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TripService } from '../../../core/services/trip.service';
import { Trip } from '../../../core/models/trip.model';

type TabId = 'timeline' | 'budget' | 'packing';

@Component({
  selector: 'app-itinerary',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, DecimalPipe, DatePipe],
  templateUrl: './itinerary.component.html',
  styleUrl: './itinerary.component.css'
})
export class Itinerary implements OnInit {
  private tripService = inject(TripService);
  private fb          = inject(FormBuilder);
  private router      = inject(Router);
  private route       = inject(ActivatedRoute);

  activeTab    = signal<TabId>('timeline');
  activeDayIdx = signal(0);
  showAddForm  = signal(false);
  tripId       = signal<string>('');

  trip = computed(() => this.tripService.getTripById(this.tripId()));

  budget = computed(() => {
    const t = this.trip();
    return t ? this.tripService.getBudgetSummary(t) : { total: 0, spent: 0, remaining: 0, percent: 0 };
  });

  catSpendEntries = computed(() => {
    const t = this.trip();
    if (!t) return [];
    const spend = this.tripService.getCategorySpend(t);
    const max   = Math.max(...Object.values(spend), 1);
    return Object.entries(spend)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, amount]) => ({ cat, amount, pct: Math.round((amount / max) * 100) }));
  });

  actForm!: FormGroup;

  tabs: { id: TabId; label: string }[] = [
    { id: 'timeline', label: '📅 Timeline' },
    { id: 'budget',   label: '💰 Budget'   },
    { id: 'packing',  label: '🧳 Packing'  }
  ];

  catIcons: Record<string, string> = {
    flight: '✈️', hotel: '🏨', food: '🍽️',
    sightseeing: '🏛️', transport: '🚌', shopping: '🛍️', other: '📌'
  };
  catColors: Record<string, string> = {
    flight: '#1a6b9e', hotel: '#5c3d8f', food: '#d4581a',
    sightseeing: '#2d7a50', transport: '#b8861b', shopping: '#b03060', other: '#8a7f74'
  };
  categories = [
    { value: 'sightseeing', label: 'Sightseeing', icon: '🏛️' },
    { value: 'food',        label: 'Food',         icon: '🍽️' },
    { value: 'hotel',       label: 'Hotel',        icon: '🏨' },
    { value: 'flight',      label: 'Flight',       icon: '✈️' },
    { value: 'transport',   label: 'Transport',    icon: '🚌' },
    { value: 'shopping',    label: 'Shopping',     icon: '🛍️' },
    { value: 'other',       label: 'Other',        icon: '📌' }
  ];

  objectKeys = Object.keys;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.tripId.set(id);
    else this.router.navigate(['/']);

    this.actForm = this.fb.group({
      time:     ['09:00'],
      category: ['sightseeing'],
      title:    ['', Validators.required],
      location: [''],
      notes:    [''],
      cost:     [0]
    });
  }

  toggleAct(tripId: string, dayId: string, actId: string): void {
    this.tripService.toggleActivity(tripId, dayId, actId);
  }
  delAct(tripId: string, dayId: string, actId: string): void {
    this.tripService.deleteActivity(tripId, dayId, actId);
  }

  addActivity(tripId: string, dayId: string): void {
    if (this.actForm.invalid) return;
    this.tripService.addActivity(tripId, dayId, { ...this.actForm.value, done: false });
    this.actForm.reset({ time: '09:00', category: 'sightseeing', cost: 0 });
    this.showAddForm.set(false);
  }

  togglePack(tripId: string, section: string, itemId: string): void {
    this.tripService.togglePackingItem(tripId, section, itemId);
  }
  delPack(tripId: string, section: string, itemId: string): void {
    this.tripService.deletePackingItem(tripId, section, itemId);
  }

  addPackFromRow(tripId: string, section: string): void {
    const input = document.getElementById('pi-' + section) as HTMLInputElement;
    const priEl = document.getElementById('pp-' + section) as HTMLSelectElement;
    const label = input?.value.trim();
    if (!label) return;
    this.tripService.addPackingItem(tripId, section, { label, done: false, priority: (priEl?.value || 'med') as any });
    if (input) input.value = '';
  }

  doneCount(trip: Trip, section: string): number {
    return trip.packingLists[section]?.filter(i => i.done).length ?? 0;
  }
}

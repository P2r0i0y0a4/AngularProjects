import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TripService } from '../services/trip.services';

@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './planner.component.html',
  styleUrl: './planner.component.css'
})
export class PlannerComponent {
  private tripSvc = inject(TripService);
  private router = inject(Router);

  // --- 1. Define parseInt so the HTML can use it ---
  parseInt = parseInt;

  // --- 2. Form Variables ---
  title = '';
  destination = '';
  startDate = '';
  endDate = '';
  budget: number | null = null;
  currency = '₹ INR';
  companions = 'Solo 🧍';
  rating = 3;
  selectedType = '✈️ Vacation';
  
  // Initialize as an empty array to fix the @for error
  selectedMoods: string[] = [];

  // --- 3. UI States ---
  submitted = false;
  loading = false;
  successMsg = '';

  // --- 4. Live Preview Helpers ---
  // Default background for the preview card
  prevBg = 'linear-gradient(135deg, #1a6b9e, #16120e)';

  // Data for the selection lists
  tripTypes = [
    { icon: '✈️', label: 'Vacation' },
    { icon: '🏛️', label: 'Culture' },
    { icon: '💆', label: 'Wellness' },
    { icon: '💼', label: 'Business' }
  ];

  moods = ['🍷 Fine dining', '📸 Photography', '📚 History', '🧘 Relaxation', '🛍️ Shopping', '🎭 Nightlife'];

  // --- 5. Computed Properties (Fixes prevDates errors) ---
  get prevDates(): string {
    if (!this.startDate) return 'Select dates';
    return `${this.startDate} ${this.endDate ? 'to ' + this.endDate : ''}`;
  }

  get endDateError(): boolean {
    if (!this.startDate || !this.endDate) return false;
    return new Date(this.endDate) <= new Date(this.startDate);
  }

  get durText(): string {
    if (!this.startDate || !this.endDate || this.endDateError) return '';
    const diff = new Date(this.endDate).getTime() - new Date(this.startDate).getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    return `${days} Days Trip`;
  }

  // --- 6. Form Methods ---
  selectType(icon: string, label: string) {
    this.selectedType = `${icon} ${label}`;
  }

  toggleMood(m: string) {
    const idx = this.selectedMoods.indexOf(m);
    if (idx > -1) {
      this.selectedMoods.splice(idx, 1);
    } else {
      this.selectedMoods.push(m);
    }
  }

  updatePreview() {
    // Optional: Change background based on destination
    if (this.destination.toLowerCase().includes('paris')) {
      this.prevBg = 'url(https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400) center/cover';
    } else {
      this.prevBg = 'linear-gradient(135deg, #1a6b9e, #16120e)';
    }
  }

  resetForm() {
    this.title = '';
    this.destination = '';
    this.startDate = '';
    this.endDate = '';
    this.budget = null;
    this.selectedMoods = [];
    this.submitted = false;
  }

  submitTrip() {
    this.submitted = true;
    if (!this.title || this.title.length < 3 || !this.destination || !this.startDate || this.endDateError) {
      return;
    }

    this.loading = true;
    // Simulate API call and redirect
    setTimeout(() => {
      this.loading = false;
      this.successMsg = 'Trip created successfully!';
      setTimeout(() => this.router.navigate(['/dashboard']), 1500);
    }, 1000);
  }
}
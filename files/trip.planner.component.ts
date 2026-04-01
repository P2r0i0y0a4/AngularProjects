import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { TripService } from '../../../core/services/trip.service';

@Component({
  selector: 'app-trip-planner',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './trip.planner.component.html',
  styleUrl: './trip.planner.component.css'
})
export class TripPlanner implements OnInit {
  private fb          = inject(FormBuilder);
  private tripService = inject(TripService);
  private router      = inject(Router);

  selectedType  = signal<string>('🏖️ Beach');
  selectedMoods = signal<string[]>([]);
  isSubmitting  = signal(false);
  successMsg    = signal('');
  tripForm!: FormGroup;

  tripTypes = [
    { icon: '🏖️', label: 'Beach',       value: '🏖️ Beach'       },
    { icon: '🏔️', label: 'Adventure',   value: '🏔️ Adventure'   },
    { icon: '🏛️', label: 'Culture',     value: '🏛️ Culture'     },
    { icon: '🍜', label: 'Food',         value: '🍜 Food'         },
    { icon: '💼', label: 'Business',    value: '💼 Business'    },
    { icon: '💆', label: 'Wellness',    value: '💆 Wellness'    },
    { icon: '🎉', label: 'Celebration', value: '🎉 Celebration' },
    { icon: '🌿', label: 'Nature',      value: '🌿 Nature'      }
  ];

  moods = [
    '🌅 Sunrise walks', '🍷 Fine dining', '📸 Photography',
    '🎭 Nightlife', '🏄 Water sports', '🛍️ Shopping',
    '📚 History', '🧘 Relaxation', '🎵 Live music', '🥾 Hiking'
  ];

  currencies = [
    { code: 'INR', symbol: '₹' }, { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' }, { code: 'GBP', symbol: '£' },
    { code: 'JPY', symbol: '¥' }
  ];

  companionOptions = ['Solo 🧍', 'Partner 👫', 'Family 👨‍👩‍👧‍👦', 'Friends 👯', 'Work team 💼'];

  tripDuration = computed(() => {
    const start = this.tripForm?.get('startDate')?.value;
    const end   = this.tripForm?.get('endDate')?.value;
    if (!start || !end) return 0;
    return Math.max(Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86400000) + 1, 0);
  });

  previewGradient = computed(() => {
    const gradients = [
      'linear-gradient(135deg,#1a6b9e,#0d4870)',
      'linear-gradient(135deg,#d4581a,#a03c0e)',
      'linear-gradient(135deg,#2d7a50,#1a4a30)',
      'linear-gradient(135deg,#5c3d8f,#3a256e)',
      'linear-gradient(135deg,#b8861b,#7a5a10)'
    ];
    const dest = this.tripForm?.get('destination')?.value || '';
    return gradients[dest.length % gradients.length];
  });

  ngOnInit(): void {
    this.tripForm = this.fb.group({
      title:       ['', [Validators.required, Validators.minLength(3)]],
      destination: ['', Validators.required],
      startDate:   ['', Validators.required],
      endDate:     ['', Validators.required],
      budget:      [null, [Validators.required, Validators.min(1)]],
      currency:    ['₹'],
      companions:  ['Solo 🧍']
    }, { validators: this.dateRangeValidator });
  }

  dateRangeValidator(group: AbstractControl) {
    const start = group.get('startDate')?.value;
    const end   = group.get('endDate')?.value;
    if (start && end && end <= start) {
      group.get('endDate')?.setErrors({ dateRange: true });
    }
    return null;
  }

  isInvalid(field: string): boolean {
    const c = this.tripForm.get(field);
    return !!(c?.invalid && (c?.dirty || c?.touched));
  }

  hasError(field: string, error: string): boolean {
    return !!this.tripForm.get(field)?.hasError(error);
  }

  toggleMood(mood: string): void {
    this.selectedMoods.update(moods =>
      moods.includes(mood) ? moods.filter(m => m !== mood) : [...moods, mood]
    );
  }

  onSubmit(): void {
    if (this.tripForm.invalid) { this.tripForm.markAllAsTouched(); return; }
    this.isSubmitting.set(true);
    setTimeout(() => {
      const trip = this.tripService.createTrip({
        ...this.tripForm.value,
        type:  this.selectedType(),
        moods: this.selectedMoods()
      });
      this.isSubmitting.set(false);
      this.successMsg.set('✅ "' + trip.title + '" created! Redirecting…');
      setTimeout(() => this.router.navigate(['/trips', trip.id]), 1200);
    }, 700);
  }

  resetForm(): void {
    this.tripForm.reset({ currency: '₹', companions: 'Solo 🧍' });
    this.selectedMoods.set([]);
    this.selectedType.set('🏖️ Beach');
    this.successMsg.set('');
  }
}

import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { TripService } from '../../../core/services/trip.service';

@Component({
  selector: 'app-trip-planner',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
  <div class="planner-pg">

    <div class="form-card">
      <div class="form-hdr">
        <a routerLink="/" class="back-link">← Back</a>
        <h2>Plan a New Trip ✈️</h2>
        <p>Fill in the details and build your adventure</p>
      </div>

      <form [formGroup]="tripForm" (ngSubmit)="onSubmit()">

        <div class="fgroup">
          <label>Trip Type</label>
          <div class="type-grid">
            @for (type of tripTypes; track type.value) {
              <button type="button" class="type-btn" [class.selected]="selectedType() === type.value" (click)="selectedType.set(type.value)">
                <span class="type-icon">{{ type.icon }}</span>{{ type.label }}
              </button>
            }
          </div>
        </div>

        <div class="fgroup">
          <label>Trip Title *</label>
          <input type="text" formControlName="title" placeholder="e.g. Paris Dream Escape" [class.invalid]="isInvalid('title')" />
          @if (isInvalid('title')) {
            <span class="err">
              @if (hasError('title','required')) { Title is required. }
              @if (hasError('title','minlength')) { Minimum 3 characters. }
            </span>
          }
        </div>

        <div class="fgroup">
          <label>Destination *</label>
          <input type="text" formControlName="destination" placeholder="e.g. Paris, France" [class.invalid]="isInvalid('destination')" />
          @if (isInvalid('destination')) { <span class="err">Destination is required.</span> }
        </div>

        <div class="frow">
          <div class="fgroup">
            <label>Start Date *</label>
            <input type="date" formControlName="startDate" [class.invalid]="isInvalid('startDate')" />
            @if (isInvalid('startDate')) { <span class="err">Required.</span> }
          </div>
          <div class="fgroup">
            <label>End Date *</label>
            <input type="date" formControlName="endDate" [class.invalid]="isInvalid('endDate')" />
            @if (isInvalid('endDate')) {
              <span class="err">
                @if (hasError('endDate','required')) { Required. }
                @if (hasError('endDate','dateRange')) { Must be after start date. }
              </span>
            }
          </div>
        </div>

        @if (tripDuration() > 0) {
          <div class="dur-pill">📅 {{ tripDuration() }} day{{ tripDuration() > 1 ? 's' : '' }} trip</div>
        }

        <div class="frow frow3">
          <div class="fgroup">
            <label>Budget *</label>
            <input type="number" formControlName="budget" placeholder="e.g. 50000" [class.invalid]="isInvalid('budget')" />
            @if (isInvalid('budget')) { <span class="err">Enter a valid amount.</span> }
          </div>
          <div class="fgroup">
            <label>Currency</label>
            <select formControlName="currency">
              @for (c of currencies; track c.code) {
                <option [value]="c.symbol">{{ c.symbol }} {{ c.code }}</option>
              }
            </select>
          </div>
        </div>

        <div class="fgroup">
          <label>Trip Vibes</label>
          <div class="mood-grid">
            @for (mood of moods; track mood) {
              <span class="mood-tag" [class.selected]="selectedMoods().includes(mood)" (click)="toggleMood(mood)">{{ mood }}</span>
            }
          </div>
        </div>

        <div class="fgroup">
          <label>Travelling With</label>
          <select formControlName="companions">
            @for (opt of companionOptions; track opt) {
              <option [value]="opt">{{ opt }}</option>
            }
          </select>
        </div>

        @if (tripForm.dirty) {
          <div class="form-status" [class.valid]="tripForm.valid" [class.inv-status]="tripForm.invalid">
            {{ tripForm.valid ? '✅ Ready to create!' : '⚠️ Please fix errors above.' }}
          </div>
        }

        <div class="form-actions">
          <button type="button" class="btn-sec" (click)="resetForm()">Reset</button>
          <button type="submit" class="btn-pri" [disabled]="tripForm.invalid || isSubmitting()">
            {{ isSubmitting() ? 'Creating…' : 'Create Trip 🚀' }}
          </button>
        </div>

      </form>

      @if (successMsg()) {
        <div class="success-toast">{{ successMsg() }}</div>
      }
    </div>

    <div class="preview-panel">
      <p class="prev-label">Live Preview</p>
      <div class="prev-card">
        <div class="prev-cover" [style.background]="previewGradient()">
          <span>{{ tripForm.get('destination')?.value || 'Your Destination' }}</span>
        </div>
        <div class="prev-body">
          <h4>{{ tripForm.get('title')?.value || 'Trip Title' }}</h4>
          <p>{{ selectedType() }}</p>
          @if (tripForm.get('startDate')?.value) {
            <p>📅 {{ tripForm.get('startDate')?.value }} → {{ tripForm.get('endDate')?.value }}</p>
          }
          @if (tripForm.get('budget')?.value) {
            <p>💰 {{ tripForm.get('currency')?.value }}{{ tripForm.get('budget')?.value }}</p>
          }
          @if (selectedMoods().length > 0) {
            <div class="prev-moods">
              @for (m of selectedMoods(); track m) { <span class="prev-mood">{{ m }}</span> }
            </div>
          }
        </div>
      </div>
      <div class="tips-card">
        <h5>💡 Smart Tips</h5>
        <ul>
          <li>✈️ Book flights 6–8 weeks ahead</li>
          <li>💰 Buffer 15% for surprises</li>
          <li>🛂 Check visa requirements early</li>
          <li>📱 Download offline maps</li>
          <li>🧳 Pack light — buy there</li>
        </ul>
      </div>
    </div>

  </div>
  `,
  styles: [`
    .planner-pg { max-width:1040px; margin:0 auto; padding:2rem 1.5rem; display:grid; grid-template-columns:1fr 330px; gap:2rem; align-items:start; }
    @media(max-width:780px) { .planner-pg { grid-template-columns:1fr; } }
    .form-card { background:#fff; border-radius:20px; padding:2.2rem; box-shadow:0 2px 16px rgba(22,18,14,.09); }
    .form-hdr { margin-bottom:1.8rem; }
    .back-link { color:#1a6b9e; text-decoration:none; font-size:13px; }
    .form-hdr h2 { font-family:'Cormorant Garamond',serif; font-size:1.8rem; margin:8px 0 4px; }
    .form-hdr p { color:#8a7f74; font-size:14px; margin:0; }
    .fgroup { margin-bottom:1.2rem; }
    .fgroup label { display:block; font-size:12px; font-weight:600; color:#8a7f74; margin-bottom:5px; text-transform:uppercase; letter-spacing:.05em; }
    .fgroup input, .fgroup select { width:100%; padding:11px 14px; border:1.5px solid #ddd3c2; border-radius:8px; font-size:14px; font-family:'DM Sans',sans-serif; color:#16120e; background:#fff; outline:none; transition:border .2s; }
    .fgroup input:focus, .fgroup select:focus { border-color:#1a6b9e; }
    .fgroup input.invalid { border-color:#d4581a; }
    .err { font-size:12px; color:#d4581a; margin-top:4px; display:block; }
    .frow { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    .frow3 { display:grid; grid-template-columns:2fr 1fr; gap:12px; }
    .type-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
    .type-btn { background:#f7f2ea; border:1.5px solid #ddd3c2; border-radius:10px; padding:10px 6px; cursor:pointer; text-align:center; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:500; color:#3d3529; transition:all .2s; }
    .type-btn:hover { border-color:#1a6b9e; color:#1a6b9e; }
    .type-btn.selected { background:#e5f1f9; border-color:#1a6b9e; color:#1a6b9e; }
    .type-icon { display:block; font-size:1.4rem; margin-bottom:4px; }
    .dur-pill { display:inline-flex; align-items:center; gap:6px; background:#e5f1f9; color:#1a6b9e; padding:6px 14px; border-radius:20px; font-size:13px; font-weight:600; margin-bottom:1rem; }
    .mood-grid { display:flex; gap:8px; flex-wrap:wrap; }
    .mood-tag { padding:6px 13px; border-radius:20px; border:1.5px solid #ddd3c2; background:#f7f2ea; font-size:12.5px; cursor:pointer; transition:all .2s; user-select:none; }
    .mood-tag:hover { border-color:#d4581a; }
    .mood-tag.selected { background:#fdeee6; border-color:#d4581a; color:#d4581a; }
    .form-status { padding:10px 14px; border-radius:8px; font-size:13px; margin-bottom:1rem; }
    .form-status.valid { background:#e5f4ec; color:#2d7a50; }
    .form-status.inv-status { background:#fdeee6; color:#d4581a; }
    .form-actions { display:flex; gap:12px; justify-content:flex-end; margin-top:1.5rem; }
    .btn-sec { background:#f7f2ea; border:none; padding:11px 22px; border-radius:30px; font-size:14px; font-family:'DM Sans',sans-serif; font-weight:600; color:#3d3529; cursor:pointer; }
    .btn-pri { background:#16120e; border:none; padding:11px 28px; border-radius:30px; font-size:14px; font-family:'DM Sans',sans-serif; font-weight:600; color:#f7f2ea; cursor:pointer; transition:all .2s; }
    .btn-pri:hover:not(:disabled) { background:#d4581a; }
    .btn-pri:disabled { opacity:.4; cursor:not-allowed; }
    .success-toast { background:#e5f4ec; color:#2d7a50; border:1px solid rgba(45,122,80,.2); border-radius:8px; padding:12px; text-align:center; font-size:14px; margin-top:1rem; }
    .preview-panel { position:sticky; top:80px; }
    .prev-label { font-size:11.5px; font-weight:600; letter-spacing:.07em; text-transform:uppercase; color:#8a7f74; margin-bottom:10px; }
    .prev-card { background:#fff; border-radius:14px; overflow:hidden; box-shadow:0 2px 16px rgba(22,18,14,.09); margin-bottom:1.2rem; }
    .prev-cover { height:125px; display:flex; align-items:flex-end; padding:14px; transition:background .5s; }
    .prev-cover span { font-family:'Cormorant Garamond',serif; color:#fff; font-size:1.1rem; font-weight:600; text-shadow:0 1px 4px rgba(0,0,0,.4); }
    .prev-body { padding:14px 16px; }
    .prev-body h4 { font-size:1rem; margin-bottom:5px; }
    .prev-body p { font-size:13px; color:#8a7f74; margin-bottom:3px; }
    .prev-moods { display:flex; flex-wrap:wrap; gap:5px; margin-top:6px; }
    .prev-mood { font-size:11px; background:#fdeee6; color:#d4581a; padding:2px 8px; border-radius:10px; }
    .tips-card { background:#fdf5e0; border-radius:14px; padding:1.2rem; border-left:3px solid #b8861b; }
    .tips-card h5 { font-size:13px; font-weight:600; color:#b8861b; margin-bottom:10px; }
    .tips-card ul { list-style:none; padding:0; }
    .tips-card li { font-size:13px; color:#3d3529; margin-bottom:6px; line-height:1.5; }
  `]
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
    { icon:'🏖️', label:'Beach',       value:'🏖️ Beach'       },
    { icon:'🏔️', label:'Adventure',   value:'🏔️ Adventure'   },
    { icon:'🏛️', label:'Culture',     value:'🏛️ Culture'     },
    { icon:'🍜', label:'Food',         value:'🍜 Food'         },
    { icon:'💼', label:'Business',    value:'💼 Business'    },
    { icon:'💆', label:'Wellness',    value:'💆 Wellness'    },
    { icon:'🎉', label:'Celebration', value:'🎉 Celebration' },
    { icon:'🌿', label:'Nature',      value:'🌿 Nature'      }
  ];

  moods = ['🌅 Sunrise walks','🍷 Fine dining','📸 Photography','🎭 Nightlife','🏄 Water sports','🛍️ Shopping','📚 History','🧘 Relaxation','🎵 Live music','🥾 Hiking'];
  currencies = [{ code:'INR', symbol:'₹' },{ code:'USD', symbol:'$' },{ code:'EUR', symbol:'€' },{ code:'GBP', symbol:'£' },{ code:'JPY', symbol:'¥' }];
  companionOptions = ['Solo 🧍','Partner 👫','Family 👨‍👩‍👧‍👦','Friends 👯','Work team 💼'];

  tripDuration = computed(() => {
    const start = this.tripForm?.get('startDate')?.value;
    const end   = this.tripForm?.get('endDate')?.value;
    if (!start || !end) return 0;
    return Math.max(Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86400000) + 1, 0);
  });

  previewGradient = computed(() => {
    const gradients = ['linear-gradient(135deg,#1a6b9e,#0d4870)','linear-gradient(135deg,#d4581a,#a03c0e)','linear-gradient(135deg,#2d7a50,#1a4a30)','linear-gradient(135deg,#5c3d8f,#3a256e)','linear-gradient(135deg,#b8861b,#7a5a10)'];
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
    this.selectedMoods.update(moods => moods.includes(mood) ? moods.filter(m => m !== mood) : [...moods, mood]);
  }

  onSubmit(): void {
    if (this.tripForm.invalid) { this.tripForm.markAllAsTouched(); return; }
    this.isSubmitting.set(true);
    setTimeout(() => {
      const trip = this.tripService.createTrip({ ...this.tripForm.value, type: this.selectedType(), moods: this.selectedMoods() });
      this.isSubmitting.set(false);
      this.successMsg.set('✅ "' + trip.title + '" created! Redirecting…');
      setTimeout(() => this.router.navigate(['/trips', trip.id]), 1200);
    }, 700);
  }

  resetForm(): void {
    this.tripForm.reset({ currency:'₹', companions:'Solo 🧍' });
    this.selectedMoods.set([]);
    this.selectedType.set('🏖️ Beach');
    this.successMsg.set('');
  }
}
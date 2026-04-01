import { Component, OnInit, signal, computed, effect, inject } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TripService } from '../../../core/services/trip.service';
import { Trip } from '../../../core/models/trip.model';

type TabId = 'timeline' | 'budget' | 'packing';

@Component({
  selector: 'app-itinerary',
  imports: [CommonModule, RouterLink, ReactiveFormsModule, DecimalPipe, DatePipe],
  template: `
  @if (trip(); as t) {
    <div class="itin-pg">

      <div class="itin-hero" [style.background-image]="'url(' + t.coverImage + ')'">
        <div class="hero-overlay">
          <button class="back-btn" routerLink="/">← All Trips</button>
          <div class="hero-info">
            <div class="hero-moods">
              @for (mood of t.moods; track mood) { <span class="mood-chip">{{ mood }}</span> }
            </div>
            <h1>{{ t.title }}</h1>
            <p>📍 {{ t.destination }} | {{ t.companions }} | {{ t.type }}</p>
            <p>📅 {{ t.startDate | date:'MMM d' }} – {{ t.endDate | date:'MMM d, y' }}</p>
          </div>
        </div>
      </div>

      <div class="feat-tabs">
        @for (tab of tabs; track tab.id) {
          <button class="ftab" [class.active]="activeTab() === tab.id" (click)="activeTab.set(tab.id)">{{ tab.label }}</button>
        }
      </div>

      @switch (activeTab()) {

        @case ('timeline') {
          <div class="tab-panel">
            <div class="day-tabs-wrap">
              <div class="day-tabs">
                @for (day of t.days; track day.id; let i = $index) {
                  <button class="dtab" [class.active]="activeDayIdx() === i" (click)="activeDayIdx.set(i)">
                    @if (day.activities.length) { <span class="dtab-badge">{{ day.activities.length }}</span> }
                    <span class="dtab-n">Day {{ i + 1 }}</span>
                    <span class="dtab-d">{{ day.date | date:'MMM d' }}</span>
                  </button>
                }
              </div>
            </div>

            @if (t.days[activeDayIdx()]; as activeDay) {
              <div class="day-panel">
                <div class="day-hdr">
                  <h3>{{ activeDay.label }}</h3>
                  <div class="day-weather">{{ activeDay.weather }}</div>
                </div>

                <div class="timeline">
                  @for (act of activeDay.activities; track act.id) {
                    <div class="tl-item">
                      <div class="tl-time">{{ act.time }}</div>
                      <div class="tl-dot-col">
                        <div class="tl-dot" [class]="'dot-' + act.category"></div>
                        <div class="tl-line"></div>
                      </div>
                      <div class="act-card" [class.done]="act.done">
                        <div class="act-top">
                          <div class="act-left">
                            <span class="act-ico">{{ catIcons[act.category] }}</span>
                            <div>
                              <div class="act-title" [class.strike]="act.done">{{ act.title }}</div>
                              <div class="act-loc">📍 {{ act.location }}</div>
                            </div>
                          </div>
                          <div class="act-right">
                            <span class="act-cost">{{ t.currency }}{{ act.cost | number }}</span>
                            <button class="chk-btn" (click)="toggleAct(t.id, activeDay.id, act.id)">{{ act.done ? '✅' : '⬜' }}</button>
                            <button class="del-btn" (click)="delAct(t.id, activeDay.id, act.id)">✕</button>
                          </div>
                        </div>
                        @if (act.notes) { <div class="act-notes">📝 {{ act.notes }}</div> }
                      </div>
                    </div>
                  } @empty {
                    <div class="empty-day">✨ No activities yet — add one below!</div>
                  }
                </div>

                <div class="add-sec">
                  <button class="toggle-add" (click)="showAddForm.update(v => !v)">{{ showAddForm() ? '✕ Cancel' : '+ Add Activity' }}</button>
                  @if (showAddForm()) {
                    <div class="add-form-box">
                      <h4>New Activity</h4>
                      <form [formGroup]="actForm" (ngSubmit)="addActivity(t.id, activeDay.id)">
                        <div class="af-row">
                          <div class="af-g"><label>Time</label><input type="time" formControlName="time" /></div>
                          <div class="af-g">
                            <label>Category</label>
                            <select formControlName="category">
                              @for (cat of categories; track cat.value) {
                                <option [value]="cat.value">{{ cat.icon }} {{ cat.label }}</option>
                              }
                            </select>
                          </div>
                          <div class="af-g"><label>Cost</label><input type="number" formControlName="cost" min="0" /></div>
                        </div>
                        <div class="af-g" style="margin-bottom:10px"><label>Title *</label><input type="text" formControlName="title" placeholder="e.g. Visit Eiffel Tower" /></div>
                        <div class="af-row">
                          <div class="af-g" style="grid-column:1/3"><label>Location</label><input type="text" formControlName="location" placeholder="e.g. Champ de Mars" /></div>
                          <div class="af-g"><label>Notes</label><input type="text" formControlName="notes" placeholder="Any tips?" /></div>
                        </div>
                        <div class="af-actions">
                          <button type="button" class="btn-cancel" (click)="showAddForm.set(false)">Cancel</button>
                          <button type="submit" class="btn-add" [disabled]="actForm.invalid">Add Activity</button>
                        </div>
                      </form>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        }

        @case ('budget') {
          <div class="tab-panel budget-panel">
            <div class="bstrip">
              <div class="bstat"><span class="bl">Total Budget</span><span class="bv">{{ t.currency }}{{ budget().total | number }}</span></div>
              <div class="bstat"><span class="bl">Spent</span><span class="bv red">{{ t.currency }}{{ budget().spent | number }}</span></div>
              <div class="bstat"><span class="bl">Remaining</span><span class="bv" [class.red]="budget().remaining < 0" [class.grn]="budget().remaining >= 0">{{ t.currency }}{{ budget().remaining | number }}</span></div>
              <div class="bprog">
                <div class="bprog-track"><div class="bprog-fill" [style.width.%]="budget().percent" [class.warn]="budget().percent>=70" [class.over]="budget().percent>=90"></div></div>
                <span class="bprog-pct">{{ budget().percent }}% used</span>
              </div>
            </div>
            <div class="cat-breakdown">
              <h4>Spending by Category</h4>
              @for (entry of catSpendEntries(); track entry.cat) {
                <div class="cat-row">
                  <span class="cat-icon">{{ catIcons[entry.cat] }}</span>
                  <span class="cat-name">{{ entry.cat }}</span>
                  <div class="cat-bar-track"><div class="cat-bar-fill" [style.width.%]="entry.pct" [style.background]="catColors[entry.cat]"></div></div>
                  <span class="cat-amt">{{ t.currency }}{{ entry.amount | number }}</span>
                </div>
              } @empty {
                <p class="no-data">No activities with costs yet.</p>
              }
            </div>
          </div>
        }

        @case ('packing') {
          <div class="tab-panel packing-panel">
            @for (section of objectKeys(t.packingLists); track section) {
              <div class="pack-section">
                <div class="pack-hdr">
                  <h4>{{ section }}</h4>
                  <span class="pack-prog">{{ doneCount(t, section) }}/{{ t.packingLists[section].length }} packed</span>
                </div>
                @for (item of t.packingLists[section]; track item.id) {
                  <div class="pack-item">
                    <div class="pack-cb" [class.checked]="item.done" (click)="togglePack(t.id, section, item.id)">{{ item.done ? '✓' : '' }}</div>
                    <span class="pack-label" [class.done]="item.done">{{ item.label }}</span>
                    <span class="pack-pri" [class]="'pp-' + item.priority">{{ item.priority }}</span>
                    <button class="del-btn" (click)="delPack(t.id, section, item.id)">✕</button>
                  </div>
                }
                <div class="add-pack-row">
                  <input type="text" [id]="'pi-' + section" placeholder="Add item…" />
                  <select [id]="'pp-' + section">
                    <option value="high">🔴 High</option>
                    <option value="med" selected>🟡 Med</option>
                    <option value="low">🟢 Low</option>
                  </select>
                  <button (click)="addPackFromRow(t.id, section)">+ Add</button>
                </div>
              </div>
            }
          </div>
        }

      }

    </div>
  } @else {
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading itinerary…</p>
    </div>
  }
  `,
  styles: [`
    .itin-pg { max-width:880px; margin:0 auto; padding-bottom:3rem; }
    .itin-hero { height:250px; background-size:cover; background-position:center; position:relative; border-radius:0 0 22px 22px; overflow:hidden; }
    .hero-overlay { position:absolute;inset:0;background:linear-gradient(to top,rgba(22,18,14,.8) 0%,rgba(22,18,14,.1) 100%);padding:1.5rem;display:flex;flex-direction:column;justify-content:space-between; }
    .back-btn { background:rgba(255,255,255,.15);border:none;color:rgba(255,255,255,.85);padding:7px 14px;border-radius:20px;font-size:13px;font-family:'DM Sans',sans-serif;cursor:pointer;align-self:flex-start;transition:background .2s; }
    .back-btn:hover { background:rgba(255,255,255,.28); }
    .hero-info { color:#fff; }
    .hero-moods { display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px; }
    .mood-chip { background:rgba(255,255,255,.15);color:rgba(255,255,255,.9);padding:3px 10px;border-radius:12px;font-size:11.5px; }
    .hero-info h1 { font-family:'Cormorant Garamond',serif;font-size:1.9rem;margin-bottom:4px; }
    .hero-info p { font-size:13.5px;opacity:.8;margin:2px 0; }
    .feat-tabs { display:flex;background:#fff;margin:1rem 1.5rem;border-radius:14px;box-shadow:0 2px 12px rgba(22,18,14,.07);overflow:hidden; }
    .ftab { flex:1;background:none;border:none;padding:13px 8px;font-size:13px;font-family:'DM Sans',sans-serif;font-weight:500;color:#8a7f74;cursor:pointer;transition:all .2s;border-bottom:2.5px solid transparent; }
    .ftab:hover { color:#16120e;background:#f7f2ea; }
    .ftab.active { color:#1a6b9e;border-bottom-color:#1a6b9e;background:#e5f1f9; }
    .tab-panel { padding:0 1.5rem; }
    .day-tabs-wrap { overflow-x:auto;margin-bottom:1.5rem;padding-bottom:2px; }
    .day-tabs { display:flex;gap:8px;width:max-content; }
    .dtab { background:#fff;border:1.5px solid #ddd3c2;border-radius:10px;padding:10px 13px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px;min-width:76px;transition:all .2s;font-family:'DM Sans',sans-serif;position:relative; }
    .dtab:hover { border-color:#1a6b9e; }
    .dtab.active { background:#16120e;border-color:#16120e;color:#f7f2ea; }
    .dtab-n { font-size:13px;font-weight:600; }
    .dtab-d { font-size:11px;opacity:.65; }
    .dtab-badge { position:absolute;top:-7px;right:-7px;background:#d4581a;color:#fff;font-size:10px;font-weight:700;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center; }
    .day-hdr { display:flex;justify-content:space-between;align-items:center;margin-bottom:1.2rem; }
    .day-hdr h3 { font-family:'Cormorant Garamond',serif;font-size:1.25rem; }
    .day-weather { font-size:13px;color:#8a7f74;background:#fff;padding:6px 12px;border-radius:20px;box-shadow:0 1px 8px rgba(22,18,14,.07); }
    .timeline { display:flex;flex-direction:column; }
    .tl-item { display:grid;grid-template-columns:54px 18px 1fr;gap:0 14px; }
    .tl-time { padding-top:13px;text-align:right;font-size:12px;font-weight:600;color:#8a7f74; }
    .tl-dot-col { display:flex;flex-direction:column;align-items:center; }
    .tl-dot { width:13px;height:13px;border-radius:50%;margin-top:13px;border:2.5px solid #fefcf8;box-shadow:0 0 0 2px #ddd3c2;flex-shrink:0;transition:transform .2s; }
    .tl-item:hover .tl-dot { transform:scale(1.4); }
    .tl-line { flex:1;width:2px;background:#ddd3c2;min-height:14px; }
    .dot-flight{background:#1a6b9e;} .dot-hotel{background:#5c3d8f;} .dot-food{background:#d4581a;}
    .dot-sightseeing{background:#2d7a50;} .dot-transport{background:#b8861b;}
    .dot-shopping{background:#b03060;} .dot-other{background:#8a7f74;}
    .act-card { background:#fff;border:1px solid #ede6d8;border-radius:14px;padding:13px 15px;margin-bottom:12px;box-shadow:0 1px 8px rgba(22,18,14,.06);transition:box-shadow .2s,transform .2s; }
    .act-card:hover { box-shadow:0 4px 16px rgba(22,18,14,.12);transform:translateX(3px); }
    .act-card.done { opacity:.55; }
    .act-top { display:flex;justify-content:space-between;align-items:flex-start;gap:8px; }
    .act-left { display:flex;gap:10px;align-items:flex-start; }
    .act-ico { font-size:1.4rem; }
    .act-title { font-size:14px;font-weight:600;color:#16120e; }
    .act-title.strike { text-decoration:line-through;color:#8a7f74; }
    .act-loc { font-size:12px;color:#8a7f74;margin-top:2px; }
    .act-right { display:flex;align-items:center;gap:5px;flex-shrink:0; }
    .act-cost { font-size:13px;font-weight:700;color:#3d3529; }
    .chk-btn { background:none;border:none;cursor:pointer;font-size:15px;padding:4px;border-radius:6px; }
    .chk-btn:hover { background:#e5f4ec; }
    .del-btn { background:none;border:none;cursor:pointer;font-size:12px;padding:5px 7px;border-radius:6px;color:#8a7f74;transition:all .2s; }
    .del-btn:hover { background:#fdecea;color:#d4581a; }
    .act-notes { font-size:12px;color:#8a7f74;margin-top:8px;padding-top:8px;border-top:1px solid #ede6d8; }
    .empty-day { text-align:center;padding:2rem;color:#8a7f74;background:#f7f2ea;border-radius:14px;margin-bottom:1rem;font-size:14px; }
    .add-sec { margin-top:1rem; }
    .toggle-add { width:100%;background:none;border:2px dashed #ddd3c2;color:#1a6b9e;padding:12px;border-radius:14px;font-size:14px;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .2s; }
    .toggle-add:hover { border-color:#1a6b9e;background:#e5f1f9; }
    .add-form-box { background:#fff;border-radius:14px;padding:1.5rem;margin-top:10px;box-shadow:0 2px 16px rgba(22,18,14,.09); }
    .add-form-box h4 { font-family:'Cormorant Garamond',serif;font-size:1.05rem;margin-bottom:1rem; }
    .af-row { display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:10px; }
    .af-g { display:flex;flex-direction:column;gap:4px; }
    .af-g label { font-size:11px;font-weight:600;color:#8a7f74;text-transform:uppercase; }
    .af-g input,.af-g select { padding:9px 12px;border:1.5px solid #ddd3c2;border-radius:8px;font-size:13px;font-family:'DM Sans',sans-serif;background:#f7f2ea;outline:none; }
    .af-g input:focus,.af-g select:focus { border-color:#1a6b9e;background:#fff; }
    .af-actions { display:flex;justify-content:flex-end;gap:10px;margin-top:10px; }
    .btn-cancel { background:#f7f2ea;border:none;padding:10px 18px;border-radius:20px;font-size:13.5px;font-family:'DM Sans',sans-serif;cursor:pointer;color:#3d3529; }
    .btn-add { background:#1a6b9e;color:#fff;border:none;padding:10px 22px;border-radius:20px;font-size:13.5px;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer; }
    .btn-add:disabled { opacity:.4;cursor:not-allowed; }
    .budget-panel { }
    .bstrip { display:flex;gap:1.5rem;background:#fff;border-radius:14px;padding:1rem 1.5rem;box-shadow:0 2px 12px rgba(22,18,14,.07);flex-wrap:wrap;align-items:center;margin-bottom:1.2rem; }
    .bstat { display:flex;flex-direction:column; }
    .bl { font-size:11px;color:#8a7f74;text-transform:uppercase;letter-spacing:.05em; }
    .bv { font-size:1.05rem;font-weight:700;color:#16120e; }
    .bv.red { color:#d4581a; } .bv.grn { color:#2d7a50; }
    .bprog { flex:1;min-width:120px; }
    .bprog-track { height:8px;background:#ede6d8;border-radius:4px;overflow:hidden;margin-bottom:4px; }
    .bprog-fill { height:100%;border-radius:4px;background:#1a6b9e;transition:width .5s; }
    .bprog-fill.warn { background:#b8861b; } .bprog-fill.over { background:#d4581a; }
    .bprog-pct { font-size:12px;color:#8a7f74;font-weight:600; }
    .cat-breakdown { background:#fff;border-radius:14px;padding:1.2rem;box-shadow:0 2px 12px rgba(22,18,14,.07); }
    .cat-breakdown h4 { font-family:'Cormorant Garamond',serif;font-size:1rem;margin-bottom:1rem; }
    .cat-row { display:flex;align-items:center;gap:10px;margin-bottom:10px; }
    .cat-icon { font-size:1.1rem;width:28px;text-align:center; }
    .cat-name { font-size:13px;color:#3d3529;width:90px;flex-shrink:0; }
    .cat-bar-track { flex:1;height:6px;background:#ede6d8;border-radius:4px;overflow:hidden; }
    .cat-bar-fill { height:100%;border-radius:4px;transition:width .6s; }
    .cat-amt { font-size:12.5px;font-weight:600;color:#16120e;min-width:70px;text-align:right; }
    .no-data { color:#8a7f74;font-size:14px; }
    .packing-panel { display:flex;flex-direction:column;gap:12px; }
    .pack-section { background:#fff;border-radius:14px;padding:1.2rem;box-shadow:0 2px 12px rgba(22,18,14,.07); }
    .pack-hdr { display:flex;justify-content:space-between;align-items:center;margin-bottom:12px; }
    .pack-hdr h4 { font-family:'Cormorant Garamond',serif;font-size:1rem; }
    .pack-prog { font-size:12px;color:#8a7f74; }
    .pack-item { display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #ede6d8; }
    .pack-item:last-of-type { border-bottom:none; }
    .pack-cb { width:18px;height:18px;border:2px solid #ddd3c2;border-radius:5px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s;font-size:11px; }
    .pack-cb.checked { background:#2d7a50;border-color:#2d7a50;color:#fff; }
    .pack-label { font-size:13.5px;flex:1; }
    .pack-label.done { text-decoration:line-through;color:#8a7f74; }
    .pack-pri { font-size:10.5px;padding:2px 7px;border-radius:8px; }
    .pp-high{background:#fdeee6;color:#d4581a;} .pp-med{background:#fdf5e0;color:#b8861b;} .pp-low{background:#e5f1f9;color:#1a6b9e;}
    .add-pack-row { display:flex;gap:8px;margin-top:12px; }
    .add-pack-row input { flex:1;padding:9px 12px;border:1.5px solid #ddd3c2;border-radius:8px;font-size:13px;font-family:'DM Sans',sans-serif;outline:none; }
    .add-pack-row input:focus { border-color:#1a6b9e; }
    .add-pack-row select { padding:9px 10px;border:1.5px solid #ddd3c2;border-radius:8px;font-size:13px;font-family:'DM Sans',sans-serif;outline:none; }
    .add-pack-row button { background:#1a6b9e;color:#fff;border:none;padding:9px 16px;border-radius:8px;font-size:13px;font-family:'DM Sans',sans-serif;cursor:pointer; }
    .loading-state { text-align:center;padding:4rem;color:#8a7f74; }
    .spinner { width:36px;height:36px;border:3px solid #ede6d8;border-top-color:#1a6b9e;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 1rem; }
    @keyframes spin{to{transform:rotate(360deg);}}
  `]
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
    return t ? this.tripService.getBudgetSummary(t) : { total:0, spent:0, remaining:0, percent:0 };
  });

  catSpendEntries = computed(() => {
    const t = this.trip();
    if (!t) return [];
    const spend = this.tripService.getCategorySpend(t);
    const max = Math.max(...Object.values(spend), 1);
    return Object.entries(spend).sort((a, b) => b[1] - a[1]).map(([cat, amount]) => ({ cat, amount, pct: Math.round((amount / max) * 100) }));
  });

  actForm!: FormGroup;

  tabs: { id: TabId; label: string }[] = [
    { id:'timeline', label:'📅 Timeline' },
    { id:'budget',   label:'💰 Budget'   },
    { id:'packing',  label:'🧳 Packing'  }
  ];

  catIcons: Record<string, string> = {
    flight:'✈️', hotel:'🏨', food:'🍽️', sightseeing:'🏛️', transport:'🚌', shopping:'🛍️', other:'📌'
  };
  catColors: Record<string, string> = {
    flight:'#1a6b9e', hotel:'#5c3d8f', food:'#d4581a', sightseeing:'#2d7a50', transport:'#b8861b', shopping:'#b03060', other:'#8a7f74'
  };
  categories = [
    { value:'sightseeing', label:'Sightseeing', icon:'🏛️' },
    { value:'food',        label:'Food',         icon:'🍽️' },
    { value:'hotel',       label:'Hotel',        icon:'🏨' },
    { value:'flight',      label:'Flight',       icon:'✈️' },
    { value:'transport',   label:'Transport',    icon:'🚌' },
    { value:'shopping',    label:'Shopping',     icon:'🛍️' },
    { value:'other',       label:'Other',        icon:'📌' }
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

  toggleAct(tripId: string, dayId: string, actId: string): void { this.tripService.toggleActivity(tripId, dayId, actId); }
  delAct(tripId: string, dayId: string, actId: string): void    { this.tripService.deleteActivity(tripId, dayId, actId); }

  addActivity(tripId: string, dayId: string): void {
    if (this.actForm.invalid) return;
    this.tripService.addActivity(tripId, dayId, { ...this.actForm.value, done: false });
    this.actForm.reset({ time:'09:00', category:'sightseeing', cost:0 });
    this.showAddForm.set(false);
  }

  togglePack(tripId: string, section: string, itemId: string): void { this.tripService.togglePackingItem(tripId, section, itemId); }
  delPack(tripId: string, section: string, itemId: string): void    { this.tripService.deletePackingItem(tripId, section, itemId); }

  addPackFromRow(tripId: string, section: string): void {
    const input  = document.getElementById('pi-' + section) as HTMLInputElement;
    const priEl  = document.getElementById('pp-' + section) as HTMLSelectElement;
    const label  = input?.value.trim();
    if (!label) return;
    this.tripService.addPackingItem(tripId, section, { label, done: false, priority: (priEl?.value || 'med') as any });
    if (input) input.value = '';
  }

  doneCount(trip: Trip, section: string): number {
    return trip.packingLists[section]?.filter(i => i.done).length ?? 0;
  }
}
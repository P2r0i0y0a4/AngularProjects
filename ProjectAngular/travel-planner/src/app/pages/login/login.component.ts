import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      <!-- Background effects -->
      <div class="absolute inset-0 bg-[#0a0f1e]"></div>
      <div class="absolute inset-0">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-sky-500/10 to-transparent rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-[500px] h-[400px] bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-full blur-3xl"></div>
        <div class="absolute top-1/2 right-0 w-[400px] h-[400px] bg-gradient-to-l from-indigo-500/8 to-transparent rounded-full blur-3xl"></div>
      </div>

      <!-- Floating elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        @for (item of floatingItems; track item.text) {
          <div class="absolute text-2xl opacity-20 animate-float"
               [style.top]="item.top" [style.left]="item.left"
               [style.animationDelay]="item.delay">{{ item.text }}</div>
        }
      </div>

      <!-- Card -->
      <div class="relative z-10 w-full max-w-md animate-slide-up">
        <div class="glass-strong rounded-3xl p-8 shadow-2xl">
          <!-- Header -->
          <div class="text-center mb-8">
            <div class="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-3xl mx-auto mb-4 shadow-glow">✈️</div>
            <h1 class="font-display text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p class="text-slate-400">Sign in to continue planning your adventures</p>
          </div>

          <!-- Error -->
          @if (error()) {
            <div class="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <span>⚠️</span> {{ error() }}
            </div>
          }

          <!-- Form -->
          <form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm)" novalidate class="space-y-5">
            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">📧</span>
                <input
                  type="email"
                  name="email"
                  [(ngModel)]="formData.email"
                  required
                  email
                  #emailField="ngModel"
                  placeholder="you@example.com"
                  class="input-field w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                  [class.border-red-500/50]="emailField.invalid && emailField.touched">
              </div>
              @if (emailField.invalid && emailField.touched) {
                <p class="text-red-400 text-xs mt-1">
                  @if (emailField.errors?.['required']) { Email is required. }
                  @else if (emailField.errors?.['email']) { Please enter a valid email. }
                </p>
              }
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔒</span>
                <input
                  [type]="showPassword() ? 'text' : 'password'"
                  name="password"
                  [(ngModel)]="formData.password"
                  required
                  minlength="6"
                  #passwordField="ngModel"
                  placeholder="••••••••"
                  class="input-field w-full pl-10 pr-12 py-3 rounded-xl text-sm"
                  [class.border-red-500/50]="passwordField.invalid && passwordField.touched">
                <button type="button" (click)="togglePassword()"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {{ showPassword() ? '🙈' : '👁️' }}
                </button>
              </div>
              @if (passwordField.invalid && passwordField.touched) {
                <p class="text-red-400 text-xs mt-1">
                  @if (passwordField.errors?.['required']) { Password is required. }
                  @else if (passwordField.errors?.['minlength']) { Password must be at least 6 characters. }
                </p>
              }
            </div>

            <!-- Submit -->
            <button type="submit"
                    [disabled]="loading()"
                    class="btn-primary w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              @if (loading()) {
                <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Signing in...
              } @else {
                <span>Sign In</span>
                <span>→</span>
              }
            </button>
          </form>

          <!-- Divider -->
          <div class="flex items-center gap-3 my-6">
            <div class="flex-1 h-px bg-white/10"></div>
            <span class="text-xs text-slate-500">or try demo</span>
            <div class="flex-1 h-px bg-white/10"></div>
          </div>

          <!-- Demo Login -->
          <button (click)="demoLogin()" class="btn-secondary w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
            <span>🎮</span> Continue with Demo Account
          </button>

          <!-- Sign up link -->
          <p class="text-center text-sm text-slate-400 mt-6">
            Don't have an account?
            <a routerLink="/signup" class="text-sky-400 hover:text-sky-300 font-semibold ml-1">Create one →</a>
          </p>
        </div>

        <!-- Feature hints -->
        <div class="grid grid-cols-3 gap-3 mt-6">
          @for (feat of features; track feat.text) {
            <div class="glass rounded-2xl p-3 text-center">
              <div class="text-xl mb-1">{{ feat.icon }}</div>
              <p class="text-xs text-slate-400">{{ feat.text }}</p>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  auth = inject(AuthService);
  router = inject(Router);

  formData = { email: '', password: '' };
  loading = signal(false);
  error = signal('');
  showPassword = signal(false);

  floatingItems = [
    { text: '🗺️', top: '10%', left: '5%', delay: '0s' },
    { text: '🏔️', top: '20%', left: '90%', delay: '1s' },
    { text: '🌊', top: '70%', left: '8%', delay: '2s' },
    { text: '🌸', top: '80%', left: '85%', delay: '0.5s' },
    { text: '🏛️', top: '40%', left: '95%', delay: '1.5s' },
    { text: '🎒', top: '60%', left: '2%', delay: '3s' },
  ];

  features = [
    { icon: '🗺️', text: 'Trip Planning' },
    { icon: '💰', text: 'Budget Tracking' },
    { icon: '🌤️', text: 'Weather Data' },
  ];

  togglePassword() { this.showPassword.update(v => !v); }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      Object.keys(form.controls).forEach(k => form.controls[k].markAsTouched());
      return;
    }
    this.loading.set(true);
    this.error.set('');
    setTimeout(() => {
      const result = this.auth.login(this.formData.email, this.formData.password);
      this.loading.set(false);
      if (result.success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.error.set(result.error || 'Login failed');
      }
    }, 800);
  }

  demoLogin(): void {
    this.loading.set(true);
    // Create demo account if not exists
    this.auth.signup('Demo Traveler', 'demo@wanderplan.app', 'demo123');
    setTimeout(() => {
      const result = this.auth.login('demo@wanderplan.app', 'demo123');
      this.loading.set(false);
      if (result.success) this.router.navigate(['/dashboard']);
    }, 600);
  }
}

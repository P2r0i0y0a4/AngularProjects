import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-8">
      <div class="absolute inset-0 bg-[#0a0f1e]"></div>
      <div class="absolute inset-0">
        <div class="absolute top-0 right-1/4 w-[600px] h-[400px] bg-gradient-to-b from-emerald-500/10 to-transparent rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-0 w-[500px] h-[400px] bg-gradient-to-tl from-sky-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div class="relative z-10 w-full max-w-md animate-slide-up">
        <div class="glass-strong rounded-3xl p-8 shadow-2xl">
          <!-- Header -->
          <div class="text-center mb-8">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-500 flex items-center justify-center text-3xl mx-auto mb-4">🌍</div>
            <h1 class="font-display text-3xl font-bold text-white mb-2">Join WanderPlan</h1>
            <p class="text-slate-400">Start planning your dream adventures today</p>
          </div>

          @if (error()) {
            <div class="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <span>⚠️</span> {{ error() }}
            </div>
          }

          @if (success()) {
            <div class="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
              <span>✅</span> Account created! Redirecting...
            </div>
          }

          <form #signupForm="ngForm" (ngSubmit)="onSubmit(signupForm)" novalidate class="space-y-4">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">👤</span>
                <input
                  type="text"
                  name="name"
                  [(ngModel)]="formData.name"
                  required
                  minlength="2"
                  maxlength="50"
                  #nameField="ngModel"
                  placeholder="John Doe"
                  class="input-field w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                  [class.border-red-500/50]="nameField.invalid && nameField.touched">
              </div>
              @if (nameField.invalid && nameField.touched) {
                <p class="text-red-400 text-xs mt-1">
                  @if (nameField.errors?.['required']) { Name is required. }
                  @else if (nameField.errors?.['minlength']) { Name must be at least 2 characters. }
                </p>
              }
            </div>

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
                  @else if (emailField.errors?.['email']) { Enter a valid email address. }
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
                  minlength="8"
                  #passwordField="ngModel"
                  placeholder="Min. 8 characters"
                  class="input-field w-full pl-10 pr-12 py-3 rounded-xl text-sm"
                  [class.border-red-500/50]="passwordField.invalid && passwordField.touched"
                  (input)="checkPasswordStrength()">
                <button type="button" (click)="showPassword.update(v => !v)"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {{ showPassword() ? '🙈' : '👁️' }}
                </button>
              </div>
              @if (passwordField.invalid && passwordField.touched) {
                <p class="text-red-400 text-xs mt-1">
                  @if (passwordField.errors?.['required']) { Password is required. }
                  @else if (passwordField.errors?.['minlength']) { Password must be at least 8 characters. }
                </p>
              }
              <!-- Password strength -->
              @if (formData.password.length > 0) {
                <div class="mt-2">
                  <div class="flex gap-1 mb-1">
                    @for (bar of [1,2,3,4]; track bar) {
                      <div class="h-1 flex-1 rounded-full transition-all"
                           [class]="bar <= passwordStrength() ? strengthColor() : 'bg-white/10'"></div>
                    }
                  </div>
                  <p class="text-xs" [class]="strengthTextColor()">{{ strengthLabel() }}</p>
                </div>
              }
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔐</span>
                <input
                  [type]="showPassword() ? 'text' : 'password'"
                  name="confirmPassword"
                  [(ngModel)]="formData.confirmPassword"
                  required
                  #confirmField="ngModel"
                  placeholder="Repeat password"
                  class="input-field w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                  [class.border-red-500/50]="confirmField.touched && formData.password !== formData.confirmPassword">
              </div>
              @if (confirmField.touched && formData.password !== formData.confirmPassword && formData.confirmPassword) {
                <p class="text-red-400 text-xs mt-1">Passwords do not match.</p>
              }
            </div>

            <!-- Terms -->
            <div class="flex items-start gap-3 pt-1">
              <input type="checkbox" name="terms" [(ngModel)]="formData.terms" required id="terms"
                     class="mt-0.5 w-4 h-4 accent-sky-500">
              <label for="terms" class="text-xs text-slate-400 leading-relaxed">
                I agree to the <span class="text-sky-400 cursor-pointer">Terms of Service</span> and
                <span class="text-sky-400 cursor-pointer"> Privacy Policy</span>
              </label>
            </div>

            <button type="submit"
                    [disabled]="loading() || !formData.terms || formData.password !== formData.confirmPassword"
                    class="btn-primary w-full py-3 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2">
              @if (loading()) {
                <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating account...
              } @else {
                <span>🚀</span> Create My Account
              }
            </button>
          </form>

          <p class="text-center text-sm text-slate-400 mt-6">
            Already have an account?
            <a routerLink="/login" class="text-sky-400 hover:text-sky-300 font-semibold ml-1">Sign in →</a>
          </p>
        </div>

        <!-- Perks -->
        <div class="grid grid-cols-2 gap-3 mt-4">
          @for (perk of perks; track perk.text) {
            <div class="glass rounded-2xl p-3 flex items-center gap-2">
              <span class="text-lg">{{ perk.icon }}</span>
              <p class="text-xs text-slate-400">{{ perk.text }}</p>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class SignupComponent {
  auth = inject(AuthService);
  router = inject(Router);

  formData = { name: '', email: '', password: '', confirmPassword: '', terms: false };
  loading = signal(false);
  error = signal('');
  success = signal(false);
  showPassword = signal(false);
  passwordStrength = signal(0);

  perks = [
    { icon: '🆓', text: 'Free forever plan' },
    { icon: '🔒', text: 'Secure & private' },
    { icon: '📱', text: 'Mobile friendly' },
    { icon: '♾️', text: 'Unlimited trips' },
  ];

  checkPasswordStrength(): void {
    const p = this.formData.password;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    this.passwordStrength.set(score);
  }

  strengthColor(): string {
    const s = this.passwordStrength();
    if (s <= 1) return 'bg-red-500';
    if (s === 2) return 'bg-orange-500';
    if (s === 3) return 'bg-yellow-500';
    return 'bg-emerald-500';
  }

  strengthTextColor(): string {
    const s = this.passwordStrength();
    if (s <= 1) return 'text-red-400';
    if (s === 2) return 'text-orange-400';
    if (s === 3) return 'text-yellow-400';
    return 'text-emerald-400';
  }

  strengthLabel(): string {
    const s = this.passwordStrength();
    if (s <= 1) return 'Weak';
    if (s === 2) return 'Fair';
    if (s === 3) return 'Good';
    return 'Strong ✓';
  }

  onSubmit(form: NgForm): void {
    if (form.invalid || !this.formData.terms) {
      Object.keys(form.controls).forEach(k => form.controls[k].markAsTouched());
      return;
    }
    if (this.formData.password !== this.formData.confirmPassword) return;
    this.loading.set(true);
    this.error.set('');
    setTimeout(() => {
      const result = this.auth.signup(this.formData.name, this.formData.email, this.formData.password);
      this.loading.set(false);
      if (result.success) {
        this.success.set(true);
        setTimeout(() => this.router.navigate(['/dashboard']), 1200);
      } else {
        this.error.set(result.error || 'Signup failed');
      }
    }, 900);
  }
}

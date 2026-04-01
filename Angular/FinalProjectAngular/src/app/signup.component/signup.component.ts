// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-signup.component',
//   imports: [],
//   templateUrl: './signup.component.html',
//   styleUrl: './signup.component.css',
// })
// export class SignupComponent {}
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.services';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  step = 1;
  stepLabels = ['Personal Info', 'Set Password', 'Preferences'];

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  travelStyle = 'Adventure';
  agreed = false;

  showPwd = false;
  submitted = false;
  loading = false;
  errorMsg = '';
  successMsg = '';

  strength = 0;
  strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  strengthColors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];

  travelStyles = [
    { icon: '🏖️', label: 'Beach' },
    { icon: '🏔️', label: 'Adventure' },
    { icon: '🏛️', label: 'Culture' },
    { icon: '💆', label: 'Wellness' },
    { icon: '🍜', label: 'Food' },
    { icon: '💼', label: 'Business' },
    { icon: '🌿', label: 'Nature' },
    { icon: '🎉', label: 'Party' },
  ];

  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.isLoggedIn()) this.router.navigate(['/dashboard']);
  }

  isValidEmail() {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }

  calcStrength() {
    const p = this.password;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    this.strength = s;
  }

  nextStep() {
    this.submitted = true;
    this.errorMsg = '';

    if (this.step === 1) {
      if (!this.name.trim() || !this.email.trim() || !this.isValidEmail()) return;
      this.step = 2;
      this.submitted = false;
    } else if (this.step === 2) {
      if (this.password.length < 6 || this.password !== this.confirmPassword) return;
      this.step = 3;
      this.submitted = false;
    }
  }

  onSubmit() {
    this.submitted = true;
    this.errorMsg = '';
    if (!this.agreed) return;

    this.loading = true;
    setTimeout(() => {
      const result = this.auth.signup(this.name.trim(), this.email.trim(), this.password);
      if (result.success) {
        this.successMsg = 'Account created successfully!';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      } else {
        this.errorMsg = result.message;
      }
      this.loading = false;
    }, 800);
  }
}
// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-login.component',
//   imports: [],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.css',
// })
// export class LoginComponent {}
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMsg = '';
  loading = false;
  submitted = false;
  showPwd = false;

  features = [
    { icon: '🗺️', label: 'Smart Itineraries' },
    { icon: '💰', label: 'Budget Tracker' },
    { icon: '🧳', label: 'Packing Lists' },
  ];

  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.isLoggedIn()) this.router.navigate(['/dashboard']);
  }

  onSubmit() {
    this.submitted = true;
    this.errorMsg = '';
    if (!this.email || !this.password) return;

    this.loading = true;
    setTimeout(() => {
      const result = this.auth.login(this.email.trim(), this.password);
      if (result.success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMsg = result.message;
      }
      this.loading = false;
    }, 600);
  }
}
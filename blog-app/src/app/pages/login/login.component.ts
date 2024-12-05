
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';  
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <label for="email">Email</label>
        <input id="email" formControlName="email" type="email" required>
        <div *ngIf="loginForm.controls['email'].invalid && loginForm.controls['email'].touched">
          Email is required and must be valid.
        </div>

        <label for="password">Password</label>
        <input id="password" formControlName="password" type="password" required>
        <div *ngIf="loginForm.controls['password'].invalid && loginForm.controls['password'].touched">
          Password is required.
        </div>

        <button type="submit" [disabled]="loginForm.invalid">Login</button>
      </form>
      <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
    </div>
  `,
  styles: [` 
    .login-container { max-width: 400px; margin: auto; }
    .error { color: red; margin-top: 10px; }
  `],
  imports: [CommonModule, ReactiveFormsModule],  
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/catalog']);
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.loginUser(email, password).subscribe({
        next: () => {
          this.errorMessage = null;
          alert('Login successful!');
          this.router.navigate(['/catalog']);
        },
        error: () => {
          this.errorMessage = 'Invalid email or password.';
        },
      });
    }
  }
}

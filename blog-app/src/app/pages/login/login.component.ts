
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
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" formControlName="email" type="email" placeholder="Enter your email" required>
          <div *ngIf="loginForm.controls['email'].invalid && loginForm.controls['email'].touched" class="error-message">
            Email is required and must be valid.
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" formControlName="password" type="password" placeholder="Enter your password" required>
          <div *ngIf="loginForm.controls['password'].invalid && loginForm.controls['password'].touched" class="error-message">
            Password is required.
          </div>
        </div>

        <button type="submit" [disabled]="loginForm.invalid" class="submit-btn">Login</button>
      </form>

      <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
    </div>
  `,
  styles: [` 
     body {
      background: linear-gradient(135deg, #003366, #66b3ff); /* Тъмно-синьо към светло-синьо */
      color: white;
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
    }

  
    .login-container {
      max-width: 400px;
      margin: 50px auto;
      padding: 30px;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      text-align: center;
    }

    h2 {
      font-size: 1.8rem;
      margin-bottom: 20px;
      font-weight: bold;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      font-size: 1rem;
      margin-bottom: 5px;
      display: block;
      text-align: left;
    }

    input {
      width: 100%;
      padding: 10px;
      font-size: 1rem;
      border: 1px solid #ddd;
      border-radius: 5px;
      background-color: #f5f5f5;
      color: #333;
      transition: border 0.3s ease;
    }

    input:focus {
      outline: none;
      border-color: #66b3ff;
    }

    .error-message {
      color: red;
      font-size: 0.9rem;
      margin-top: 5px;
      text-align: left;
    }

    .submit-btn {
      width: 100%;
      padding: 10px 20px;
      background-color: #66b3ff;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 1.1rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .submit-btn:hover {
      background-color: #3399ff;
    }

    .submit-btn:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

   
    .error {
      color: red;
      margin-top: 15px;
    }

    
    @media (max-width: 768px) {
      .login-container {
        padding: 20px;
      }

      h2 {
        font-size: 1.5rem;
      }

      input {
        padding: 8px;
        font-size: 0.9rem;
      }

      .submit-btn {
        font-size: 1rem;
      }
    }
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

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  message: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // onRegister() {
  //   if (this.registerForm.valid) {
  //     this.http.post('http://localhost:5000/register', this.registerForm.value)
  //       .subscribe(
  //         (res: any) => {
  //           this.message = res.message || 'Registration successful!';
  //         },
  //         (err) => {
  //           this.message = err.error.message || 'An error occurred during registration.';
  //           this.router.navigate(['/login']);
  //         }
  //       );
  //   } else {
  //     this.message = 'Please fill in all fields correctly.';
  //   }
  // }
  onRegister() {
    if (this.registerForm.valid) {
      this.http.post('http://localhost:5000/register', this.registerForm.value)
        .subscribe(
          (res: any) => {
            // Показване на съобщение за успешна регистрация
            this.message = res.message || 'Registration successful!';
            // Пренасочване към login
            this.router.navigate(['/login']);
          },
          (err) => {
            // Показване на грешка, ако има проблем при регистрацията
            this.message = err.error.message || 'An error occurred during registration.';
          }
        );
    } else {
      this.message = 'Please fill in all fields correctly.';
    }
  }
  
}

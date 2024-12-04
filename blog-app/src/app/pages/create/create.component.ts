import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  adForm: FormGroup;
  message: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.adForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      price: ['', [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit() {
    if (this.adForm.valid) {
      const token = localStorage.getItem('authToken');  
      if (!token) {
        this.message = 'You need to be logged in to create an ad!';
        return;
      }

   
      this.http.post('http://localhost:5000/create', this.adForm.value, {
        headers: {
          Authorization: `Bearer ${token}`  
        }
      })
      .subscribe(
        (res: any) => {
          this.message = res.message || 'Ad successfully added!';
          this.router.navigate(['/home']);
        },
        (err) => {
          this.message = err.error.message || 'An error occurred while adding the ad.';
        }
      );
    } else {
      this.message = 'Please fill in all fields correctly.';
    }
  }
}

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent  implements OnInit {
  ad: any = { title: '', description: '' };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const adId = this.route.snapshot.paramMap.get('id');
    if (adId) {
      this.loadAd(adId);
    }
  }

  loadAd(id: string) {
    this.http.get(`http://localhost:5000/ads/${id}`).subscribe(
      (response: any) => {
        this.ad = response;
      },
      (error) => {
        console.error('Error loading ad:', error);
      }
    );
  }

  saveAd() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this._snackBar.open('You are not authenticated. Please log in.', 'Close', { duration: 3000 });
      return;
    }
  
    const headers = { Authorization: `Bearer ${token}` };
  
    this.http.put(`http://localhost:5000/ads/${this.ad._id}`, this.ad, { headers }).subscribe(
      () => {
        this._snackBar.open('Ad updated successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/details', this.ad._id]);
      },
      (error) => {
        console.error('Error updating ad:', error);
      }
    );
  }
}

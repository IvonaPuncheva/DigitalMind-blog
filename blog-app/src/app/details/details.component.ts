import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  ad: any;

  constructor(private route: ActivatedRoute,
     private http: HttpClient,
    private _snackBar:MatSnackBar) {}

  ngOnInit(): void {
    const adId = this.route.snapshot.paramMap.get('id');
    if (adId) {
      this.fetchAdDetails(adId);
    }
  }

  fetchAdDetails(id: string) {
    this.http.get(`http://localhost:5000/ads/${id}`).subscribe(
      (response: any) => {
        this.ad = response;
      },
      (error) => {
        console.error('Error fetching ad details:', error);
      }
    );
  }
  likeAd() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this._snackBar.open('You need to be logged in to like this ad.', 'Close', { duration: 3000 });
      return;
    }

    this.http.post(`http://localhost:5000/ads/${this.ad._id}/like`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      (res: any) => {
        this.ad.likes = res.likes;
        this._snackBar.open('You liked this ad!', 'Close', { duration: 3000 });
      },
      (err) => {
        if (err.status === 400 && err.error.message === 'You have already liked this ad.') {
          this._snackBar.open('You have already liked this ad.', 'Close', { duration: 3000 });
        } else {
          console.error('Error liking ad:', err);
        }
      }
    );
  }
}

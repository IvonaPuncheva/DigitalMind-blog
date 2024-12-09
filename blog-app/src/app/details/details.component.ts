import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  ad: any;
  isOwner: boolean = false;
  comments: any[] = [];
  newComment: string = '';

  constructor(private route: ActivatedRoute,
     private http: HttpClient,
    private _snackBar:MatSnackBar,
    public authService: AuthenticationService,
    private router: Router) {}

  ngOnInit(): void {
    const adId = this.route.snapshot.paramMap.get('id');
    if (adId) {
      this.fetchAdDetails(adId);
      this.fetchComments(adId);
    }
  }

  fetchAdDetails(id: string) {
    this.http.get(`http://localhost:5000/ads/${id}`).subscribe(
      (response: any) => {
        this.ad = response;

        const currentUserId = this.authService.getCurrentUserId();
        this.isOwner = currentUserId === this.ad.userId._id; 
      },
      (error) => {
        console.error('Error fetching ad details:', error);
      }
    );
  }

  fetchComments(adId: string) {
    console.log('Fetching comments for ad:', adId);
    this.http.get(`http://localhost:5000/ads/${adId}/comments`).subscribe(
      (response: any) => {
        console.log('Fetched comments:', response); 
        this.comments = response;
      },
      (error) => {
        console.error('Error fetching comments:', error);
      }
    );
}



  addComment() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this._snackBar.open('You must be logged in to add a comment.', 'Close', { duration: 3000 });
      return;
    }

    if (!this.newComment.trim()) {
      this._snackBar.open('Comment text cannot be empty.', 'Close', { duration: 3000 });
      return;
    }

    this.http.post(
      `http://localhost:5000/ads/${this.ad._id}/comments`,
      { text: this.newComment.trim() },
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe(
      (response: any) => {
        this.comments.unshift(response.comment); 
        this.newComment = ''; 
        this._snackBar.open('Comment added successfully!', 'Close', { duration: 3000 });
      },
      (error) => {
        console.error('Error adding comment:', error);
        if (error.status === 400) {
          this._snackBar.open(error.error.message, 'Close', { duration: 3000 });
        } else {
          this._snackBar.open('Failed to add comment. Please try again.', 'Close', { duration: 3000 });
        }
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
  editAd() {
    if (this.isOwner) {
      this.router.navigate(['/edit', this.ad._id]);
    } else {
      this._snackBar.open('You are not authorized to edit this ad.', 'Close', { duration: 3000 });
    }
  }
  deleteAd() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this._snackBar.open('You are not authenticated. Please log in.', 'Close', { duration: 3000 });
      return;
    }
  
    if (!confirm('Are you sure you want to delete this ad?')) {
      return;
    }
  
    const headers = { Authorization: `Bearer ${token}` };
  
    this.http.delete(`http://localhost:5000/ads/${this.ad._id}`, { headers }).subscribe(
      () => {
        this._snackBar.open('Ad deleted successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/']); 
      },
      (error) => {
        console.error('Error deleting ad:', error);
        this._snackBar.open('Failed to delete the ad. Please try again.', 'Close', { duration: 3000 });
      }
    );
  }
  
}

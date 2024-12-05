
import { Component, OnInit, Inject } from '@angular/core';
import { AdsService } from '../../services/ads.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  ads: any[] = []; 

  constructor(
    private adsService: AdsService,
    private http: HttpClient,
    private router: Router,
    private _snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object 
  ) {}

  loadAds() {
    this.http.get<any[]>('http://localhost:5000/ads').subscribe(
      (res) => {
        this.ads = res; 
      },
      (err) => {
        console.error('Error loading ads:', err);
      }
    );
  }

 
likeAd(adId: string) {
  const token = localStorage.getItem('authToken');
  if (!token) {
    this._snackBar.open('You need to be logged in to like an ad.', 'Close', { duration: 3000 });
    return;
  }

  this.http.post(`http://localhost:5000/ads/${adId}/like`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  }).subscribe(
    (res: any) => {
      const ad = this.ads.find(ad => ad._id === adId);
      if (ad) {
        ad.likes = res.likes;
        this._snackBar.open('Ad liked successfully!', 'Close', { duration: 3000 });
      }
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


  ngOnInit() {
    this.loadAds(); 
  }
}



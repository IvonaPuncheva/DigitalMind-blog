import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  latestAds: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadLatestAds();
  }

  loadLatestAds() {
    this.http.get<any[]>('http://localhost:5000/ads').subscribe(
      (ads) => {

        this.latestAds = ads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);
      },
      (error) => {
        console.error('Error fetching latest ads:', error);
      }
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  ad: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

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
}

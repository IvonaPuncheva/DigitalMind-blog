import { Component, OnInit } from '@angular/core';
import { AdsService } from '../../services/ads.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
  ads: any[] = []; 

  constructor(private adsService: AdsService) { }

  ngOnInit(): void {
    this.loadAds();
  }


  loadAds(): void {
    this.adsService.getAds().subscribe(
      (data: any[]) => {
        this.ads = data;  
      },
      (error) => {
        console.error('Error loading ads', error);
      }
    );
  }
}
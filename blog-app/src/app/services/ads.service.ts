import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdsService {

  private apiUrl = 'http://localhost:5000/ads';

  constructor(private http: HttpClient) { }

  getAds(): Observable<any[]> {
  
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<any[]>(this.apiUrl, { headers });
    } else {
     
      return this.http.get<any[]>(this.apiUrl);
    }
    
    
  }
  likeAd(adId: string): Observable<any> {
        const token = localStorage.getItem('authToken');
        if (!token) {
          return new Observable(observer => {
            observer.error('Не сте влезли в профила си.');
          });
        }
    
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.post<any>(`http://localhost:5000/ads/${adId}/like`, {}, { headers });
      }
}

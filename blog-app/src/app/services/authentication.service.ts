import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly apiUrl = `http://localhost:5000`;
  private loginUrl = 'http://localhost:5000/login'; 

  constructor(private http: HttpClient) {}


  loginUser(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.loginUrl, { email, password }, { withCredentials: true }).pipe(
      tap(response => {
        if (response.accessToken) {
          localStorage.setItem('authToken', response.accessToken);
        }
      })
    );
}

  logout(): void {
    localStorage.removeItem('authToken');
    console.log('Logged out, token removed from localStorage');
  }


  isLoggedIn(): boolean {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return !!localStorage.getItem('authToken'); 
    }
    return false;
  }

  
  getCurrentUserId(): string | null {
    if (typeof window === 'undefined' || !localStorage) {
      // console.warn('localStorage is not available.');
      return null;
    }
  
    const token = localStorage.getItem('authToken');
    if (!token) return null;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); 
      return payload.id;
    } catch {
      return null;
    }
  }
  


  verifyToken(): Observable<any> {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        return of(false);
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
        console.log('Token expired. Attempting to refresh...');
        return this.refreshToken().pipe(
            map(response => !!response), 
            catchError(() => of(false))
        );
    }

    return of(true);
}

  
  
  refreshToken(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/refresh-token`, {}, { withCredentials: true }).pipe(
      tap(response => {
        if (response.accessToken) {
          localStorage.setItem('authToken', response.accessToken);
          console.log('Token refreshed successfully.');
        }
      }),
      catchError(err => {
        console.error('Error refreshing token:', err);
        this.logout();
        return of(null);
      })
    );
}

  httpGetWithAuth(endpoint: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };
  
    return this.http.get(`${this.apiUrl}/${endpoint}`, { headers });
  }
  
}

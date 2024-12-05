import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly apiUrl = `http://localhost:5000`;
  private loginUrl = 'http://localhost:5000/login'; 

  constructor(private http: HttpClient) {}

  loginUser(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.loginUrl, { email, password }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
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
  


  verifyToken(): Observable<any> {
    const token = localStorage.getItem('authToken');
    
    if (!token) return of(false);

    return this.http.post<any>(`${this.apiUrl}/verify-token`, { token }).pipe(
      catchError(() => of(false)) 
    );
  }
}

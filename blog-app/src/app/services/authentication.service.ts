import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly apiUrl = `http://localhost:5000`;  

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        localStorage.setItem('authToken', response.token);
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        throw error;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }


  isLoggedIn(): boolean {
  
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      return !!localStorage.getItem('authToken');
    }
    return false; 
  }
  
  
}


import { Component } from "@angular/core";

import { CommonModule } from "@angular/common";  
import { AuthenticationService } from "../services/authentication.service";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  template: `
   <nav class="navbar">
      <div class="navbar-brand">{{ title }}</div>
      <div class="navbar-center">
        <a class="nav-link" href="/home">Home</a>
        <a class="nav-link" href="/about">About</a>
        <a class="nav-link" href="/catalog">Catalog</a>
        <a *ngIf="authService.isLoggedIn()" class="nav-link" href="/create">Create</a>
      </div>
      <div class="navbar-right">
        <a *ngIf="!authService.isLoggedIn()" class="nav-link" href="/login">Login</a>
        <a *ngIf="!authService.isLoggedIn()" class="nav-link" href="/register">Register</a>
        <a *ngIf="authService.isLoggedIn()" (click)="logout()" class="nav-link">Logout</a>
      </div>
    </nav>
  `,

  imports: [CommonModule],  
})
export class NavBarComponent {
  title = 'DIGITAL MIND';

  constructor(public authService: AuthenticationService) {}

  logout() {
    this.authService.logout();
  }
}

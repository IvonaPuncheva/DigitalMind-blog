import { Component } from "@angular/core";


@Component({
    selector: 'app-nav-bar',
    standalone: true,
    template: `
      <div class="nav-bar">
        <div>{{ title }}</div>
        <a class="nav-btn" href="/home">Home</a>
        <a class="nav-btn" href="/about">About</a>
        <a class="nav-btn" href="/catalog">Catalog</a>
        <a class="nav-btn" href="/login">Login</a>
        <a class="nav-btn" href="/register">Register</a>
      </div>
    `,
    styles: [`
      .nav-bar {
        width: 100%;
        height: 80px;
        padding: 20px;
        background-color: skyblue;
        color: #000;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .nav-btn {
        margin-left: 10px;
        border: 1px solid black;
        padding: 10px;
        text-decoration: none;
        color: black;
      }
      .nav-btn:hover {
        cursor: pointer;
        background-color: grey;
        color: #fff;
      }
    `]
  })
  export class NavBarComponent {
    title = 'My Nav Component';
  }
  
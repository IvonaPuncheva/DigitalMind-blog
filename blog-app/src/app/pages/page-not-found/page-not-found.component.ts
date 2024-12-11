// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-page-not-found',
//   imports: [],
//   templateUrl: './page-not-found.component.html',
//   styleUrl: './page-not-found.component.css'
// })
// export class PageNotFoundComponent {

// }

import { Component } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  template: `
    <div class="page-not-found-container">
      <h1>404</h1>
      <p>Page Not Found</p>
      <p>Sorry, the page you're looking for doesn't exist.</p>
      <a href="/home" class="home-link">Go to Home Page</a>
    </div>
  `,
  styles: [
    `
      .page-not-found-container {
        text-align: center;
        padding: 50px;
      }

      .page-not-found-container h1 {
        font-size: 100px;
        color: #f44336;
      }

      .page-not-found-container p {
        font-size: 24px;
      }

      .page-not-found-container .home-link {
        display: inline-block;
        margin-top: 20px;
        padding: 10px 20px;
        background-color: #2196f3;
        color: white;
        text-decoration: none;
        border-radius: 5px;
      }

      .page-not-found-container .home-link:hover {
        background-color: #0b79d0;
      }
    `,
  ],
})
export class PageNotFoundComponent {}

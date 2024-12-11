# DigitalMind-blog
Angular-spa-SoftUni Project
## Description

Digital Mind is a web application based on Angular as the frontend framework, providing a platform for sharing and discovering scientific articles and research. This single-page application allows users to browse the latest scientific publications, like, comment, and share their opinions. Additionally, every user can upload new articles.The backend of the application is implemented through Rest-API, which provides the necessary routes, models, and controllers to manage user content and interact with the database. Data is stored in MongoDB.
## Installation Instructions

### Backend
1. Navigate to the `backend` folder.
2. Install the necessary dependencies by running the following command in the terminal:
   ```bash
   npm install
   ```
3. Start the server by running:
   ```bash
   node server.js
   ```

### Frontend
1. Navigate to the `blog-app` folder.
2. Install the necessary dependencies by running the following command in the terminal:
   ```bash
   npm install
   ```
3. Start the Angular application by running:
   ```bash
   ng serve
   ```


## Technologies Used

### Backend
- Express
- Mongoose
- jsonwebtoken
- cookie-parser


### Frontend
- Angular
- Angular Material Snackbar


## Usage Instructions

- **Home page** : Home Page is public for all users. On it, users can see the most recently added cats.

- **All Article Page**: Page available for all users and it contains all the created articles.

- **Login Page**: Login form requires email and password
  Form Validation:
the email should be in a valid email format

- **Register Page**: Register form requires email, username and password
  Form Validation:
the validation for the email is the same as in login.

- **Create an articlePage**:
 Create article Page allows the logged in user to create their own articlethat will be available in the all devices page and also the owner of that articlewill be able to edit and delete the article.      
<!--  
         There are 2 input fileds and each one of them have validation. If an error occurs in the backend it is handled in the 'create.component' component and will be shown as a message to the user. When the offer is successfully made the user will be automatically redirected to All article page. -->

 - **Details Page**: This page is available for all users they can see the article plus comment section. If this page is opened by the owner of the device they will be able to see edit and delete buttons.

 - **Edit Page** : This page is available for logged in users only that are the creator of the article.  If the edit is successful the user will be redirected to the details page od the edited article.
  
- **Delete Page**: Users can delete their own listings.
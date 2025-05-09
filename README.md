# MovieVerse - Your Personalized Movie Discovery Platform

[![React](https://img.shields.io/badge/React-Library-blueviolet.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Runtime-success.svg)](https://nodejs.org/en/)
[![Express.js](https://img.shields.io/badge/Express.js-Framework-yellowgreen.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-orange.svg)](https://www.mongodb.com/)

## ✨ Elevate Your Movie Discovery Experience

MovieVerse is a modern, user-centric web application built with the MERN stack, designed to provide a seamless and personalized way to explore, organize, and save your favorite movies. Tired of endless scrolling and generic recommendations? MovieVerse empowers you to take control of your movie journey with intuitive features and a responsive design.

## 🚀 Key Features

* **Secure User Authentication:** Robust sign-up and login system with password hashing (bcrypt) and JWT-based session management.
* **Personalized Watchlist & Likes:** Effortlessly add movies to your watchlist and mark your favorites, with data persisted across sessions.
* **Advanced Search & Filtering:** Discover movies by title, genre, actor, or director. Refine your search with filters for genre, language, release year, and sorting options.
* **Responsive & Intuitive Interface:** Enjoy a smooth and engaging browsing experience on any device, powered by React.js.
* **Admin Panel (Secured):** Administrators can efficiently manage the movie database, adding, editing, and deleting movie entries.
* **Real-time Interactions:** All your likes and watchlist updates are reflected instantly, providing a dynamic user experience.
* **Scalable MERN Architecture:** Built with a modular design and efficient data handling for optimal performance as the movie library and user base grow.
* **Intelligent Recommendations:** Discover movies tailored to your viewing history and preferences on the main dashboard.
* **Top Directors Insights:** Explore a dedicated page showcasing top directors, calculated using an average review algorithm for insightful discovery.

## 🖼️ Screenshots

### Main Dashboard & Recommendations

The main dashboard provides a visually appealing overview of featured movies and personalized recommendations based on your viewing history.

![Main Dashboard & Recommendations](https://github.com/user-attachments/assets/1e8d0b05-11aa-48a8-8103-dabe5ef08265)

### Top Directors

Discover influential filmmakers on the dedicated "Top Directors" page, ranked using an average review algorithm to highlight critically acclaimed talent.

![Top Directors](https://github.com/user-attachments/assets/b093be9a-b568-4c1d-8a9c-39c00e4748d2)


## 🛠️ Technologies Used

* **Frontend:**
    * [React.js](https://react.dev/): For building a dynamic and interactive user interface with reusable components.
    * [React Router](https://reactrouter.com/): For client-side routing and navigation.
    * [Axios](https://axios-http.com/): For making HTTP requests to the backend API.
    * [Styled-components](https://styled-components.com/): For component-level styling and maintainability.
* **Backend:**
    * [Node.js](https://nodejs.org/en/): As the JavaScript runtime environment.
    * [Express.js](https://expressjs.com/): A minimalist web application framework for building the RESTful API.
    * [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): For secure authentication and session management.
    * [bcrypt](https://www.npmjs.com/package/bcrypt): For hashing user passwords.
    * [cors](https://www.npmjs.com/package/cors): For enabling Cross-Origin Resource Sharing.
* **Database:**
    * [MongoDB](https://www.mongodb.com/): A NoSQL database for flexible and scalable data storage.
    * [Mongoose](https://mongoosejs.com/): An Object Data Modeling (ODM) library for MongoDB.
* **Development & Testing:**
    * [Git](https://git-scm.com/): For version control.
    * [GitHub](https://github.com/): For collaborative development and repository hosting.
    * [Postman](https://www.postman.com/): For API testing and validation.
    * [MongoDB Compass](https://www.mongodb.com/products/compass): For GUI-based database management.

## ⚙️ Getting Started

Follow these steps to get MovieVerse up and running on your local machine:

### Prerequisites

* [Node.js](https://nodejs.org/en/) (version >= 18)
* [npm](https://www.npmjs.com/) (usually installed with Node.js)
* [MongoDB](https://www.mongodb.com/try/download/community) (running locally or a cloud instance)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd MovieVerse
    ```

2.  **Install backend dependencies:**
    ```bash
    cd server
    npm install
    ```

3.  **Configure backend environment variables:**
    Create a `.env` file in the `backend` directory and add your MongoDB connection URI and JWT secret:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
    PORT=5000 # Or your preferred port
    ```

4.  **Start the backend server:**
    ```bash
    npm start
    ```
    (Runs on `http://localhost:5000` by default)

5.  **Navigate to the frontend directory:**
    ```bash
    cd ../client
    ```

6.  **Install frontend dependencies:**
    ```bash
    npm install
    ```

7.  **Configure frontend environment variables:**
    Create a `.env.local` file in the `client` directory and set the backend API URL:
    ```env
    REACT_APP_API_URL=http://localhost:5000/api
    ```

8.  **Start the frontend development server:**
    ```bash
    npm start
    ```
    (Usually runs on `http://localhost:3000`)

---

**This project demonstrates a strong understanding of the MERN stack and the ability to build a full-fledged, user-centric web application with advanced features like personalized recommendations and data-driven insights (Top Directors). The included screenshots and data flow diagram provide a clear overview of the application's functionality and architecture, making it a compelling addition to any portfolio.**

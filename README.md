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
    cd backend
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
    cd ../frontend
    ```

6.  **Install frontend dependencies:**
    ```bash
    npm install
    ```

7.  **Configure frontend environment variables:**
    Create a `.env.local` file in the `frontend` directory and set the backend API URL:
    ```env
    REACT_APP_API_URL=http://localhost:5000/api
    ```

8.  **Start the frontend development server:**
    ```bash
    npm start
    ```
    (Usually runs on `http://localhost:3000`)

## 🖼️ Screenshots

*(You can add some compelling screenshots of the application here to showcase the UI and key features. This will significantly enhance the visual appeal for recruiters.)*

## 🤝 Contributing

Contributions are welcome! If you have ideas for improvements or find any issues, please feel free to open a pull request or submit an issue on GitHub.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Show Your Support

If you find MovieVerse helpful or interesting, consider giving it a star on GitHub! ⭐

## 📬 Contact

[Your Name/Organization] - [Your Email/Website]

---

**This project demonstrates a strong understanding of the MERN stack and the ability to build a full-fledged, user-centric web application. The features implemented showcase practical skills in authentication, data management, API design, and responsive frontend development.**

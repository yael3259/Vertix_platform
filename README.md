# Vertix Platform – Frontend (React.js)

## Project Description
**Vertix** is a modern social platform for goal management and personal achievements. This project represents the **Frontend** of the application, built with **React.js**. It provides a dynamic and responsive user interface that allows users to seamlessly interact with all features, including creating posts, tracking achievements, connecting with others, and receiving real-time notifications.

---

## Table of Contents
* [Features](#features)
* [Technologies](#technologies)
* [Folder Structure](#folder-structure)
* [Components & Pages](#components--pages)
* [Installation & Usage](#installation--usage)

---

## Features
* **Dynamic User Interface**: Single-page application (SPA) built with React for a fast and smooth user experience.
* **User Management**: User registration, secure login, password reset functionality, and profile editing.
* **Posts & Feed**: A main feed displaying posts, with features for creating, editing, and deleting posts (via the profile of the posting user), as well as liking and commenting.
* **Achievement System**: A visual interface for managing daily achievements and weekly boosts, with a real-time tracking table.
* **Social Network**: The ability to search for and follow other users, as well as view a list of followers and followed users.
* **Leaderboard**: A display of the weekly leaderboard, with an animated announcement for top-ranking users.
* **Notifications & Alerts**: Real-time alerts for likes, comments, and new followers, as well as a dedicated notification page.
* **Responsive Design**: The application's design is fully responsive and optimized for various screen sizes, from mobile phones to desktop computers.

---

## Technologies
* **React.js**: A JavaScript library for building user interfaces.
* **React Router DOM**: For managing navigation and routing within the application.
* **Axios**: For making API requests to the backend server.
* **Framer Motion**: For creating smooth animations and transitions.
* **Multer & Sharp**: Used for image uploads and processing (likely via an external service or a backend microservice).
* **date-fns**: For working with dates and times.
* **React Select & React Hook Form**: For building forms and managing form state.
* **Lucide React & React Icons**: Icon libraries.
* **Canvas Confetti**: For celebratory visual effects.

---

## Folder Structure
* `public/`: Contains static files like the `index.html` file and the application's logo.
* `src/`: The main source code directory.
    * `components/`: Reusable components such as alerts, buttons, and display cards.
    * `files/`: Static assets like icons and images used within the application.
    * `fonts/`: Custom fonts for styling.
    * `pages/`: The main pages of the application (e.g., Home, Profile, Login).
    * `routes/`: API service files containing all the functions for interacting with the backend.
    * `styles/`: All CSS files for styling the components and pages.
    * `App.js`: The root component that manages the entire application's structure.
    * `index.js`: The main entry point of the React application.

---

## Components & Pages

### Pages
* `Home.js`: The main feed for displaying posts.
* `Profile.js`: The user's personal profile page, showing posts, achievements, and user information.
* `Login.js` / `Sign-in.js`: Pages for user authentication.
* `EditUserDetails.js`: A form for editing the user's profile information.
* `EditPost.js`: A form for editing a post.
* `Network.js`: The page for viewing and managing a user's network.
* `Contact.js`: A contact form.
* `Leaderboard.js`: A page that displays the weekly leaderboard.

### Components
* `Alerts & Modals`: Reusable pop-up components for notifications and user confirmation, such as `EarningPointsAlert.js`, `FavoritePostAlert.js`, and `ConfirmUserDelete.js`.
* `UserBadge.js`: A component that displays a user's rank badge based on their points.
* `EditOptionsMenu.js`: A menu for editing or deleting a post.
* `SinglePost.js`: A component that displays a single post and its content.
* `BoostInvite.js`: A modal that invites users to participate in the weekly boost.

---

## API Endpoints

### Users (`/domain/api/user`)
| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Retrieves all users |
| `GET` | `/:userId` | Retrieves a specific user by ID |
| `POST` | `/` | Creates a new user |
| `POST` | `/login` | Authenticates a user and returns a JWT |
| `PUT` | `/` | Resets a user's password |
| `PUT` | `/update/:userId` | Updates a user's details |
| `PUT` | `/updatePoints/:userId` | Adds points to a user's score |
| `DELETE` | `/:userId` | Deletes a user |

### Posts (`/domain/api/post`)
| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Retrieves all posts |
| `GET` | `/:userId` | Retrieves all posts by a specific user |
| `POST` | `/` | Creates a new post |
| `POST` | `/like/:userId` | Adds or removes a like on a post |
| `POST` | `/comment/:postId` | Adds a comment to a post |
| `PUT` | `/:postId` | Edits an existing post |
| `DELETE` | `/:postId` | Deletes a post |

### Achievements (`/domain/api/achievement`)
| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Retrieves all achievements |
| `GET` | `/achievements/:userId`| Retrieves achievements for a specific user |
| `POST` | `/` | Creates a new achievement |
| `POST` | `/boost` | Creates a new boost |
| `PUT` | `/updateAchievement/:achievementId` | Updates an achievement's status |
| `PUT` | `/updateBoost/:boostId` | Updates a boost's status |

---

## Installation & Usage

1.  **Clone the Repository**
    Start by cloning the project code from the repository and navigating into the directory:
    ```bash
    git clone [https://github.com/yael3259/Vertix-platform.git](https://github.com/yael3259/Vertix-platform.git)
    cd Vertix-platform
    ```
2.  **Install Dependencies**
    Install all the necessary project dependencies by running the following command:
    ```bash
    npm install
    ```
3.  **Configure `.env` file**
    Create a new file named `.env` in the project root. This file will store the URL of your backend server.
    ```
    REACT_APP_BASE_URL=http://localhost:5000/domain/api
    ```
4.  **Start the Server**
    To run the application, use the following command:
    ```bash
    npm start
    ```
    The application will run on your local machine and will be accessible at `http://localhost:3000` by default.
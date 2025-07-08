

# ArtiFeed – Article Feed Web Application

**FeedIn** is a full-stack article feed web application built using the **MERN stack (MongoDB, Express.js, React, Node.js) + Next.js + backend in clean architecture**. It provides a personalized content experience where users can view articles posted by others, create and manage their own content, and interact with the platform based on their preferences.

##  Live Demo

[https://arti-feed.vercel.app](https://arti-feed.vercel.app) 

##  Developed by

**Muhammed Shuraif**

---

##  Features

###  User-Side Functionality

* **Authentication**: Sign up and log in with secure JWT-based authentication.
* **Feed View**: See articles posted by others, filtered based on user preferences.
* **Explore View**: See all articles including those outside of user preferences.
* **Article Management**:

  * Create articles with cover image
  * Edit or delete your articles
* **Interactions**:

  * Like and dislike articles
  * Hide specific articles from your feed
* **Profile Management**:

  * Update profile information 
  * View your posted articles and activity

###  Admin Features

* **User Management**:

  * View and manage all registered users
  * Block  inappropriate users
* **Preference Management**:

  * Create and manage system-wide categories
  * Tailor content suggestions across the platform

---

##  Project Structure

```

ARTIFEED/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   └── pages/
│   ├── public/
│   └── package.json
│
├── server/                 # Backend API
│   ├── src/
│   │   ├── application/
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   ├── main/
│   │   ├── presentation/
│   │   ├── shared/
│   ├── .env
│   └── package.json
└── README.md

```

---

##  Local Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Shuraifp/ArtiFeed.git
cd feedin
```

### 2. Backend Setup

```bash
cd server
npm install
```

#### Create a `.env` file in the `server/` directory with:

```env
MONGO_URI=<atlas-conn-string>
JWT_SECRET=<your-secret>
FRONTEND_URL=http://localhost:3000
PORT=5000
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../client
npm install
```


Start the frontend:

```bash
npm run dev
```

* Frontend runs at `http://localhost:3000`

---

##  Prerequisites

* Node.js v18+ recommended
* MongoDB (Atlas)
* Next.js App router

---

##  License

This project is open-source under the [MIT License](LICENSE).

---

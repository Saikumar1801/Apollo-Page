# Apollo 24|7 Clone - Doctor Listing Page

This project is a simplified clone of the Apollo 24|7 doctor listing page, specifically focusing on the "General Physician / Internal Medicine" specialty. It features a Next.js frontend, a Node.js/Express.js backend, and a PostgreSQL database.

The primary goal is to demonstrate:
-   Building a specific destination page with Next.js.
-   Implementing functional filters.
-   Serving data via REST APIs from a custom backend.
-   Basic off-page SEO implementation.

**Live Demo (Frontend Only - Data may be mocked or unavailable if backend is not also deployed):**
[Link to your Vercel/Netlify deployment of the frontend] - *Replace this with your actual deployed frontend URL*

**Backend API (if deployed separately):**
[Link to your Render/Heroku/etc. deployment of the backend] - *Replace this with your actual deployed backend URL*

## Features

**Frontend (Next.js):**
-   **Destination Page:** `/specialties/general-physician-internal-medicine`
    -   Header (static)
    -   Doctor listing cards
    -   Breadcrumbs (static)
-   **Functional Filters:**
    -   Sort By (Relevance, Experience, Price)
    -   Gender
    -   Availability (Today, Tomorrow, Next 7 days)
    -   Consultation Type (Video, In-person)
    -   Language
    -   Experience (Years)
    -   Consultation Fee
-   **Pagination:** For browsing through doctor listings.
-   **Off-Page SEO:**
    -   Dynamic meta tags (title, description, canonical).
    -   Open Graph and Twitter Card meta tags.
    -   JSON-LD Structured Data for the listing page and individual doctors.
    -   Server-Side Rendering (SSR) for initial data load.

**Backend (Node.js, Express.js, PostgreSQL):**
-   **API Endpoints:**
    -   `POST /api/doctors/add`: Add a new doctor to the database.
    -   `GET /api/doctors`: List doctors with filtering, sorting, and pagination.
-   **Database:** PostgreSQL for storing doctor information.

## Project Structure
```bash
apollo-clone/
├── backend/ # Node.js, Express.js API
│ ├── .env # Environment variables (DB connection, port)
│ ├── db.js # PostgreSQL connection setup
│ ├── server.js # Express server and API routes
│ └── package.json
├── frontend/ # Next.js UI Application
│ ├── .env.local # Environment variables (API URL)
│ ├── components/ # React components (Header, Filters, DoctorCard, etc.)
│ ├── pages/ # Next.js pages (including the destination page)
│ │ └── specialties/
│ │ └── general-physician-internal-medicine.tsx
│ ├── public/ # Static assets (logo, favicon)
│ ├── styles/ # Global CSS and Tailwind setup
│ ├── next.config.ts
│ ├── package.json
│ └── tsconfig.json
└── README.md # This file
└── .gitignore # Root gitignore

```

## Technologies Used

-   **Frontend:**
    -   Next.js (React Framework)
    -   TypeScript
    -   Tailwind CSS
-   **Backend:**
    -   Node.js
    -   Express.js
    -   `pg` (Node.js PostgreSQL client)
-   **Database:**
    -   PostgreSQL
-   **Development:**
    -   `nodemon` (for backend auto-reload)
    -   `cors` (for cross-origin requests)
    -   `dotenv` (for environment variables)

## Setup and Installation

### Prerequisites
-   Node.js (v18.x or later recommended)
-   npm or yarn
-   PostgreSQL (running locally or accessible via a connection string)
-   Git

### 1. Clone the Repository
```bash
git clone https://github.com/Saikumar1801/Apollo-24-7-Clone-Doctor-Listing-Page.git
cd Apollo-24-7-Clone-Doctor-Listing-Page
```
cd backend
npm install
### 2. Backend Setup
 Create a .env file in the 'backend' directory
 (copy from .env.example if provided, or create manually)
 and fill in your PostgreSQL details:
 Example backend/.env file:
```bash
 DB_USER=your_postgres_user
 DB_HOST=localhost
 DB_DATABASE=apollo_clone_db
 DB_PASSWORD=your_postgres_password
 DB_PORT=5432
 PORT=5001
```
## Setup PostgreSQL Database:
 1. Ensure PostgreSQL server is running.
 2. Create the database (e.g., 'apollo_clone_db'):
```bash
    CREATE DATABASE apollo_clone_db;
```
3. Connect to the database and run the table creation script:
    (The SQL for table creation is in the initial project description or can be found in backend/server.js comments if embedded)
###    Example:
```bash
    psql -U your_postgres_user -d apollo_clone_db
    \i path/to/your/schema.sql  OR paste the CREATE TABLE statement:
    CREATE TABLE doctors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        specialization VARCHAR(255) DEFAULT 'General Physician / Internal Medicine',
        experience_years INTEGER,
        languages_spoken TEXT[] DEFAULT '{}',
        gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Any')),
        consultation_fee INTEGER,
        availability_days TEXT[] DEFAULT '{}',
        consultation_types TEXT[] DEFAULT '{}',
        image_url VARCHAR(255) DEFAULT 'https://via.placeholder.com/80',
        next_available_slot VARCHAR(100) DEFAULT 'Tomorrow, 10:00 AM',
        rating NUMERIC(2,1) DEFAULT 4.5,
        profile_slug VARCHAR(255) UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
```

 Backend will be running on http://localhost:5001 (or the PORT specified in .env)

 Open a new terminal window/tab
```bash
cd ../frontend # Navigate back to root, then into frontend
npm install
```

 Create a .env.local file in the 'frontend' directory
 and specify the backend API URL:
 Example frontend/.env.local file:
```bash
 NEXT_PUBLIC_API_URL=http://localhost:5001/api
```
Start the frontend development server
```bash
npm run dev
```
 Frontend will be running on http://localhost:3000

## Contributing
This is a demo project. Contributions are welcome for educational purposes or improvements.
Fork the repository.
Create your feature branch (git checkout -b feature/AmazingFeature).
Commit your changes (git commit -m 'Add some AmazingFeature').
Push to the branch (git push origin feature/AmazingFeature).
Open a Pull Request.

## Future Enhancements (Beyond Scope of Initial Request)
Individual doctor profile pages.
Actual "Book Appointment" functionality.
User authentication.
More advanced search capabilities.
More sophisticated filter components (range sliders, multi-select).
Dedicated API endpoints for filter options (e.g., unique languages).
Unit and integration tests.

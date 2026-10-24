# School Backend - MySQL Version

This backend has been converted from MongoDB/Mongoose to MySQL using `mysql2`.

## 1. Requirements
- Node.js
- XAMPP (Apache is optional; MySQL/MariaDB must be running)
- MySQL database

## 2. Database
Open phpMyAdmin -> SQL and run `database.sql`.

## 3. Environment
Copy `.env.example` to `.env` and set your MySQL credentials:

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=school

## 4. Install and run
```bash
npm install
npm run dev
```

The API runs on `http://localhost:5000`.

## API routes
- GET/POST/DELETE `/api/admission`
- GET/POST/DELETE `/api/contact`
- GET/POST/DELETE `/api/notice/:category` and `/api/notice/create`
- GET/POST/PUT/DELETE `/api/holiday`
- GET/POST/DELETE `/api/gallery/:category` and `/api/gallery/upload`

### Important
MongoDB is no longer required. The project uses integer MySQL IDs. For frontend compatibility, API responses also expose `_id` with the same numeric ID.

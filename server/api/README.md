# Salamatek Backend API

This is the Node.js, Express, and MongoDB backend for the Salamatek Medical Centre.

## Requirements
- Node.js >= 20.0.0
- MongoDB (local or Atlas)

## Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Update the environment variables in `.env`:
   - `PORT`: The port the server will run on (default 5000)
   - `MONGODB_URI`: Your MongoDB connection string
   - `CLIENT_URL`: The URL of the frontend (e.g. `http://localhost:3000`) for CORS

3. Install dependencies:
   ```bash
   npm install
   ```

## Development
To start the development server with hot-reload:
```bash
npm run dev -w @salamatek/api
```

## Production Build
To compile TypeScript to JavaScript:
```bash
npm run build -w @salamatek/api
```
To start the production server:
```bash
npm start -w @salamatek/api
```

## Available Endpoints

### Health
- `GET /api/health` - Check API status

### Doctors
- `GET /api/doctors` - Get all doctors (supports `page`, `limit`, `search`, `departmentId`, `active`)
- `GET /api/doctors/:id` - Get a doctor by ID
- `POST /api/doctors` - Create a new doctor
- `PATCH /api/doctors/:id` - Update a doctor
- `DELETE /api/doctors/:id` - Delete a doctor

### Departments
- `GET /api/departments` - Get all departments (supports `page`, `limit`, `search`, `active`)
- `GET /api/departments/:id` - Get a department by ID
- `POST /api/departments` - Create a new department
- `PATCH /api/departments/:id` - Update a department
- `DELETE /api/departments/:id` - Delete a department

### Services
- `GET /api/services` - Get all services (supports `page`, `limit`, `search`, `departmentId`, `active`)
- `GET /api/services/:id` - Get a service by ID
- `POST /api/services` - Create a new service
- `PATCH /api/services/:id` - Update a service
- `DELETE /api/services/:id` - Delete a service

# Lala Ops

Lala Ops is an AI-powered operations management platform for Lala Tech LLC. It centralizes incoming operational requests, uses AI to understand them, converts them into structured tasks, assigns tasks to employees, tracks execution, and provides managers with operational visibility.

## Technology Stack
- **Frontend**: React, Vite, Tailwind CSS, Axios
- **Backend**: Node.js, Express

## Project Structure
- `client/`: React frontend
- `server/`: Express backend

## Installation
1. Clone the repository
2. Install frontend dependencies:
   ```bash
   cd client
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

## Environment Setup
Copy the `.env.example` files to `.env.local` or `.env` in both the `client` and `server` directories.

## How to start backend
```bash
cd server
node src/server.js
```

## How to start frontend
```bash
cd client
npm run dev
```

## API Health Endpoint
The backend includes a health check endpoint:
- `GET /api/health`
Returns: `{"success": true, "message": "Lala Ops API is running"}`

# Customer Feedback System - Frontend

A React-based frontend for the Customer Feedback System that allows customers to submit feedback and admins to manage it.

## Features

- **Customer Interface**: Submit feedback with ratings and reviews
- **Admin Panel**: View, edit, and delete feedback with authentication
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Dynamic feedback management

## Technologies Used

- React 19
- Axios for API calls
- Tailwind CSS for styling
- Vite for build tooling

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

## Available Scripts

- `npm run dev` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## Admin Credentials

- Username: `admin`
- Password: `password123`

## API Integration

The frontend connects to the Flask backend running on `http://127.0.0.1:5000`

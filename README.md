# Customer Feedback System

A full-stack web application that allows customers to submit feedback (reviews and ratings) for products or services, with an admin panel for managing feedback.

## Features

### Customer Features
- Submit feedback with ratings (1-5 stars) and reviews
- Simple, user-friendly interface
- Input validation and spam protection

### Admin Features
- Secure authentication (JWT-based)
- View all feedback with statistics
- Edit feedback content and ratings
- Delete inappropriate feedback
- Dashboard with summary statistics

### Security Features
- JWT token-based authentication
- Input validation on both frontend and backend
- Protected admin routes
- CORS configuration for secure API access

## Technologies Used

### Backend
- **Flask** - Python web framework
- **MongoDB** - NoSQL database for storing feedback
- **PyJWT** - JWT token handling
- **Flask-CORS** - Cross-origin resource sharing
- **Werkzeug** - Password hashing

### Frontend
- **React 19** - Modern UI library
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server

## Project Structure

```
├── backend/
│   ├── app.py              # Flask application
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── AdminLogin.jsx # Admin login component
│   │   └── main.jsx       # React entry point
│   ├── package.json       # Node.js dependencies
│   └── vite.config.js     # Vite configuration
└── README.md
```

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Update the `.env` file with your MongoDB connection string:
```
MONGO_URI="your-mongodb-connection-string"
SECRET_KEY="your-secret-key"
```

5. Run the Flask application:
```bash
python app.py
```

The backend will be available at `http://127.0.0.1:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Public Endpoints
- `POST /api/feedback` - Submit customer feedback
- `GET /api/feedback` - Get all feedback (public view)

### Authentication
- `POST /api/login` - Admin login

### Protected Admin Endpoints
- `GET /api/admin/feedback` - Get all feedback with statistics
- `PUT /api/feedback/<id>` - Update feedback
- `DELETE /api/feedback/<id>` - Delete feedback

## Admin Credentials

- **Username**: `admin`
- **Password**: `password123`

*Note: Change these credentials in production by updating the `ADMIN_CREDENTIALS` in `app.py`*

## Database Schema

### Feedback Collection
```json
{
  "_id": "ObjectId",
  "product_id": "string",
  "customer_name": "string", 
  "rating": "number (1-5)",
  "review_text": "string",
  "created_at": "datetime"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
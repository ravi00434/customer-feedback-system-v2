# Deployment Guide - Customer Feedback System

## Quick Deployment Options

### Option 1: Render (Backend) + Netlify (Frontend) - FREE
**Best for: Simple deployment, free tier available**

#### Backend on Render:
1. Push your code to GitHub
2. Go to [render.com](https://render.com) and sign up
3. Click "New Web Service" and connect your GitHub repo
4. Select the `backend` folder
5. Set environment variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `SECRET_KEY`: Will be auto-generated
6. Deploy! Your API will be at `https://your-app.onrender.com`

#### Frontend on Netlify:
1. Go to [netlify.com](https://netlify.com) and sign up
2. Drag and drop your `frontend` folder OR connect GitHub
3. Update `frontend/src/App.jsx` and `AdminLogin.jsx`:
   ```javascript
   const API_BASE_URL = 'https://your-render-app.onrender.com/api';
   ```
4. Deploy! Your site will be at `https://your-site.netlify.app`

### Option 2: Vercel (Full Stack) - FREE
**Best for: Easy full-stack deployment**

#### Deploy Both:
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Vercel will auto-detect and deploy both frontend and backend
4. Set environment variables in Vercel dashboard:
   - `MONGO_URI`
   - `SECRET_KEY`

### Option 3: Railway - FREE TIER
**Best for: Simple deployment with database**

1. Go to [railway.app](https://railway.app)
2. Connect GitHub repo
3. Deploy both services
4. Add MongoDB plugin or use your Atlas connection

### Option 4: Heroku - PAID
**Best for: Production apps**

#### Backend:
```bash
# Install Heroku CLI first
heroku create your-feedback-backend
heroku config:set MONGO_URI="your-connection-string"
heroku config:set SECRET_KEY="your-secret-key"
git subtree push --prefix backend heroku main
```

#### Frontend:
Deploy to Netlify or Vercel as above.

## Environment Variables Needed

### Backend (.env):
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/FeedbackDB
SECRET_KEY=your-super-secret-key-change-this-in-production
PORT=5000
```

### Frontend:
Update API URLs in:
- `src/App.jsx`
- `src/AdminLogin.jsx`

Change from:
```javascript
const API_BASE_URL = 'http://127.0.0.1:5000/api';
```

To your deployed backend URL:
```javascript
const API_BASE_URL = 'https://your-backend-url.com/api';
```

## Pre-Deployment Checklist

- [ ] MongoDB Atlas cluster is set up and accessible
- [ ] Environment variables are configured
- [ ] Frontend API URLs point to production backend
- [ ] Admin credentials are changed from defaults
- [ ] CORS is configured for your frontend domain
- [ ] All dependencies are in requirements.txt and package.json

## Security Notes for Production

1. **Change admin credentials** in `backend/app.py`
2. **Use strong SECRET_KEY** (generate with `python -c "import secrets; print(secrets.token_hex(32))"`)
3. **Restrict CORS** to your frontend domain only
4. **Use HTTPS** (most platforms provide this automatically)
5. **Monitor your MongoDB Atlas usage**

## Recommended: Start with Render + Netlify

This combo gives you:
- ✅ Free hosting for both services
- ✅ Automatic deployments from GitHub
- ✅ HTTPS by default
- ✅ Easy environment variable management
- ✅ Good performance and reliability

Total cost: $0/month for moderate usage!
# TaskTimer - Full-Stack Productivity Tracker

A modern, feature-rich task and time tracking application built with React, Node.js, and MongoDB. Track your productivity with an elegant Pomofocus-inspired interface.

## 🔑 Test Credentials

For easier review and testing, you can use these demo credentials:

**Demo Account:**

- **Username:** `auqidirfan100@gmail.com`
- **Password:** `auqid`

_Or feel free to create your own account using the signup feature._

## 🌐 Live Demo

- **Frontend:** https://frontend-production-85ff.up.railway.app
- **Backend API:** https://backend-production-9b60.up.railway.app

## ✅ Requirements Checklist

- ✅ **Live demo link** - Both frontend and backend URLs provided
- ✅ **Working authentication** - JWT-based login/signup system
- ✅ **Test credentials** - Demo account for easy review

## ✨ Features

### 🎯 Task Management

- Create, edit, and delete tasks
- Set task status (Pending, In Progress, Completed)
- Rich task descriptions and titles

### ⏱️ Time Tracking

- Real-time timer with live updates
- Start/stop functionality with visual indicators
- Automatic timer stop when marking tasks complete
- Persistent timer state across sessions

### 📊 Productivity Analytics

- Daily summary dashboard
- Total time tracked per day
- Productivity level indicators
- Task completion statistics
- Visual progress bars

### 🎨 Modern UI/UX

- Glassmorphism design inspired by Pomofocus
- Responsive design for all devices
- Smooth animations and micro-interactions
- Clean, distraction-free interface

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and development server
- **CSS Modules** - Scoped styling with glassmorphism effects
- **Axios** - HTTP client for API communication

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing

### Deployment

- **Railway** - Full-stack hosting platform
- **MongoDB Atlas** - Cloud database service
- **GitHub** - Version control and CI/CD

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account
- Git

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/auqid/timer-fullstack.git
   cd timer-fullstack
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install

   # Create .env file
   cp .env_template.txt .env

   # Add your environment variables
   PORT=3001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:5173
   ```

3. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   ```

4. **Start Development Servers**

   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Open Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 📁 Project Structure

```
timer-fullstack/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Auth/        # Authentication components
│   │   │   └── Dashboard/   # Main application components
│   │   ├── contexts/        # React context providers
│   │   ├── services/        # API service functions
│   │   └── App.jsx          # Main application component
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Node.js backend API
│   ├── controllers/         # Request handlers
│   ├── models/             # Database models
│   ├── utils/              # Utility functions
│   ├── app.js              # Express application setup
│   ├── index.js            # Server entry point
│   └── package.json
└── README.md
```

## 🌐 Deployment

The application is deployed using Railway's monorepo configuration:

### Backend Service

- **Platform:** Railway
- **Environment:** Node.js
- **Database:** MongoDB Atlas
- **Domain:** https://backend-production-9b60.up.railway.app

### Frontend Service

- **Platform:** Railway
- **Build Tool:** Vite
- **Domain:** https://frontend-production-85ff.up.railway.app

### Environment Variables

**Backend:**

```
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
FRONTEND_URL=https://frontend-production-85ff.up.railway.app
```

**Frontend:**

```
VITE_BACKEND_URL=backend-production-9b60.up.railway.app
```

## 🔧 API Endpoints

### Authentication

- `POST /api/login/signup` - User registration
- `POST /api/login` - User login

### Tasks

- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Time Logs

- `GET /api/timelogs` - Get time logs
- `POST /api/timelogs` - Create time log
- `PUT /api/timelogs/:id/stop` - Stop timer

### Health Check

- `GET /api/health` - API health status

## 🎨 Design Features

- **Glassmorphism Effects** - Modern frosted glass aesthetics
- **Gradient Backgrounds** - Beautiful color transitions
- **Responsive Grid Layout** - Works on all screen sizes
- **Micro-interactions** - Smooth hover and click animations
- **Visual Feedback** - Loading states and status indicators

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration for secure API access
- Environment variable protection
- Input validation and sanitization

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Auqid Irfan**

- GitHub: [@auqid](https://github.com/auqid)
- Email: auqidirfan100@gmail.com

## 🙏 Acknowledgments

- Design inspiration from [Pomofocus](https://pomofocus.io/)
- Railway for excellent deployment platform
- MongoDB Atlas for reliable database hosting

## 📊 Project Stats

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas
- **Deployment:** Railway (Monorepo)
- **Lines of Code:** ~2000+
- **Components:** 10+
- **API Endpoints:** 8

---

⭐ **Star this repository if you found it helpful!**

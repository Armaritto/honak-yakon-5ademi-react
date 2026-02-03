# Quick Start Guide

## 🚀 Running the Application

### Prerequisites
- Node.js 18+ installed
- Backend server running (default: http://localhost:8080)

### 1. Install Dependencies
```bash
cd /home/ubuntu/GitHub/honakYakon5ademi-React
npm install
```

### 2. Configure Backend URL (Optional)
Create a `.env` file:
```bash
cp .env.example .env
```

Edit `.env` and update the backend URL if needed:
```env
VITE_API_URL=http://localhost:8080
```

### 3. Start Development Server
```bash
npm run dev
```

The app will be available at: **http://localhost:5173**

### 4. Build for Production
```bash
npm run build
```

Output will be in the `dist/` folder.

## 📱 Using the Application

### First Time Setup
1. **Register an Account**
   - Navigate to http://localhost:5173
   - Click "تسجيل حساب جديد" (Register New Account)
   - Enter username, password, and select your khedma
   - Click "تسجيل الحساب" (Register Account)

2. **Login**
   - Enter your username and password
   - Click "تسجيل الدخول" (Login)

### Daily Quiz Workflow
1. **Access Today's Quiz**
   - After login, you'll see today's quiz automatically
   - The page shows "إحصائيات اليوم" (Today's Statistics)

2. **Navigate Quizzes**
   - Click "📅 إحصائيات اليوم" to view today's quiz
   - Click "⏮️ السابق" to view the previous quiz
   - Click "📆 اختيار تاريخ" to open calendar and select a specific date

3. **Calendar Selection**
   - Solved dates are grayed out and disabled
   - You can only select unsolved past dates
   - Future dates are disabled

4. **Answer Questions**
   - Read each question
   - Type your answer in the text area
   - Click "✈️ تسجيل الإجابات" (Submit Answers)

### Progress Dashboard
1. Click "التقدم" (Progress) in the navigation bar
2. View the horizontal bar chart showing statistics for each khedma
3. Toggle between:
   - **today**: Shows today's participation count
   - **total**: Shows all-time participation count

## 🔧 Troubleshooting

### Cannot Connect to Backend
**Error:** Network Error or CORS issue

**Solution:**
1. Verify backend is running
2. Check `VITE_API_URL` in `.env`
3. Ensure backend has CORS enabled for `http://localhost:5173`

### Login Not Working
**Error:** 401 Unauthorized or wrong credentials

**Solution:**
1. Verify username/password are correct
2. Check backend `/login` endpoint is working
3. Open browser console (F12) to see detailed error

### Calendar Not Loading
**Error:** Solved dates not showing

**Solution:**
1. Check `/quiz/solved` endpoint returns date array
2. Verify date format is ISO string (e.g., "2026-02-01T00:00:00.000Z")

### Progress Chart Shows Mock Data
**Solution:**
1. Implement `/progress` endpoint in backend (see IMPLEMENTATION_NOTES.md)
2. Update `Progress.jsx` to fetch real data

## 📖 Project Structure

```
src/
├── config/
│   └── api.js              # Axios configuration
├── services/
│   ├── authService.js      # Login, register, logout
│   └── quizService.js      # Quiz CRUD operations
├── components/
│   ├── Navbar.jsx          # Top navigation
│   └── ProtectedRoute.jsx  # Auth guard
├── pages/
│   ├── Login.jsx           # Login page
│   ├── Register.jsx        # Registration page
│   ├── Quiz.jsx            # Quiz answering page
│   └── Progress.jsx        # Statistics dashboard
└── index.css               # Global styles and theme
```

## 🎨 Theme Customization

Colors are defined in `src/index.css`:

```css
:root {
  --primary-blue: #000080;        /* Navigation, buttons */
  --primary-yellow: #FFD700;      /* Accents, highlights */
  --secondary-cyan: #5DD9D9;      /* Chart bars */
  --secondary-green: #00C853;     /* Progress toggle */
}
```

## 🌐 Backend Requirements

The app expects these endpoints to be available:

### Authentication
- `POST /login` - User login
- `POST /users/register` - User registration

### Quiz
- `GET /quiz/today` - Get today's quiz
- `GET /quiz/previous` - Get previous quiz
- `GET /quiz/date?date=YYYY-MM-DD` - Get quiz by date
- `GET /quiz/solved` - Get array of solved dates
- `POST /response` - Submit quiz answers

### Data
- `GET /khedmas` - Get list of available khedmas
- `GET /progress` *(Optional)* - Get progress statistics

See `IMPLEMENTATION_NOTES.md` for detailed API specifications.

## 📚 Additional Resources

- **README.md** - Full documentation
- **IMPLEMENTATION_NOTES.md** - Backend integration guide
- **package.json** - Dependencies and scripts

## 🆘 Need Help?

1. Check browser console (F12) for errors
2. Verify backend is running and accessible
3. Review `IMPLEMENTATION_NOTES.md` for integration details
4. Check network tab to see API requests/responses

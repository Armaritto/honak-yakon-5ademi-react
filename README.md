# هناك يكون خادمي - React Frontend

This is a React frontend application for tracking spiritual service statistics and daily quizzes.

## Features

### 📝 Authentication
- User login and registration
- JWT token-based authentication
- Protected routes for authenticated users
- Khedma (service) selection during registration

### 📊 Quiz Management
- **Today's Quiz**: View and answer today's quiz questions
- **Previous Quiz**: Navigate to the previous quiz
- **Calendar Selection**: Select any previous unsolved quiz from a calendar
- **Solved Dates**: Calendar automatically disables already solved quiz dates
- **Answer Submission**: Submit answers with text responses

### 📈 Progress Dashboard
- **Bar Chart Visualization**: Horizontal bar chart showing statistics for each khedma
- **Toggle View**: Switch between "today" and "total" progress
- **Responsive Design**: Works on all screen sizes
- **Real-time Data**: Fetches latest statistics from backend

## Technology Stack

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client for API requests
- **Recharts**: Chart library for data visualization
- **React Calendar**: Calendar component for date selection
- **Cairo Font**: Beautiful Arabic typography

## Theme

- **Primary Colors**: 
  - Blue (#000080) - Main brand color
  - Yellow (#FFD700) - Accent color
  - Cyan (#5DD9D9) - Chart color
  
- **RTL Support**: Full right-to-left layout for Arabic
- **Responsive**: Mobile-first design

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure API endpoint:
   - Open `src/config/api.js`
   - Update `API_BASE_URL` to point to your backend server
   - Default: `http://localhost:8080`

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── config/
│   └── api.js              # API configuration and axios instance
├── services/
│   ├── authService.js      # Authentication service
│   └── quizService.js      # Quiz and khedma services
├── components/
│   ├── Navbar.jsx          # Navigation bar
│   └── ProtectedRoute.jsx  # Route guard for auth
├── pages/
│   ├── Login.jsx           # Login page
│   ├── Register.jsx        # Registration page
│   ├── Quiz.jsx            # Quiz page with calendar
│   └── Progress.jsx        # Progress dashboard
├── App.jsx                 # Main app component
├── main.jsx                # App entry point
└── index.css               # Global styles
```

## API Endpoints

The app expects the following backend endpoints:

### Authentication
- `POST /login` - User login
- `POST /admin/login` - Admin login
- `POST /users/register` - User registration

### Quiz
- `GET /quiz?id={id}` - Get quiz by ID
- `GET /quiz/today` - Get today's quiz
- `GET /quiz/previous` - Get previous quiz
- `GET /quiz/date?date={date}` - Get quiz by date
- `GET /quiz/solved` - Get solved quiz dates
- `POST /response` - Submit quiz response

### Khedma
- `GET /khedmas` - Get all khedmas

## Environment Variables

Create a `.env` file for custom configuration:

```env
VITE_API_URL=http://localhost:8080
```

Then update `src/config/api.js`:
```javascript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
```

## Usage

1. **Register**: Create a new account with username, password, and select your khedma
2. **Login**: Sign in with your credentials
3. **Quiz**: 
   - View today's quiz by default
   - Click "السابق" for previous quiz
   - Click "اختيار تاريخ" to select a specific date
   - Answer questions and submit
4. **Progress**: View statistics with today/total toggle

## Customization

### Change Theme Colors
Edit `src/index.css` CSS variables:
```css
:root {
  --primary-blue: #000080;
  --primary-yellow: #FFD700;
  --secondary-cyan: #5DD9D9;
  /* ... */
}
```

### Update API URL
Edit `src/config/api.js`:
```javascript
export const API_BASE_URL = 'https://your-backend-url.com';
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

import { Link, useNavigate } from 'react-router-dom';
import { logout, getUsername } from '../services/authService';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const username = getUsername();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <div className="brand-text">
                        <span className="brand-greeting">هناك يكون خادمي</span>
                        {username && <span className="brand-user">{username}</span>}
                    </div>
                </div>

                <div className="navbar-menu">
                    <Link to="/quiz" className="nav-link">
                        الإحصائيات
                    </Link>
                    <Link to="/progress" className="nav-link">
                        التقدم
                    </Link>
                    <button onClick={handleLogout} className="nav-button">
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

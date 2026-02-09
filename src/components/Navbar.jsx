import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout, getUsername } from '../services/authService';
import { FaChurch, FaSignOutAlt, FaBookOpen, FaChartBar } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const username = getUsername();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <div className="brand-logo">
                        <FaChurch size={20} color="#00008B" />
                    </div>
                    <div className="brand-text">
                        <div className="brand-title">هناك يكون خادمي</div>
                    </div>
                </div>

                <div className="navbar-menu">
                    <Link
                        to="/quiz"
                        className={`nav-icon-link ${isActive('/quiz') ? 'active' : ''}`}
                        title="المتابعة"
                    >
                        <FaBookOpen />
                    </Link>
                    <Link
                        to="/progress"
                        className={`nav-icon-link ${isActive('/progress') ? 'active' : ''}`}
                        title="الإحصائيات"
                    >
                        <FaChartBar />
                    </Link>
                    <button onClick={handleLogout} className="nav-icon-button" title="تسجيل الخروج">
                        <FaSignOutAlt />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

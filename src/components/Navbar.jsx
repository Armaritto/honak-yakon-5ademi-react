import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout, getUsername, isAmmaKhedma } from '../services/authService';
import { FaSignOutAlt, FaBookOpen, FaChartBar } from 'react-icons/fa';
import logo from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const username = getUsername();
    const ammaUser = isAmmaKhedma();

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
                        <img src={logo} alt="Logo" className="navbar-logo" />
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
                    {!ammaUser && (
                        <Link
                            to="/progress"
                            className={`nav-icon-link ${isActive('/progress') ? 'active' : ''}`}
                            title="الإحصائيات"
                        >
                            <FaChartBar />
                        </Link>
                    )}
                    <button onClick={handleLogout} className="nav-icon-button" title="تسجيل الخروج">
                        <FaSignOutAlt />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

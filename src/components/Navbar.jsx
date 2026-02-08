import { Link, useNavigate } from 'react-router-dom';
import { logout, getUsername } from '../services/authService';
import { FaChurch, FaSignOutAlt } from 'react-icons/fa';
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
                    <div className="brand-logo">
                        <FaChurch size={35} color="#00008B" />
                    </div>
                    <div className="brand-text">
                        <div className="brand-title">هناك يكون خادمي</div>
                        <div className="brand-subtitle">«إن كان أحد يخدمني فليتبعني» (يوحنا 12:26)</div>
                    </div>
                </div>

                <div className="navbar-menu">
                    <Link to="/quiz" className="nav-link">
                        المتابعة
                    </Link>
                    <Link to="/progress" className="nav-link">
                        الإحصائيات
                    </Link>
                    <button onClick={handleLogout} className="nav-button">
                        <FaSignOutAlt className="logout-icon" />
                        تسجيل الخروج
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

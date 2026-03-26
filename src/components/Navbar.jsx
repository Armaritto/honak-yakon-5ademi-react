import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout, getUsername, isAmmaKhedma } from '../services/authService';
import { FaSignOutAlt, FaBookOpen, FaChartBar, FaFont } from 'react-icons/fa';
import {
    ARABIC_FONT_OPTIONS,
    applyFontById,
    getStoredFontId,
    setStoredFontId,
} from '../utils/fontPreferences';
import logo from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const username = getUsername();
    const ammaUser = isAmmaKhedma();
    const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);
    const [selectedFontId, setSelectedFontId] = useState(getStoredFontId());
    const fontMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (fontMenuRef.current && !fontMenuRef.current.contains(event.target)) {
                setIsFontMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleFontSelect = (fontId) => {
        setSelectedFontId(fontId);
        setStoredFontId(fontId);
        applyFontById(fontId);
        setIsFontMenuOpen(false);
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
                    <div className="nav-font-picker" ref={fontMenuRef}>
                        <button
                            type="button"
                            className="nav-icon-button"
                            onClick={() => setIsFontMenuOpen((prev) => !prev)}
                            title="اختيار الخط"
                        >
                            <FaFont />
                        </button>
                        {isFontMenuOpen && (
                            <div className="nav-font-menu">
                                {ARABIC_FONT_OPTIONS.map((fontOption) => (
                                    <button
                                        key={fontOption.id}
                                        type="button"
                                        className={`nav-font-option ${selectedFontId === fontOption.id ? 'active' : ''}`}
                                        onClick={() => handleFontSelect(fontOption.id)}
                                    >
                                        {fontOption.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={handleLogout} className="nav-icon-button" title="تسجيل الخروج">
                        <FaSignOutAlt />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

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
    const FONT_HINT_STORAGE_KEY = 'fontFeatureHintShownCount';
    const MAX_FONT_HINT_SHOWS = 1;

    const navigate = useNavigate();
    const location = useLocation();
    const username = getUsername();
    const ammaUser = isAmmaKhedma();
    const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);
    const [selectedFontId, setSelectedFontId] = useState(getStoredFontId());
    const [showFontHint, setShowFontHint] = useState(false);
    const [hintPosition, setHintPosition] = useState({ top: 84, left: 16, arrowLeft: 140 });
    const fontMenuRef = useRef(null);
    const fontButtonRef = useRef(null);

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

    useEffect(() => {
        const shownCount = Number(localStorage.getItem(FONT_HINT_STORAGE_KEY) || '0');
        if (shownCount < MAX_FONT_HINT_SHOWS) {
            setShowFontHint(true);
            localStorage.setItem(FONT_HINT_STORAGE_KEY, String(shownCount + 1));
        }
    }, []);

    useEffect(() => {
        if (!showFontHint) {
            return undefined;
        }

        const updateHintPosition = () => {
            if (!fontButtonRef.current) {
                return;
            }

            const buttonRect = fontButtonRef.current.getBoundingClientRect();
            const cloudWidth = 280;
            const screenPadding = 12;
            const rawLeft = buttonRect.left + (buttonRect.width / 2) - (cloudWidth / 2);
            const left = Math.max(screenPadding, Math.min(rawLeft, window.innerWidth - cloudWidth - screenPadding));
            const arrowLeft = Math.max(26, Math.min(buttonRect.left + (buttonRect.width / 2) - left, cloudWidth - 26));

            setHintPosition({
                top: buttonRect.bottom + 14,
                left,
                arrowLeft,
            });
        };

        updateHintPosition();
        window.addEventListener('resize', updateHintPosition);
        window.addEventListener('scroll', updateHintPosition, true);

        return () => {
            window.removeEventListener('resize', updateHintPosition);
            window.removeEventListener('scroll', updateHintPosition, true);
        };
    }, [showFontHint]);

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
                            ref={fontButtonRef}
                            className="nav-icon-button"
                            onClick={() => {
                                if (showFontHint) {
                                    setShowFontHint(false);
                                }
                                setIsFontMenuOpen((prev) => !prev);
                            }}
                            title="اختيار الخط"
                        >
                            <FaFont />
                        </button>
                        {showFontHint && (
                            <>
                                <div className="font-hint-overlay" onClick={() => setShowFontHint(false)}></div>
                                <div
                                    className="font-hint-cloud"
                                    style={{ top: `${hintPosition.top}px`, left: `${hintPosition.left}px` }}
                                    onClick={() => setShowFontHint(false)}
                                >
                                    <span
                                        className="font-hint-arrow"
                                        style={{ left: `${hintPosition.arrowLeft}px` }}
                                    ></span>
                                    <p> جرّب ميزة الخطوط الجديدة!</p>
                                </div>
                            </>
                        )}
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

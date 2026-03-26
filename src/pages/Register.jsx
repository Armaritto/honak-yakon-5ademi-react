import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, isAuthenticated } from '../services/authService';
import { getKhedmas } from '../services/quizService';
import logo from '../assets/logo.png';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        khedmaId: '',
    });
    const [khedmas, setKhedmas] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        if (isAuthenticated()) {
            navigate('/quiz');
        }
        fetchKhedmas();
    }, [navigate]);

    const fetchKhedmas = async () => {
        try {
            const data = await getKhedmas();
            // Ensure data is always an array
            setKhedmas(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching khedmas:', err);
            // Set empty array on error
            setKhedmas([]);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('كلمات المرور غير متطابقة');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('يجب أن تكون كلمة المرور 6 أحرف على الأقل');
            setLoading(false);
            return;
        }

        try {
            await register(formData.username, formData.password, formData.khedmaId);
            console.log('تم التسجيل بنجاح! يمكنك الآن تسجيل الدخول.');
            navigate('/login');
        } catch (err) {
            setError('فشل التسجيل. يرجى المحاولة مرة أخرى.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <div className="register-card">
                    <div className="register-header">
                        <div className="register-header-icon"><img src={logo} alt="Logo" className="register-logo" /></div>
                        <h1>هناك يكون خادمي</h1>
                        <p>تسجيل حساب جديد</p>
                    </div>

                    <form onSubmit={handleSubmit} className="register-form">
                        {error && <div className="error-message">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="username">اسم المستخدم *</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="أدخل اسم المستخدم"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="khedmaId">اختر الخدمة *</label>
                            <select
                                id="khedmaId"
                                name="khedmaId"
                                value={formData.khedmaId}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            >
                                <option value="">-- اختر الخدمة --</option>
                                {khedmas.map((khedma) => (
                                    <option key={khedma.id} value={khedma.id}>
                                        {khedma.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">كلمة المرور *</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="أدخل كلمة المرور"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">تأكيد كلمة المرور *</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="أعد إدخال كلمة المرور"
                                required
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary register-submit"
                            disabled={loading}
                        >
                            تسجيل الحساب
                        </button>
                    </form>

                    <div className="register-footer">
                        <p>
                            لديك حساب بالفعل؟{' '}
                            <Link to="/login" className="login-link">
                                تسجيل الدخول
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

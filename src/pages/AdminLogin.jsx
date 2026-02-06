import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import './AdminLogin.css';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if admin is already authenticated
        const adminToken = localStorage.getItem('adminToken');
        if (adminToken) {
            navigate('/admin-controller');
        }
    }, [navigate]);

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

        try {
            const response = await api.post('/admin/login', {
                username: formData.username,
                password: formData.password,
            });

            console.log('Admin login response:', response);
            console.log('Response data:', response.data);

            // Extract token properly from response
            let token;

            if (typeof response.data === 'string') {
                // Response is a plain string token
                token = response.data;
            } else if (response.data.token) {
                // Response has a token field
                token = response.data.token;
            } else if (response.data.jwtToken) {
                // Response has a jwtToken field
                token = response.data.jwtToken;
            } else if (response.data.accessToken) {
                // Response has an accessToken field
                token = response.data.accessToken;
            } else {
                // Try to find any field that looks like a token
                const possibleToken = Object.values(response.data).find(
                    val => typeof val === 'string' && val.length > 20
                );
                token = possibleToken || JSON.stringify(response.data);
            }

            console.log('Extracted token:', token);
            console.log('Token type:', typeof token);

            // Ensure token is a string
            if (typeof token !== 'string') {
                console.error('Token is not a string:', token);
                throw new Error('Invalid token format received from server');
            }

            // Store admin token separately
            localStorage.setItem('adminToken', token);
            localStorage.setItem('adminUsername', formData.username);

            // Redirect to admin controller
            navigate('/admin-controller');
        } catch (err) {
            console.error('Admin login error:', err);
            setError('فشل تسجيل الدخول. يرجى التحقق من بيانات المسؤول.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-container">
                <div className="admin-login-card">
                    <div className="admin-login-header">
                        <div className="admin-icon">🔐</div>
                        <h1>لوحة تحكم المسؤول</h1>
                        <p>تسجيل الدخول للمسؤولين فقط</p>
                    </div>

                    <form onSubmit={handleSubmit} className="admin-login-form">
                        {error && <div className="error-message">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="username">اسم المستخدم</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="أدخل اسم المستخدم للمسؤول"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">كلمة المرور</label>
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

                        <button
                            type="submit"
                            className="btn-admin-submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-small"></span>
                                    جاري التحقق...
                                </>
                            ) : (
                                'تسجيل الدخول'
                            )}
                        </button>
                    </form>

                    <div className="admin-login-footer">
                        <p className="warning-text">
                            ⚠️ هذه الصفحة مخصصة للمسؤولين فقط
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;

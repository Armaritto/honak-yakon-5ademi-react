import api from '../config/api';

export const login = async (username, password) => {
    const response = await api.post('/login', { username, password });
    const { JWTToken, userId, username: userName, khedmaName } = response.data;

    localStorage.setItem('jwtToken', JWTToken);
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', userName);
    if (khedmaName !== undefined && khedmaName !== null) {
        localStorage.setItem('khedmaName', khedmaName);
    }

    return response.data;
};

export const adminLogin = async (username, password) => {
    const response = await api.post('/admin/login', { username, password });
    const { JWTToken, userId, username: userName } = response.data;

    localStorage.setItem('jwtToken', JWTToken);
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', userName);
    localStorage.setItem('isAdmin', 'true');

    return response.data;
};

export const register = async (username, password, khedmaId) => {
    const response = await api.post('/users/register', {
        username,
        password,
        khedmaId,
    });
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('khedmaName');
    localStorage.removeItem('isAdmin');
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('jwtToken');
};

export const getUsername = () => {
    return localStorage.getItem('username');
};

export const getUserId = () => {
    return localStorage.getItem('userId');
};

export const isAdmin = () => {
    return localStorage.getItem('isAdmin') === 'true';
};

export const getKhedmaName = () => {
    return localStorage.getItem('khedmaName');
};

export const isAmmaKhedma = () => {
    const khedmaName = getKhedmaName();
    return khedmaName && khedmaName.trim() === 'عامة';
};

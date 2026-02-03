import api from '../config/api';

export const getQuizById = async (id) => {
    const response = await api.get(`/quiz?id=${id}`);
    return response.data;
};

export const getTodayQuiz = async () => {
    const response = await api.get('/quiz/today');
    return response.data;
};

export const getPreviousQuiz = async () => {
    const response = await api.get('/quiz/previous');
    return response.data;
};

export const getQuizByDate = async (date) => {
    console.log('Fetching quiz by date. Payload:', { date });
    const response = await api.post('/quiz/date', { date });
    return response.data;
};

export const getSolvedQuizDates = async () => {
    const response = await api.get('/quiz/solved');
    return response.data;
};

export const submitResponse = async (responseData) => {
    console.log('Service - Sending response data:', responseData);
    const response = await api.post('/response', responseData);
    console.log('Service - Response received:', response.data);
    return response.data;
};

export const getKhedmas = async () => {
    const response = await api.get('/khedmas');
    return response.data;
};

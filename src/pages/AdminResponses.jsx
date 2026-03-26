import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import { getKhedmas } from '../services/quizService';
import './AdminResponses.css';

const AdminResponses = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedKhedma, setSelectedKhedma] = useState('all');
    const [khedmas, setKhedmas] = useState([]);
    const [responses, setResponses] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [expandedQuestions, setExpandedQuestions] = useState({});

    // Initialize with today's date
    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setSelectedDate(formattedDate);
    }, []);

    // Fetch khedmas on mount
    useEffect(() => {
        fetchKhedmas();
    }, []);

    // Fetch responses when date or khedma changes
    useEffect(() => {
        if (selectedDate) {
            fetchResponses();
        }
    }, [selectedDate, selectedKhedma, currentPage]);

    const fetchKhedmas = async () => {
        try {
            const data = await getKhedmas();
            setKhedmas(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching khedmas:', err);
            setKhedmas([]);
        }
    };

    const fetchResponses = async () => {
        setLoading(true);
        setError('');

        try {
            // Format date as ISO string
            const dateObj = new Date(selectedDate);
            const formattedDate = dateObj.toISOString();

            // Fetch quiz questions for the selected date
            const quizResponse = await api.post('/quiz/date', {
                date: formattedDate
            });
            setQuestions(quizResponse.data.questionDTOS || []);

            // Fetch responses based on filter
            let responsesData;
            if (selectedKhedma === 'all') {
                const response = await api.post(
                    `/admin/responses/all?page=${currentPage}`,
                    { date: formattedDate }
                );
                responsesData = response.data;
            } else {
                const response = await api.post(
                    `/admin/responses/by-khedma?page=${currentPage}&khedmaId=${selectedKhedma}`,
                    { date: formattedDate }
                );
                responsesData = response.data;
            }

            // Handle paginated response
            if (responsesData && responsesData.data) {
                setResponses(responsesData.data);
                setTotalPages(responsesData.totalPages || 0);
                setTotalElements(responsesData.totalElements || 0);
            } else if (Array.isArray(responsesData)) {
                setResponses(responsesData);
                setTotalPages(1);
                setTotalElements(responsesData.length);
            } else {
                setResponses([]);
                setTotalPages(0);
                setTotalElements(0);
            }
        } catch (err) {
            console.error('Error fetching responses:', err);
            setError('فشل في تحميل البيانات. تأكد من وجود متابعة في هذا التاريخ.');
            setQuestions([]);
            setResponses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUsername');
        navigate('/admin-login');
    };

    const handleBackToController = () => {
        navigate('/admin-controller');
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        setCurrentPage(0); // Reset to first page when date changes
    };

    const handleKhedmaChange = (e) => {
        setSelectedKhedma(e.target.value);
        setCurrentPage(0); // Reset to first page when filter changes
    };

    const setTodayDate = () => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setSelectedDate(formattedDate);
        setCurrentPage(0);
    };

    const toggleQuestionExpand = (index) => {
        setExpandedQuestions((prev) => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <div className="admin-responses-page">
            <div className="admin-responses-container">
                <div className="admin-header">
                    <div className="admin-header-content">
                        <div>
                            <h1>عرض الإجابات</h1>
                        </div>
                        <div className="header-buttons">
                            <button onClick={handleBackToController} className="btn-back">
                                العودة للوحة التحكم
                            </button>
                            <button onClick={handleLogout} className="btn-logout">
                                تسجيل الخروج
                            </button>
                        </div>
                    </div>
                </div>

                <div className="filters-section">
                    <div className="filter-group">
                        <label htmlFor="date">التاريخ:</label>
                        <div className="date-input-group">
                            <input
                                type="date"
                                id="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                className="form-input"
                            />
                            <button onClick={setTodayDate} className="btn-today">
                                اليوم
                            </button>
                        </div>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="khedma">الخدمة:</label>
                        <select
                            id="khedma"
                            value={selectedKhedma}
                            onChange={handleKhedmaChange}
                            className="form-select"
                        >
                            <option value="all">الكل</option>
                            {khedmas.map((khedma) => (
                                <option key={khedma.id} value={khedma.id}>
                                    {khedma.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>جاري التحميل...</p>
                    </div>
                ) : (
                    <>
                        {responses.length > 0 ? (
                            <div className="table-container">
                                <div className="table-wrapper">
                                    <table className="responses-table">
                                        <thead>
                                            <tr>
                                                <th className="sticky-col">المستخدم</th>
                                                <th className="sticky-col-2">الخدمة</th>
                                                {questions.map((question, index) => {
                                                    const isExpanded = !!expandedQuestions[index];

                                                    return (
                                                        <th key={index}>
                                                            <button
                                                                type="button"
                                                                className="question-header"
                                                                onClick={() => toggleQuestionExpand(index)}
                                                                aria-expanded={isExpanded}
                                                                title={isExpanded ? 'إخفاء السؤال الكامل' : 'عرض السؤال الكامل'}
                                                            >
                                                                <span className="question-index">س{index + 1}:</span>
                                                                <span className={`question-text ${isExpanded ? 'expanded' : ''}`}>
                                                                    {question.text}
                                                                </span>
                                                            </button>
                                                        </th>
                                                    );
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {responses.map((response, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    <td className="sticky-col">{response.username}</td>
                                                    <td className="sticky-col-2">{response.khedmaName}</td>
                                                    {response.answerTexts && response.answerTexts.map((answerText, colIndex) => (
                                                        <td key={colIndex}>
                                                            {answerText || '-'}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            !error && (
                                <div className="no-data-message">
                                    لا توجد إجابات لهذا التاريخ
                                </div>
                            )
                        )}

                        {responses.length > 0 && (
                            <div className="pagination">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                    disabled={currentPage === 0}
                                    className="btn-pagination"
                                >
                                    السابق
                                </button>
                                <span className="page-info">
                                    صفحة {currentPage + 1} من {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    disabled={currentPage >= totalPages - 1}
                                    className="btn-pagination"
                                >
                                    التالي
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminResponses;

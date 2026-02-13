import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import './AdminController.css';

const AdminController = () => {
    const navigate = useNavigate();
    // State for creating quiz
    const [quizDate, setQuizDate] = useState('');
    const [quizName, setQuizName] = useState('');
    const [questions, setQuestions] = useState([{ text: '' }]);
    const [creating, setCreating] = useState(false);
    const [createMessage, setCreateMessage] = useState({ type: '', text: '' });

    // State for deleting quiz
    const [deleteId, setDeleteId] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState({ type: '', text: '' });

    // State for listing quizzes
    const [quizzes, setQuizzes] = useState([]);
    const [loadingQuizzes, setLoadingQuizzes] = useState(false);

    // Handle admin logout
    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUsername');
        navigate('/admin-login');
    };

    // Add a new question field
    const addQuestion = () => {
        setQuestions([...questions, { text: '' }]);
    };

    // Remove a question field
    const removeQuestion = (index) => {
        if (questions.length > 1) {
            const newQuestions = questions.filter((_, i) => i !== index);
            setQuestions(newQuestions);
        }
    };

    // Update question text
    const updateQuestion = (index, text) => {
        const newQuestions = [...questions];
        newQuestions[index].text = text;
        setQuestions(newQuestions);
    };

    // Handle create quiz
    const handleCreateQuiz = async (e) => {
        e.preventDefault();
        setCreating(true);
        setCreateMessage({ type: '', text: '' });

        try {
            // Format date as ISO string with timezone offset
            const formattedDate = new Date(quizDate).toISOString();

            // Build QuizCreateDTO with QuestionDTO objects
            const quizDTO = {
                name: quizName,
                questionDTOS: questions
                    .filter(q => q.text.trim() !== '')
                    .map(q => ({
                        text: q.text,
                        type: 'Text'
                    })),
                date: formattedDate
            };

            console.log('Creating quiz with payload:', JSON.stringify(quizDTO, null, 2));

            const response = await api.post('/admin/quiz', quizDTO);

            setCreateMessage({ type: 'success', text: 'تم إنشاء المتابعة بنجاح!' });

            // Reset form
            setQuizName('');
            setQuizDate('');
            setQuestions([{ text: '' }]);

            setTimeout(() => setCreateMessage({ type: '', text: '' }), 5000);
        } catch (err) {
            console.error('Error creating quiz:', err);
            console.error('Error response:', err.response);
            console.error('Error response data:', err.response?.data);
            console.error('Error response status:', err.response?.status);

            // Handle error message properly - convert object to string if needed
            let errorMessage = 'فشل في إنشاء المتابعة. حاول مرة أخرى.';

            if (err.response?.data) {
                console.log('Backend error data:', err.response.data);

                if (typeof err.response.data === 'string') {
                    errorMessage = err.response.data;
                } else if (err.response.data.message) {
                    errorMessage = err.response.data.message;
                } else if (err.response.data.title) {
                    errorMessage = err.response.data.title;
                } else if (err.response.data.detail) {
                    errorMessage = err.response.data.detail;
                } else if (err.response.data.error) {
                    errorMessage = err.response.data.error;
                } else {
                    errorMessage = JSON.stringify(err.response.data);
                }
            }

            setCreateMessage({
                type: 'error',
                text: errorMessage
            });
            setTimeout(() => setCreateMessage({ type: '', text: '' }), 5000);
        } finally {
            setCreating(false);
        }
    };

    // Handle delete quiz
    const handleDeleteQuiz = async (e) => {
        e.preventDefault();
        setDeleting(true);
        setDeleteMessage({ type: '', text: '' });

        try {
            const response = await api.delete('/admin/quiz', {
                params: { id: deleteId }
            });

            setDeleteMessage({ type: 'success', text: 'تم حذف المتابعة بنجاح!' });
            setDeleteId('');

            setTimeout(() => setDeleteMessage({ type: '', text: '' }), 5000);
        } catch (err) {
            console.error('Error deleting quiz:', err);

            // Handle error message properly - convert object to string if needed
            let errorMessage = 'فشل في حذف المتابعة. تأكد من صحة المعرف.';

            if (err.response?.data) {
                if (typeof err.response.data === 'string') {
                    errorMessage = err.response.data;
                } else if (err.response.data.title) {
                    errorMessage = err.response.data.title;
                } else if (err.response.data.detail) {
                    errorMessage = err.response.data.detail;
                } else {
                    errorMessage = JSON.stringify(err.response.data);
                }
            }

            setDeleteMessage({
                type: 'error',
                text: errorMessage
            });
            setTimeout(() => setDeleteMessage({ type: '', text: '' }), 5000);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <div className="admin-page">
                <div className="admin-container">
                    <div className="admin-header">
                        <div className="admin-header-content">
                            <div>
                                <h1>لوحة التحكم الإدارية</h1>
                            </div>
                            <div className="header-buttons">
                                <button
                                    onClick={() => navigate('/admin-controller/responses')}
                                    className="btn-responses"
                                >
                                    عرض الإجابات
                                </button>
                                <button onClick={handleLogout} className="btn-logout">
                                    تسجيل الخروج
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="admin-sections">
                        {/* Create Quiz Section */}
                        <div className="admin-section">
                            <div className="section-header">
                                <h2>إنشاء متابعة جديدة</h2>
                            </div>

                            {createMessage.text && (
                                <div className={`message ${createMessage.type}`}>
                                    {createMessage.text}
                                </div>
                            )}

                            <form onSubmit={handleCreateQuiz} className="admin-form">
                                <div className="form-group">
                                    <label htmlFor="quizName">عنوان المتابعة</label>
                                    <input
                                        type="text"
                                        id="quizName"
                                        value={quizName}
                                        onChange={(e) => setQuizName(e.target.value)}
                                        placeholder="اكتب عنوان المتابعة"
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="quizDate">تاريخ المتابعة</label>
                                    <input
                                        type="date"
                                        id="quizDate"
                                        value={quizDate}
                                        onChange={(e) => setQuizDate(e.target.value)}
                                        required
                                        className="form-input"
                                    />
                                </div>

                                <div className="questions-section">
                                    <div className="questions-header">
                                        <label>الأسئلة</label>
                                        <button
                                            type="button"
                                            onClick={addQuestion}
                                            className="btn-add-question"
                                        >
                                            + إضافة سؤال
                                        </button>
                                    </div>

                                    {questions.map((question, index) => (
                                        <div key={index} className="question-input-group">
                                            <div className="question-number">{index + 1}</div>
                                            <textarea
                                                value={question.text}
                                                onChange={(e) => updateQuestion(index, e.target.value)}
                                                placeholder="اكتب نص السؤال هنا..."
                                                required
                                                rows="2"
                                                className="form-textarea"
                                            />
                                            {questions.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeQuestion(index)}
                                                    className="btn-remove-question"
                                                    title="حذف السؤال"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="btn-primary"
                                >
                                    {creating ? (
                                        <>
                                            <span className="spinner-small"></span>
                                            جاري الإنشاء...
                                        </>
                                    ) : (
                                        'إنشاء المتابعة'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminController;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaTrophy } from 'react-icons/fa';
import {
    getTodayQuiz,
    getPreviousQuiz,
    getQuizByDate,
    getSolvedQuizDates,
    submitResponse,
} from '../services/quizService';
import { getUsername } from '../services/authService';
import Navbar from '../components/Navbar';
import './Quiz.css';

const Quiz = () => {
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [solvedDates, setSolvedDates] = useState([]);
    const [quizMode, setQuizMode] = useState('today'); // 'today', 'previous', 'date'
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isTodayQuizSolved, setIsTodayQuizSolved] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSolvedDates();
        fetchTodayQuiz();
    }, []);

    const fetchSolvedDates = async () => {
        try {
            const dates = await getSolvedQuizDates();
            const parsedDates = dates.map((d) => new Date(d));
            setSolvedDates(parsedDates);

            // Check if today's quiz is already solved
            const today = new Date();
            const isSolved = parsedDates.some(
                (solvedDate) =>
                    solvedDate.toDateString() === today.toDateString()
            );
            setIsTodayQuizSolved(isSolved);
        } catch (err) {
            console.error('Error fetching solved dates:', err);
        }
    };

    const fetchTodayQuiz = async () => {
        setLoading(true);
        try {
            const data = await getTodayQuiz();
            setQuiz(data);
            setQuizMode('today');
            initializeAnswers(data.questionDTOS);
        } catch (err) {
            console.error('Error fetching today quiz:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPreviousQuiz = async () => {
        setLoading(true);
        try {
            const data = await getPreviousQuiz();
            setQuiz(data);
            setQuizMode('previous');
            initializeAnswers(data.questionDTOS);
        } catch (err) {
            console.error('Error fetching previous quiz:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchQuizByDate = async (date) => {
        setLoading(true);
        try {
            const data = await getQuizByDate(date);
            setQuiz(data);
            setQuizMode('date');
            initializeAnswers(data.questionDTOS);
            setShowCalendar(false);
        } catch (err) {
            console.error('Error fetching quiz by date:', err);
        } finally {
            setLoading(false);
        }
    };

    const initializeAnswers = (questions) => {
        const initialAnswers = {};
        questions.forEach((q, index) => {
            initialAnswers[index] = '';
        });
        setAnswers(initialAnswers);
    };

    const handleAnswerChange = (index, value) => {
        setAnswers({
            ...answers,
            [index]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            console.log('Quiz data:', quiz);
            console.log('Questions:', quiz.questionDTOS);

            // Map question IDs - try different possible property names
            const questionIds = quiz.questionDTOS.map((q) => {
                return q.id || q.questionId || q.Id;
            });

            const answerTexts = Object.values(answers);
            const checkbox = true;

            // Get quiz ID with fallback
            const quizId = quiz.id || quiz.quizId;

            console.log('Quiz ID:', quizId);
            console.log('Submitting response:', {
                questionIds,
                answerTexts,
                quizId,
                checkbox,
            });

            await submitResponse({
                questionIds,
                answerTexts,
                quizId,
                checkbox,
            });

            setSuccessMessage('تم تسجيل الإجابات بنجاح!');
            setTimeout(() => setSuccessMessage(''), 5000);
            fetchSolvedDates();
            fetchTodayQuiz();
        } catch (err) {
            console.error('Error submitting response:', err);
            setErrorMessage('حدث خطأ أثناء تسجيل الإجابات. تأكد من تشغيل الخادم.');
            setTimeout(() => setErrorMessage(''), 5000);
        } finally {
            setSubmitting(false);
        }
    };

    const isDateSolved = (date) => {
        return solvedDates.some(
            (solvedDate) =>
                solvedDate.toDateString() === date.toDateString()
        );
    };

    // Parse VITE_START_DATE from .env (format: DD-MM-YYYY)
    const getStartDate = () => {
        const startDateStr = import.meta.env.VITE_START_DATE;
        if (!startDateStr) return null;

        const [day, month, year] = startDateStr.split('-');
        return new Date(year, month - 1, day); // month is 0-indexed in JS Date
    };

    const tileDisabled = ({ date, view }) => {
        if (view === 'month') {
            // Disable future dates
            if (date > new Date()) return true;

            // Disable dates before START_DATE
            const startDate = getStartDate();
            if (startDate) {
                const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
                if (dateOnly < startDateOnly) return true;
            }

            // Disable solved dates
            return isDateSolved(date);
        }
        return false;
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month' && isDateSolved(date)) {
            return 'solved-date';
        }
        return null;
    };

    const handleDateSelect = (date) => {
        // preserve the selected year/month/day and manually construct the string
        // so it doesn't shift due to timezone offset
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}T00:00:00.000+00:00`;

        console.log('Selected date:', date);
        console.log('Formatted date for backend:', formattedDate);
        fetchQuizByDate(formattedDate);
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="quiz-loading">
                    <div className="spinner"></div>
                    <p>جاري تحميل الأسئلة...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="quiz-page">
                <div className="quiz-container">
                    <div className="quiz-header">
                        <div className="quiz-header-content">
                            <h1>اهلا {getUsername().trim().split(' ')[0]}</h1>
                            <div className="points-display">
                                <FaTrophy className="trophy-icon" />
                                <span className="points-count">{solvedDates.length}</span>
                            </div>
                        </div>
                    </div>

                    {successMessage && (
                        <div className="success-message" style={{
                            backgroundColor: 'var(--secondary-green)',
                            color: 'white',
                            padding: 'var(--spacing-md)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: 'var(--spacing-lg)',
                            textAlign: 'center'
                        }}>
                            {successMessage}
                        </div>
                    )}

                    {errorMessage && (
                        <div className="error-message" style={{
                            backgroundColor: '#f44336',
                            color: 'white',
                            padding: 'var(--spacing-md)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: 'var(--spacing-lg)',
                            textAlign: 'center'
                        }}>
                            {errorMessage}
                        </div>
                    )}

                    <div className="quiz-controls">
                        <button
                            className={`control-btn ${quizMode === 'today' ? 'active' : ''}`}
                            onClick={fetchTodayQuiz}
                        >
                            اسئلة اليوم
                        </button>
                        <button
                            className="control-btn"
                            onClick={() => setShowCalendar(!showCalendar)}
                        >
                            اختر تاريخ المتابعة
                        </button>
                    </div>

                    {showCalendar && (
                        <div className="modal-overlay" onClick={() => setShowCalendar(false)}>
                            <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h3>اختر تاريخ المتابعة</h3>
                                    <button className="modal-close" onClick={() => setShowCalendar(false)}>✕</button>
                                </div>
                                <div className="calendar-container">
                                    <Calendar
                                        onChange={handleDateSelect}
                                        tileDisabled={tileDisabled}
                                        tileClassName={tileClassName}
                                        locale="ar"
                                        showNeighboringMonth={false}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Show "Already Solved" message if today's quiz is solved in 'today' mode */}
                    {quizMode === 'today' && isTodayQuizSolved ? (
                        <div className="already-solved-message">
                            <div className="solved-icon">✓</div>
                            <h2>تم إكمال متابعة اليوم بنجاح!</h2>
                            <p>شكراً لك على متابعة خدمتك الروحية.</p>
                        </div>
                    ) : quiz && quiz.questionDTOS.length > 0 ? (
                        <div className="quiz-content">
                            <form onSubmit={handleSubmit} className="quiz-form">
                                <div className="quiz-section">
                                    <div className="section-header">
                                        <h3>أسئلة التأمل</h3>
                                    </div>

                                    {quiz.questionDTOS.map((question, index) => (
                                        <div key={index} className="question-card">
                                            <label className="question-label">
                                                {index + 1}. {question.text}
                                            </label>
                                            <textarea
                                                value={answers[index] || ''}
                                                onChange={(e) =>
                                                    handleAnswerChange(index, e.target.value)
                                                }
                                                placeholder="[اكتب إجابتك هنا]"
                                                rows="3"
                                                required
                                            />
                                        </div>
                                    ))}

                                    <label className="form-checkbox">
                                        <input type="checkbox" id="confirm-checkbox" />
                                        <span className="checkbox-custom"></span>
                                        <span className="checkbox-label">أقر بأنني قرأت اصحاح اليوم</span>
                                    </label>

                                    <button
                                        type="submit"
                                        className="btn-primary submit-quiz"
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <>
                                                <span className="spinner"></span>
                                                جاري التسجيل...
                                            </>
                                        ) : (
                                            'تسجيل'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : quiz && quiz.questionDTOS.length === 0 ? (
                        <div className="no-questions">
                            <p>لا توجد أسئلة متاحة لهذا التاريخ</p>
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    );
};

export default Quiz;

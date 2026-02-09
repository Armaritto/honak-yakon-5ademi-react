import { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import Navbar from '../components/Navbar';
import api from '../config/api';
import './Progress.css';

const Progress = () => {
    const [todayData, setTodayData] = useState([]);
    const [totalData, setTotalData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('today');

    useEffect(() => {
        fetchProgressData();
    }, []);

    const fetchProgressData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch both today and total progress data
            const [todayResponse, totalResponse] = await Promise.all([
                api.get('/progress/today'),
                api.get('/progress/total')
            ]);

            // Transform the ProgressDTO data to chart format
            setTodayData(todayResponse.data.map(item => ({
                name: item.name,
                value: item.progress
            })));

            setTotalData(totalResponse.data.map(item => ({
                name: item.name,
                value: item.progress
            })));
        } catch (err) {
            console.error('Error fetching progress data:', err);
            setError('فشل في تحميل البيانات. يرجى المحاولة مرة أخرى.');
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <>
                <Navbar />
                <div className="progress-loading">
                    <div className="spinner"></div>
                    <p>جاري تحميل البيانات...</p>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div className="progress-error">
                    <p>{error}</p>
                    <button onClick={fetchProgressData} className="retry-btn">
                        إعادة المحاولة
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="progress-page">
                <div className="progress-header-title">
                    <h1>الإحصائيات العامة</h1>
                </div>

                {/* Toggle Button */}
                <div className="progress-toggle-container">
                    <button
                        className={`toggle-btn ${viewMode === 'today' ? 'active' : ''}`}
                        onClick={() => setViewMode('today')}
                    >
                        تقدم اليوم
                    </button>
                    <button
                        className={`toggle-btn ${viewMode === 'total' ? 'active' : ''}`}
                        onClick={() => setViewMode('total')}
                    >
                        التقدم الإجمالي
                    </button>
                </div>

                <div className="progress-charts-wrapper">
                    {/* Single Chart Section */}
                    <div className="chart-section">
                        <div className="chart-header">
                            <h2>{viewMode === 'today' ? 'تقدم اليوم' : 'التقدم الإجمالي'}</h2>
                        </div>
                        <div className="chart-container">
                            {(viewMode === 'today' ? todayData : totalData).length > 0 ? (
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart
                                        data={viewMode === 'today' ? todayData : totalData}
                                        layout="vertical"
                                        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#E5E7EB"
                                            horizontal={false}
                                        />
                                        <XAxis
                                            type="number"
                                            domain={[0, 'dataMax']}
                                            allowDecimals={false}
                                            tickFormatter={(value) => Math.floor(value)}
                                            tick={{ fill: '#6B7280', fontSize: 11 }}
                                            stroke="#E5E7EB"
                                            axisLine={false}
                                        />
                                        <YAxis
                                            type="category"
                                            dataKey="name"
                                            tick={{ fill: '#374151', fontSize: 11, fontFamily: 'Cairo, sans-serif' }}
                                            stroke="#E5E7EB"
                                            axisLine={false}
                                            tickLine={false}
                                            width={70}
                                        />
                                        <Bar dataKey="value" radius={[0, 8, 8, 0]} fill="var(--primary-blue)">
                                            {(viewMode === 'today' ? todayData : totalData).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill="var(--primary-blue)" />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="no-data">
                                    <p>{viewMode === 'today' ? 'لا توجد بيانات متاحة لليوم' : 'لا توجد بيانات متاحة'}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Progress;

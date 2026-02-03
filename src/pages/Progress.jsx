import { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import Navbar from '../components/Navbar';
import api from '../config/api';
import './Progress.css';

const Progress = () => {
    const [progressData, setProgressData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('total'); // 'today' or 'total'

    useEffect(() => {
        fetchProgressData();
    }, []);

    const fetchProgressData = async () => {
        setLoading(true);
        try {
            // This endpoint should be created in your backend
            // For now, using mock data based on the image
            const mockData = [
                { khedma: 'يسوع يحبك', today: 120, total: 13451 },
                { khedma: 'شباب', today: 98, total: 11839 },
                { khedma: 'ابتدائي بنين', today: 85, total: 10463 },
                { khedma: 'الكشافة', today: 102, total: 10338 },
                { khedma: 'أخوة فرح', today: 75, total: 8692 },
                { khedma: 'فيلا الكنج', today: 65, total: 6396 },
                { khedma: 'اعدادي بنت', today: 58, total: 6045 },
                { khedma: 'ثانوي بنين', today: 52, total: 5567 },
                { khedma: 'كشكشي الصغيرة', today: 48, total: 5094 },
            ];

            setProgressData(mockData);
        } catch (err) {
            console.error('Error fetching progress data:', err);
        } finally {
            setLoading(false);
        }
    };

    const getChartData = () => {
        return progressData.map((item) => ({
            name: item.khedma,
            value: viewMode === 'today' ? item.today : item.total,
        }));
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

    return (
        <>
            <Navbar />
            <div className="progress-page">
                <div className="progress-container">
                    <div className="progress-header">
                        <div className="header-left">
                            <button className="menu-btn">
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                            <h1>Progress</h1>
                        </div>

                        <div className="toggle-container">
                            <button
                                className={`toggle-btn ${viewMode === 'today' ? 'active' : ''}`}
                                onClick={() => setViewMode('today')}
                            >
                                today
                            </button>
                            <button
                                className={`toggle-btn ${viewMode === 'total' ? 'active' : ''}`}
                                onClick={() => setViewMode('total')}
                            >
                                total
                            </button>
                        </div>
                    </div>

                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={500}>
                            <BarChart
                                data={getChartData()}
                                layout="vertical"
                                margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                                <XAxis type="number" />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    tick={{ fill: '#212121', fontSize: 14 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#FFFFFF',
                                        border: '1px solid #E0E0E0',
                                        borderRadius: '8px',
                                        fontFamily: 'Cairo',
                                    }}
                                />
                                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                                    {getChartData().map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill="#5DD9D9" />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-legend">
                        {getChartData().map((item, index) => (
                            <div key={index} className="legend-item">
                                <span className="legend-bar" style={{ width: `${(item.value / Math.max(...getChartData().map(d => d.value))) * 100}%` }}></span>
                                <span className="legend-value">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Progress;

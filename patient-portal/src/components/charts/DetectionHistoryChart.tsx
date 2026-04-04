// patient-portal/src/components/charts/DetectionHistoryChart.tsx

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { analyticsService, type DetectionHistory } from '../../services/analyticsService';
import { format } from 'date-fns';
import { Activity, ShieldCheck, TrendingUp } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const DetectionHistoryChart: React.FC = () => {
    const [data, setData] = useState<DetectionHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const history = await analyticsService.getMyDetectionHistory();
            setData(history);
        } catch (error) {
            console.error('Failed to load detection history:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[300px] flex items-center justify-center">
                <LoadingSpinner size="sm" text="Syncing history..." />
            </div>
        );
    }

    const totalCaries = data.reduce((sum, item) => sum + item.caries_count, 0);

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl shadow-blue-900/5 border border-white/50 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
                <div>
                   <div className="flex items-center gap-2 mb-1">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Detection History</h3>
                   </div>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Clinical Diagnostic Analytics</p>
                </div>
                <div className="text-right">
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black tracking-tighter text-emerald-500">{totalCaries}</span>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Total Findings</span>
                    </div>
                </div>
            </div>

            <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis 
                            dataKey="date" 
                            tickFormatter={(date) => format(new Date(date), 'MMM dd')}
                            stroke="#cbd5e1"
                            axisLine={false}
                            tickLine={false}
                            style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase' }}
                        />
                        <YAxis 
                            stroke="#cbd5e1" 
                            axisLine={false}
                            tickLine={false}
                            style={{ fontSize: '10px', fontWeight: '800' }} 
                        />
                        <Tooltip 
                            cursor={{ fill: 'rgba(30, 58, 138, 0.03)' }}
                            labelFormatter={(date) => format(new Date(date), 'MMMM dd, yyyy')}
                            contentStyle={{ 
                                borderRadius: '1.25rem', 
                                border: 'none',
                                boxShadow: '0 25px 50px -12px rgba(30, 58, 138, 0.25)',
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(8px)',
                                padding: '12px 16px'
                            }}
                            itemStyle={{ 
                                fontSize: '10px', 
                                fontWeight: '900', 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.1em',
                                color: '#10b981'
                            }}
                            labelStyle={{
                                fontSize: '9px',
                                fontWeight: '700',
                                color: '#94a3b8',
                                marginBottom: '4px',
                                textTransform: 'uppercase'
                            }}
                        />
                        <Bar 
                            dataKey="caries_count" 
                            fill="#10b981" 
                            radius={[8, 8, 0, 0]} 
                            maxBarSize={40}
                            name="Caries"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-emerald-50/50 group-hover:border-emerald-100 transition-all duration-500">
                    <div className="flex items-center gap-3 mb-1">
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregate Count</span>
                    </div>
                    <p className="text-xl font-black text-slate-900 tracking-tighter">{totalCaries}</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-blue-50/50 group-hover:border-blue-100 transition-all duration-500">
                    <div className="flex items-center gap-3 mb-1">
                        <Activity className="h-4 w-4 text-primary" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Depth</span>
                    </div>
                    <p className="text-xl font-black text-slate-900 tracking-tighter">{data.length} Scans</p>
                </div>
            </div>

            {data.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] z-20">
                    <ShieldCheck className="h-12 w-12 text-slate-200 mb-4 animate-pulse" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diagnostic Logs Empty</p>
                </div>
            )}
        </div>
    );
};

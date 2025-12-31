// frontend/src/components/dashboard/Statistics.tsx
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, User, FileText } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import type { Detection } from '../../types/detection.types';
import type { Patient } from '../../types/patient.types';

interface StatisticsProps {
  patients: Patient[];
  detections: Detection[];
}

export const Statistics: React.FC<StatisticsProps> = ({ patients, detections }) => {
  const navigate = useNavigate();
  
  // --- Data Processing ---
  const totalPatients = patients.length;
  const totalDetections = detections.length;
  
  // Recent detections for the "Table" section
  const recentDetections = detections
    .sort((a, b) => new Date(b.detection_date).getTime() - new Date(a.detection_date).getTime())
    .slice(0, 4);

  // 1. CHART DATA LOGIC - DAILY (Last 14 Days)
  const chartData = useMemo(() => {
    const data = [];
    const today = new Date();
    const daysToShow = 14; 
    
    for (let i = daysToShow - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      
      // Label: "Nov 15"
      const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      // Key: "2023-11-15" for comparison
      const dateKey = d.toISOString().split('T')[0];

      // Aggregate data for this specific day
      const dayDetections = detections.filter(det => {
        const detDate = new Date(det.detection_date);
        return detDate.toISOString().split('T')[0] === dateKey;
      });

      const cariesCount = dayDetections.reduce((sum, d) => sum + d.total_caries_detected, 0);

      data.push({
        date: dateLabel,
        detections: dayDetections.length,
        caries: cariesCount,
      });
    }
    return data;
  }, [detections]);

  // 2. GAUGE / SCAN RATE LOGIC
  const rawRate = totalPatients > 0 ? Math.round((totalDetections / totalPatients) * 100) : 0;
  const visualRate = Math.min(rawRate, 100); 
  
  const pieData = [
    { name: 'Scanned', value: visualRate },
    { name: 'Remaining', value: 100 - visualRate },
  ];
  
  const PIE_COLORS = ['#3B82F6', '#F1F5F9'];

  // --- Components ---

  const KPICard = ({ title, value, subtext, trend, icon: Icon }: any) => (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-200 bg-white rounded-[20px]">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <Icon className="h-6 w-6" />
          </div>
          {trend && (
            <span className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {trend > 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
        <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
        <p className="text-sm text-slate-400 font-medium mt-1">{title}</p>
        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2">
           <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
           </div>
           <span className="text-xs text-gray-400">65% Target</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-12 gap-6">
      
      {/* LEFT COLUMN: KPI STACK */}
      <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
        <KPICard 
          title="Total Patients" 
          value={totalPatients} 
          trend={12} 
          icon={User} 
        />
        <KPICard 
          title="Total Analyses" 
          value={totalDetections} 
          trend={8.5} 
          icon={FileText} 
        />
        
        {/* Simplified Summary Card */}
        <Card className="border-none shadow-sm bg-blue-600 text-white rounded-[20px] relative overflow-hidden mt-auto">
          <CardContent className="p-6 relative z-10">
            <h3 className="text-lg font-semibold mb-1">Weekly Report</h3>
            <p className="text-blue-100 text-sm mb-4">Detection accuracy increased.</p>
            <h2 className="text-3xl font-bold mb-2">98.5%</h2>
            <div className="text-xs text-blue-200">Confidence Score</div>
          </CardContent>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-10 -mb-10 blur-xl"></div>
        </Card>
      </div>

      {/* RIGHT COLUMN: MAIN CONTENT */}
      <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
        
        {/* TOP ROW: LARGE LINE/AREA CHART */}
        <Card className="border-none shadow-sm bg-white rounded-[20px] overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Analysis Overview</h3>
                <p className="text-sm text-slate-400">Daily detection volume trends (Last 14 days)</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400"><MoreHorizontal className="h-5 w-5" /></button>
              </div>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDetections" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94A3B8', fontSize: 12}} 
                    dy={10} 
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94A3B8', fontSize: 12}} 
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="detections" 
                    stroke="#3B82F6" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorDetections)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* BOTTOM ROW: GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. Circular Progress (Gauge) */}
          <Card className="border-none shadow-sm bg-white rounded-[20px]">
            <CardContent className="p-6 flex flex-col items-center justify-center h-full">
              <h4 className="text-slate-800 font-bold self-start w-full mb-2">Scan Rate</h4>
              <div className="relative w-full h-[160px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={80}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold text-slate-800">{rawRate}%</span>
                  <span className="text-xs text-slate-400">Coverage</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. List / Tables */}
          <Card className="border-none shadow-sm bg-white rounded-[20px] overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 pb-2">
                <h4 className="text-slate-800 font-bold">Recent Activity</h4>
              </div>
              <div className="flex flex-col">
                {recentDetections.length === 0 ? (
                    <div className="p-6 text-center text-sm text-gray-400">No activity</div>
                ) : (
                    recentDetections.map((d) => (
                    <div 
                        key={d.id} 
                        className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-l-2 border-transparent hover:border-blue-500"
                        onClick={() => navigate(`/detection/${d.id}`)}
                    >
                        <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${d.total_caries_detected > 0 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                        <div>
                            <p className="text-sm font-semibold text-slate-700">{d.detection_id.substring(0, 8)}</p>
                            <p className="text-xs text-slate-400">{new Date(d.detection_date).toLocaleDateString()}</p>
                        </div>
                        </div>
                        <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                        {d.total_caries_detected} Caries
                        </span>
                    </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* 3. Bar Chart (Findings) - Uses same Daily Data */}
          <Card className="border-none shadow-sm bg-white rounded-[20px]">
            <CardContent className="p-6">
              <h4 className="text-slate-800 font-bold mb-4">Findings</h4>
              <div className="h-[140px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <Bar dataKey="caries" fill="#3B82F6" radius={[4, 4, 4, 4]} barSize={8} />
                    <Bar dataKey="detections" fill="#E2E8F0" radius={[4, 4, 4, 4]} barSize={8} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                <span>Severity Analysis</span>
                <span>+2.4%</span>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};
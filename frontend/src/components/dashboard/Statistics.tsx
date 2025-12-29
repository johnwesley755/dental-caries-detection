// frontend/src/components/dashboard/Statistics.tsx
import React from 'react';
import { Users, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Detection } from '../../types/detection.types';
import type { Patient } from '../../types/patient.types';

interface StatisticsProps {
  patients: Patient[];
  detections: Detection[];
}

export const Statistics: React.FC<StatisticsProps> = ({ patients, detections }) => {
  // Calculate statistics
  const totalPatients = patients.length;
  const totalDetections = detections.length;
  const totalCariesFound = detections.reduce(
    (sum, d) => sum + d.total_caries_detected,
    0
  );
  const averageCariesPerDetection =
    totalDetections > 0 ? (totalCariesFound / totalDetections).toFixed(1) : '0';

  // Prepare monthly trend data
  const getMonthlyData = () => {
    const monthlyMap = new Map<string, { detections: number; caries: number }>();

    detections.forEach((detection) => {
      const date = new Date(detection.detection_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { detections: 0, caries: 0 });
      }

      const data = monthlyMap.get(monthKey)!;
      data.detections++;
      data.caries += detection.total_caries_detected;
    });

    // Get last 6 months
    const months = Array.from(monthlyMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6)
      .map(([month, data]) => {
        const [year, monthNum] = month.split('-');
        const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString(
          'en-US',
          { month: 'short' }
        );
        return {
          month: monthName,
          detections: data.detections,
          caries: data.caries,
        };
      });

    return months.length > 0
      ? months
      : [{ month: 'No Data', detections: 0, caries: 0 }];
  };

  const monthlyData = getMonthlyData();

  // Recent detections (last 7 days)
  const recentDetections = detections.filter((d) => {
    const detectionDate = new Date(d.detection_date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return detectionDate >= weekAgo;
  }).length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-3xl font-bold mt-2">{totalPatients}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Detections</p>
                <p className="text-3xl font-bold mt-2">{totalDetections}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {recentDetections} in last 7 days
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Caries Found</p>
                <p className="text-3xl font-bold mt-2 text-red-600">{totalCariesFound}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Caries/Detection</p>
                <p className="text-3xl font-bold mt-2">{averageCariesPerDetection}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Detections Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Detections Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="detections"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Detections"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Caries Found */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Caries Detected</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="caries" fill="#EF4444" name="Caries Found" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Detection Rate</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">
                {totalPatients > 0
                  ? ((totalDetections / totalPatients) * 100).toFixed(1)
                  : '0'}
                %
              </p>
              <p className="text-xs text-blue-600 mt-1">Detections per patient</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Active This Week</p>
              <p className="text-2xl font-bold text-green-700 mt-1">{recentDetections}</p>
              <p className="text-xs text-green-600 mt-1">New detections</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Success Rate</p>
              <p className="text-2xl font-bold text-purple-700 mt-1">
                {detections.filter((d) => d.status === 'completed' || d.status === 'reviewed')
                  .length > 0
                  ? (
                      (detections.filter(
                        (d) => d.status === 'completed' || d.status === 'reviewed'
                      ).length /
                        totalDetections) *
                      100
                    ).toFixed(1)
                  : '0'}
                %
              </p>
              <p className="text-xs text-purple-600 mt-1">Completed detections</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

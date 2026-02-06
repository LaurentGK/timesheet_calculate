import React from 'react';
import { MonthlyStats, formatDuration } from '../utils/timeCalculator';

interface MonthlySummaryProps {
  stats: MonthlyStats;
}

export const MonthlySummary: React.FC<MonthlySummaryProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
        <p className="text-gray-500 text-sm font-medium">总白班工时</p>
        <p className="text-2xl font-bold text-gray-800 mt-2">{formatDuration(stats.totalDayHours)}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
        <p className="text-gray-500 text-sm font-medium">总夜班工时</p>
        <p className="text-2xl font-bold text-gray-800 mt-2">{formatDuration(stats.totalNightHours)}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
        <p className="text-gray-500 text-sm font-medium">当月总工时</p>
        <p className="text-2xl font-bold text-gray-800 mt-2">{formatDuration(stats.totalHours)}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
        <p className="text-gray-500 text-sm font-medium">工作天数</p>
        <p className="text-2xl font-bold text-gray-800 mt-2">{stats.workDays} 天</p>
      </div>
    </div>
  );
};

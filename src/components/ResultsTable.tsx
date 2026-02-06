import React from 'react';
import { CalculatedRow, formatDuration } from '../utils/timeCalculator';

interface ResultsTableProps {
  rows: CalculatedRow[];
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ rows }) => {
  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg mt-6">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">日期</th>
            <th scope="col" className="px-6 py-3">上班时间</th>
            <th scope="col" className="px-6 py-3">下班时间</th>
            <th scope="col" className="px-6 py-3">白班工时</th>
            <th scope="col" className="px-6 py-3">夜班工时</th>
            <th scope="col" className="px-6 py-3">总工时</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4">{row.formattedDate}</td>
              <td className="px-6 py-4">{row.formattedStartTime}</td>
              <td className="px-6 py-4">{row.formattedEndTime}</td>
              <td className="px-6 py-4 font-medium text-blue-600">{formatDuration(row.dayHours)}</td>
              <td className="px-6 py-4 font-medium text-purple-600">{formatDuration(row.nightHours)}</td>
              <td className="px-6 py-4 font-bold text-gray-900">{formatDuration(row.totalHours)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

import React from 'react';
import { Download } from 'lucide-react';
import { utils, writeFile } from 'xlsx';
import { CalculatedRow, MonthlyStats } from '../utils/timeCalculator';

interface ExportButtonProps {
  rows: CalculatedRow[];
  stats: MonthlyStats;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ rows, stats }) => {
  const handleExport = () => {
    // Create a new workbook
    const wb = utils.book_new();

    // Format data for export
    const exportData = rows.map(row => ({
      '日期': row.formattedDate,
      '上班时间': row.formattedStartTime,
      '下班时间': row.formattedEndTime,
      '白班工时': Number(row.dayHours.toFixed(2)),
      '夜班工时': Number(row.nightHours.toFixed(2)),
      '总工时': Number(row.totalHours.toFixed(2))
    }));

    // Create worksheet
    const ws = utils.json_to_sheet(exportData);

    // Add summary
    utils.sheet_add_aoa(ws, [
      [],
      ['月度汇总'],
      ['总白班工时', stats.totalDayHours.toFixed(2)],
      ['总夜班工时', stats.totalNightHours.toFixed(2)],
      ['当月总工时', stats.totalHours.toFixed(2)],
      ['工作天数', stats.workDays]
    ], { origin: -1 });

    utils.book_append_sheet(wb, ws, '工时计算结果');

    // Save file
    writeFile(wb, `工时统计_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
    >
      <Download className="w-5 h-5" />
      <span>导出报表</span>
    </button>
  );
};

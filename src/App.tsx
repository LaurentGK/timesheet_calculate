import { useState, useMemo } from 'react';
import { FileUpload } from './components/FileUpload';
import { ResultsTable } from './components/ResultsTable';
import { MonthlySummary } from './components/MonthlySummary';
import { ExportButton } from './components/ExportButton';
import { TimesheetRow, calculateRowHours, calculateMonthlyStats, CalculatedRow } from './utils/timeCalculator';
import { Clock } from 'lucide-react';

function App() {
  const [data, setData] = useState<CalculatedRow[]>([]);

  const handleDataLoaded = (rawData: TimesheetRow[]) => {
    // Filter out empty rows or headers if mixed
    const calculated = rawData
      .filter(row => row.日期 && row.上班时间 !== undefined && row.下班时间 !== undefined)
      .map(calculateRowHours);
    setData(calculated);
  };

  const stats = useMemo(() => calculateMonthlyStats(data), [data]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">工时计算器</h1>
          </div>
          {data.length > 0 && <ExportButton rows={data} stats={stats} />}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">上传考勤表</h2>
          <FileUpload onDataLoaded={handleDataLoaded} />
        </div>

        {data.length > 0 && (
          <>
            <MonthlySummary stats={stats} />
            <ResultsTable rows={data} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;

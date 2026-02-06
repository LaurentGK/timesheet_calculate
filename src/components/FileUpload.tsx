import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { read, utils } from 'xlsx';
import { TimesheetRow } from '../utils/timeCalculator';

interface FileUploadProps {
  onDataLoaded: (data: TimesheetRow[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const arrayBuffer = evt.target?.result;
      const wb = read(arrayBuffer, { type: 'array' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = utils.sheet_to_json<TimesheetRow>(ws);
      onDataLoaded(data);
    };
    reader.readAsArrayBuffer(file);
  }, [onDataLoaded]);

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors cursor-pointer relative bg-gray-50">
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFile}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-blue-100 rounded-full">
          <Upload className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <p className="text-lg font-medium text-gray-700">点击或拖拽上传 Excel 文件</p>
          <p className="text-sm text-gray-500">支持 .xlsx 格式</p>
        </div>
      </div>
    </div>
  );
};

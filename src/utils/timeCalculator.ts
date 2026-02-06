import { utils } from 'xlsx';

export interface TimesheetRow {
  日期: number | string;
  上班时间: number;
  下班时间: number;
}

export interface CalculatedRow extends TimesheetRow {
  dayHours: number;
  nightHours: number;
  totalHours: number;
  formattedDate: string;
  formattedStartTime: string;
  formattedEndTime: string;
}

export interface MonthlyStats {
  totalDayHours: number;
  totalNightHours: number;
  totalHours: number;
  workDays: number;
}

// 19:00 = 19/24
const NIGHT_START_THRESHOLD = 19 / 24;

/**
 * Formats Excel serial date to YYYY-MM-DD string
 */
export const formatExcelDate = (serial: number | string): string => {
  if (typeof serial === 'string') return serial;
  const date = new Date(Math.round((serial - 25569) * 86400 * 1000));
  // Adjust for timezone offset if necessary, but Excel serial dates are usually local.
  // Actually, xlsx library has a utility for this.
  // Using simplified approach for now, assuming local time interpretation.
  // A safer way is using xlsx.SSF or just relying on the parsed value if xlsx parses it as date.
  // If raw: true, we get serial.
  
  // Standard Excel Epoch: 1899-12-30.
  // JS Epoch: 1970-01-01.
  // Difference is 25569 days.
  return date.toISOString().split('T')[0];
};

/**
 * Formats Excel fractional time to HH:mm string
 */
export const formatExcelTime = (fraction: number): string => {
  // Handle cross-day (fraction > 1) for display if needed, but usually we just want HH:mm
  const normalizedFraction = fraction % 1;
  const totalSeconds = Math.round(normalizedFraction * 24 * 3600);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

/**
 * Calculates hours for a single row
 */
export const calculateRowHours = (row: TimesheetRow): CalculatedRow => {
  let start = row.上班时间;
  let end = row.下班时间;
  
  // Handle case where parsing might fail or empty
  if (typeof start !== 'number' || typeof end !== 'number') {
    return {
      ...row,
      dayHours: 0,
      nightHours: 0,
      totalHours: 0,
      formattedDate: String(row.日期),
      formattedStartTime: String(start),
      formattedEndTime: String(end)
    };
  }

  // Scenario D: Cross-day
  if (end < start) {
    end += 1;
  }

  let dayHours = 0;
  let nightHours = 0;

  // Logic:
  // Day Shift: Time worked before 19:00 (0.791666...)
  // Night Shift: Time worked after 19:00
  
  // Intersection with Day Interval [0, NIGHT_START_THRESHOLD]
  if (start < NIGHT_START_THRESHOLD) {
    const dayEnd = Math.min(end, NIGHT_START_THRESHOLD);
    dayHours = (dayEnd - start) * 24;
  }

  // Intersection with Night Interval [NIGHT_START_THRESHOLD, Infinity)
  if (end > NIGHT_START_THRESHOLD) {
    const nightStart = Math.max(start, NIGHT_START_THRESHOLD);
    nightHours = (end - nightStart) * 24;
  }

  // Round to 2 decimal places? Or keep precise?
  // Usually timesheets might round to minutes.
  // Prompt output example shows "XX 小时 XX 分钟", so we can keep decimal for calculation and format later.
  
  return {
    ...row,
    dayHours,
    nightHours,
    totalHours: dayHours + nightHours,
    formattedDate: typeof row.日期 === 'number' ? formatExcelDate(row.日期) : String(row.日期),
    formattedStartTime: formatExcelTime(row.上班时间),
    formattedEndTime: formatExcelTime(row.下班时间) // This will show next day time correctly if we mod 1, but for display logic we might want to show "Next day" indicator?
    // Requirement says just display. formatExcelTime handles % 1 so it shows 02:00 for 26:00.
  };
};

export const calculateMonthlyStats = (rows: CalculatedRow[]): MonthlyStats => {
  const stats = rows.reduce((acc, row) => {
    acc.totalDayHours += row.dayHours;
    acc.totalNightHours += row.nightHours;
    acc.totalHours += row.totalHours;
    if (row.totalHours > 0) acc.workDays += 1;
    return acc;
  }, {
    totalDayHours: 0,
    totalNightHours: 0,
    totalHours: 0,
    workDays: 0
  });

  return stats;
};

export const formatDuration = (hours: number): string => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}小时 ${m}分钟`;
};

import { describe, it, expect } from 'vitest';
import { calculateRowHours, TimesheetRow } from './timeCalculator';

describe('Time Calculator', () => {
  const baseRow = { 日期: 45000, 上班时间: 0, 下班时间: 0 };

  it('Scenario A: Day Shift Only (Start < 19:00, End < 19:00)', () => {
    // 08:00 = 8/24 = 0.3333
    // 17:00 = 17/24 = 0.7083
    const row: TimesheetRow = { ...baseRow, 上班时间: 8/24, 下班时间: 17/24 };
    const result = calculateRowHours(row);
    expect(result.dayHours).toBeCloseTo(9, 1);
    expect(result.nightHours).toBeCloseTo(0, 1);
    expect(result.totalHours).toBeCloseTo(9, 1);
  });

  it('Scenario B: Mixed Shift (Start < 19:00, End > 19:00)', () => {
    // 18:00 = 18/24 = 0.75
    // 20:00 = 20/24 = 0.8333
    const row: TimesheetRow = { ...baseRow, 上班时间: 18/24, 下班时间: 20/24 };
    const result = calculateRowHours(row);
    // Day: 18:00 to 19:00 = 1h
    // Night: 19:00 to 20:00 = 1h
    expect(result.dayHours).toBeCloseTo(1, 1);
    expect(result.nightHours).toBeCloseTo(1, 1);
    expect(result.totalHours).toBeCloseTo(2, 1);
  });

  it('Scenario C: Night Shift Only (Start > 19:00, End > 19:00)', () => {
    // 20:00 = 20/24 = 0.8333
    // 22:00 = 22/24 = 0.9166
    const row: TimesheetRow = { ...baseRow, 上班时间: 20/24, 下班时间: 22/24 };
    const result = calculateRowHours(row);
    expect(result.dayHours).toBeCloseTo(0, 1);
    expect(result.nightHours).toBeCloseTo(2, 1);
    expect(result.totalHours).toBeCloseTo(2, 1);
  });

  it('Scenario D: Cross Day (End < Start)', () => {
    // 18:00 = 18/24 = 0.75
    // 02:00 = 2/24 = 0.0833
    const row: TimesheetRow = { ...baseRow, 上班时间: 18/24, 下班时间: 2/24 };
    const result = calculateRowHours(row);
    // Day: 18:00 to 19:00 = 1h
    // Night: 19:00 to 02:00 (next day) = 7h
    expect(result.dayHours).toBeCloseTo(1, 1);
    expect(result.nightHours).toBeCloseTo(7, 1);
    expect(result.totalHours).toBeCloseTo(8, 1);
  });

  it('Boundary: Exactly 19:00 Start', () => {
    // Start 19:00, End 20:00
    const row: TimesheetRow = { ...baseRow, 上班时间: 19/24, 下班时间: 20/24 };
    const result = calculateRowHours(row);
    expect(result.dayHours).toBeCloseTo(0, 1);
    expect(result.nightHours).toBeCloseTo(1, 1);
  });
  
  it('Boundary: Exactly 19:00 End', () => {
    // Start 18:00, End 19:00
    const row: TimesheetRow = { ...baseRow, 上班时间: 18/24, 下班时间: 19/24 };
    const result = calculateRowHours(row);
    expect(result.dayHours).toBeCloseTo(1, 1);
    expect(result.nightHours).toBeCloseTo(0, 1);
  });
});

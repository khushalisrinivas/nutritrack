import { IFoodEntry } from '../config/db';

export function calculateUserStreak(entries: IFoodEntry[]): {
  currentStreak: number;
  longestStreak: number;
  activeDates: string[];
} {
  if (!entries.length) {
    return { currentStreak: 0, longestStreak: 0, activeDates: [] };
  }

  // Get unique sorted dates in descending order
  const uniqueDates = Array.from(new Set(entries.map((e) => e.date))).sort().reverse();

  if (uniqueDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, activeDates: [] };
  }

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let currentStreak = 0;
  let checkDate = new Date();

  // If user hasn't logged today, check if yesterday was logged to continue the streak
  const hasLoggedToday = uniqueDates.includes(today);
  const hasLoggedYesterday = uniqueDates.includes(yesterday);

  if (hasLoggedToday) {
    currentStreak = 1;
    let daysBack = 1;
    while (true) {
      const prev = new Date(Date.now() - daysBack * 86400000).toISOString().split('T')[0];
      if (uniqueDates.includes(prev)) {
        currentStreak++;
        daysBack++;
      } else {
        break;
      }
    }
  } else if (hasLoggedYesterday) {
    currentStreak = 1;
    let daysBack = 2;
    while (true) {
      const prev = new Date(Date.now() - daysBack * 86400000).toISOString().split('T')[0];
      if (uniqueDates.includes(prev)) {
        currentStreak++;
        daysBack++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  const sortedAscending = [...uniqueDates].sort();
  let longestStreak = 0;
  let running = 0;
  let prevTimestamp = 0;

  for (const dateStr of sortedAscending) {
    const ts = new Date(dateStr).getTime();
    if (prevTimestamp === 0) {
      running = 1;
    } else {
      const diffDays = Math.round((ts - prevTimestamp) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        running++;
      } else if (diffDays > 1) {
        running = 1;
      }
    }
    prevTimestamp = ts;
    if (running > longestStreak) longestStreak = running;
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    activeDates: uniqueDates,
  };
}

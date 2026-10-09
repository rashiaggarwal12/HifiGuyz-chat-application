// Local calendar day as YYYY-MM-DD (streaks follow the user's own day, not UTC)
export const localDay = (date = new Date()) => {
  const d = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return d.toISOString().slice(0, 10);
};

// A streak only counts if the user practiced today or yesterday
export const activeStreak = (stats) => {
  if (!stats?.lastPracticeDate) return 0;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const last = stats.lastPracticeDate;
  return last === localDay() || last === localDay(yesterday) ? stats.currentStreak || 0 : 0;
};

export const practicedToday = (stats) => stats?.lastPracticeDate === localDay();

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

function plural(value: number, unit: string): string {
  return `${value} ${unit}${value === 1 ? '' : 's'}`;
}

/**
 * Human-readable distance between `timestamp` and `now`, e.g. "3 days ago" or "in 2 hours".
 *
 * Each unit is floored, so a boundary is crossed only once the full unit has elapsed
 * (59 min 59 s → "59 minutes ago", 60 min → "1 hour ago"). Months are 30 days and years
 * are 365 days. Anything under a minute either way reads "just now", which also absorbs
 * small clock skew between the file system and the browser.
 *
 * Returns null when either value is not a valid date, so callers can omit the label.
 */
export function formatRelativeTime(timestamp: number, now: number = Date.now()): string | null {
  if (!Number.isFinite(timestamp) || !Number.isFinite(now)) return null;
  if (Number.isNaN(new Date(timestamp).getTime())) return null;

  const diff = now - timestamp;
  const elapsed = Math.abs(diff);
  if (elapsed < MINUTE) return 'just now';

  let phrase: string;
  if (elapsed < HOUR) {
    phrase = plural(Math.floor(elapsed / MINUTE), 'minute');
  } else if (elapsed < DAY) {
    phrase = plural(Math.floor(elapsed / HOUR), 'hour');
  } else if (elapsed < MONTH) {
    phrase = plural(Math.floor(elapsed / DAY), 'day');
  } else if (elapsed < YEAR) {
    // 360–364 days would floor to 12 months; cap so the year boundary stays the switch-over.
    phrase = plural(Math.min(11, Math.floor(elapsed / MONTH)), 'month');
  } else {
    phrase = plural(Math.floor(elapsed / YEAR), 'year');
  }

  return diff >= 0 ? `${phrase} ago` : `in ${phrase}`;
}

import { describe, it, expect } from 'vitest';
import { formatRelativeTime } from '../lib/relativeTime';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const NOW = Date.UTC(2026, 9, 17, 12, 0, 0);

function ago(ms: number): string | null {
  return formatRelativeTime(NOW - ms, NOW);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('formatRelativeTime', () => {
  describe('recent timestamps', () => {
    it('reads "just now" for the same instant', () => {
      expect(ago(0)).toBe('just now');
    });

    it('reads "just now" up to 59 seconds', () => {
      expect(ago(59 * SECOND)).toBe('just now');
      expect(ago(MINUTE - 1)).toBe('just now');
    });

    it('switches to minutes at exactly 60 seconds, singular', () => {
      expect(ago(MINUTE)).toBe('1 minute ago');
    });

    it('pluralises minutes', () => {
      expect(ago(2 * MINUTE)).toBe('2 minutes ago');
      expect(ago(59 * MINUTE + 59 * SECOND)).toBe('59 minutes ago');
    });
  });

  describe('hour boundaries', () => {
    it('switches to hours at exactly 60 minutes', () => {
      expect(ago(HOUR - 1)).toBe('59 minutes ago');
      expect(ago(HOUR)).toBe('1 hour ago');
    });

    it('floors partial hours', () => {
      expect(ago(HOUR + 59 * MINUTE)).toBe('1 hour ago');
      expect(ago(2 * HOUR)).toBe('2 hours ago');
    });
  });

  describe('day boundaries', () => {
    it('switches to days at exactly 24 hours', () => {
      expect(ago(DAY - 1)).toBe('23 hours ago');
      expect(ago(DAY)).toBe('1 day ago');
    });

    it('reads "3 days ago" for three days', () => {
      expect(ago(3 * DAY)).toBe('3 days ago');
      expect(ago(3 * DAY + 23 * HOUR)).toBe('3 days ago');
    });

    it('stays in days up to 29 days', () => {
      expect(ago(29 * DAY + 23 * HOUR)).toBe('29 days ago');
    });
  });

  describe('older dates', () => {
    it('switches to months at 30 days', () => {
      expect(ago(30 * DAY)).toBe('1 month ago');
      expect(ago(59 * DAY)).toBe('1 month ago');
      expect(ago(60 * DAY)).toBe('2 months ago');
    });

    it('never reads "12 months" — caps at 11 just before the year boundary', () => {
      expect(ago(359 * DAY)).toBe('11 months ago');
      expect(ago(364 * DAY)).toBe('11 months ago');
    });

    it('switches to years at 365 days', () => {
      expect(ago(365 * DAY)).toBe('1 year ago');
      expect(ago(2 * 365 * DAY)).toBe('2 years ago');
    });

    it('handles the Unix epoch and very old files', () => {
      expect(formatRelativeTime(0, NOW)).toBe('56 years ago');
      expect(formatRelativeTime(Date.UTC(1900, 0, 1), NOW)).toBe('126 years ago');
    });
  });

  describe('future timestamps', () => {
    it('treats small clock skew as "just now"', () => {
      expect(ago(-30 * SECOND)).toBe('just now');
    });

    it('describes later times as "in …"', () => {
      expect(ago(-MINUTE)).toBe('in 1 minute');
      expect(ago(-2 * HOUR)).toBe('in 2 hours');
      expect(ago(-3 * DAY)).toBe('in 3 days');
    });
  });

  describe('missing or invalid metadata', () => {
    it('returns null for non-finite timestamps', () => {
      expect(formatRelativeTime(NaN, NOW)).toBeNull();
      expect(formatRelativeTime(Infinity, NOW)).toBeNull();
      expect(formatRelativeTime(-Infinity, NOW)).toBeNull();
    });

    it('returns null for timestamps outside the valid Date range', () => {
      expect(formatRelativeTime(8.64e15 + 1, NOW)).toBeNull();
    });

    it('returns null when "now" is invalid', () => {
      expect(formatRelativeTime(NOW, NaN)).toBeNull();
    });
  });

  it('defaults "now" to the current time', () => {
    expect(formatRelativeTime(Date.now() - 3 * DAY)).toBe('3 days ago');
  });
});

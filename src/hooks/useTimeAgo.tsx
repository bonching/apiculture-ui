/**
 * Convert a Unix timestamp to a relative time string like 'N seconds ago'.
 * The timestamp is treated as UTC (Unix timestamp in seconds since epoch).
 * @param timestamp - Unix timestamp (seconds since epoch, UTC).
 * @returns Relative time string.
 */
export function timeAgo(timestamp: number): string {
    const now = new Date(); // Current time (UTC-based epoch)
    const past = new Date(timestamp * 1000); // Parse UTC timestamp to Date object
    const delta = now.getTime() - past.getTime(); // Millisecond difference (timezone-agnostic)
    const totalSeconds = Math.floor(delta / 1000);

    if (totalSeconds < 1) {
        return 'just now';
    }

    if (totalSeconds < 60) {
        const seconds = totalSeconds;
        const unit = seconds === 1 ? 'second' : 'seconds';
        return `${seconds} ${unit} ago`;
    } else if (totalSeconds < 3600) {
        const minutes = Math.floor(totalSeconds / 60);
        const unit = minutes === 1 ? 'minute' : 'minutes';
        return `${minutes} ${unit} ago`;
    } else if (totalSeconds < 86400) {
        const hours = Math.floor(totalSeconds / 3600);
        const unit = hours === 1 ? 'hour' : 'hours';
        return `${hours} ${unit} ago`;
    } else if (totalSeconds < 7 * 86400) {
        const days = Math.floor(totalSeconds / 86400);
        const unit = days === 1 ? 'day' : 'days';
        return `${days} ${unit} ago`;
    } else {
        const weeks = Math.floor(totalSeconds / (7 * 86400));
        const unit = weeks === 1 ? 'week' : 'weeks';
        return `${weeks} ${unit} ago`;
    }
}

// Optional: React hook for using in components (without useMemo for direct recalculation on render)
// Note: This will recompute on every render; use sparingly or with memoization elsewhere if needed.
export function useTimeAgo(timestamp: number): string {
    return timeAgo(timestamp);
}

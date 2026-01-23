/**
 * utils/timeFormatter.js
 * Format relative time like "a day ago", "2 hours ago", etc.
 */

module.exports.getRelativeTime = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSecs < 60) {
        return diffSecs === 1 ? 'just now' : `${diffSecs} seconds ago`;
    } else if (diffMins < 60) {
        return diffMins === 1 ? 'a minute ago' : `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
        return diffHours === 1 ? 'an hour ago' : `${diffHours} hours ago`;
    } else if (diffDays < 7) {
        return diffDays === 1 ? 'a day ago' : `${diffDays} days ago`;
    } else if (diffWeeks < 4) {
        return diffWeeks === 1 ? 'a week ago' : `${diffWeeks} weeks ago`;
    } else if (diffMonths < 12) {
        return diffMonths === 1 ? 'a month ago' : `${diffMonths} months ago`;
    } else {
        return diffYears === 1 ? 'a year ago' : `${diffYears} years ago`;
    }
};

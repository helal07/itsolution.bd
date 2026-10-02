/**
 * Universal Date and Time Formatting Utilities
 * Standardizes all dates and times into universally understandable common formats:
 * - Date: "02 Oct 2026" (Day Month Year)
 * - Time: "02:20 PM" (12-hour format with AM/PM)
 * - Full Date: "Friday, 02 Oct 2026"
 * - Date & Time: "02 Oct 2026, 02:20 PM"
 */

const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const WEEKDAY_NAMES = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

/**
 * Format a time string (e.g., "14:20:00", "09:05", or ISO timestamp) into common 12-hour "hh:mm AM/PM".
 *
 * @param {string|Date|null} timeInput
 * @param {string} fallback
 * @returns {string} e.g. "02:20 PM"
 */
export function formatTime(timeInput, fallback = '—') {
    if (!timeInput) return fallback;

    // Handle "HH:MM" or "HH:MM:SS" time strings from MySQL TIME columns
    if (typeof timeInput === 'string' && timeInput.includes(':') && !timeInput.includes('T')) {
        const parts = timeInput.trim().split(':');
        let hours = parseInt(parts[0], 10);
        const minutes = parts[1] || '00';

        if (isNaN(hours)) return timeInput;

        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours === 0 ? 12 : hours;
        const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;

        return `${formattedHours}:${minutes} ${ampm}`;
    }

    // Handle Date object or ISO datetime string
    try {
        const date = timeInput instanceof Date ? timeInput : new Date(timeInput);
        if (isNaN(date.getTime())) return String(timeInput);

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours === 0 ? 12 : hours;
        const formattedHours = String(hours).padStart(2, '0');

        return `${formattedHours}:${minutes} ${ampm}`;
    } catch {
        return String(timeInput);
    }
}

/**
 * Format a date string (e.g., "2026-10-02" or ISO datetime) into common "02 Oct 2026".
 *
 * @param {string|Date|null} dateInput
 * @param {string} fallback
 * @returns {string} e.g. "02 Oct 2026"
 */
export function formatDate(dateInput, fallback = '—') {
    if (!dateInput) return fallback;

    // Handle standard "YYYY-MM-DD" without timezone shift
    if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}/.test(dateInput.trim())) {
        const datePart = dateInput.trim().substring(0, 10);
        const [yearStr, monthStr, dayStr] = datePart.split('-');
        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10);
        const day = parseInt(dayStr, 10);

        if (!isNaN(year) && !isNaN(month) && !isNaN(day) && month >= 1 && month <= 12) {
            const formattedDay = day < 10 ? `0${day}` : `${day}`;
            const monthName = MONTH_NAMES[month - 1];
            return `${formattedDay} ${monthName} ${year}`;
        }
    }

    try {
        const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
        if (isNaN(date.getTime())) return String(dateInput);

        const day = String(date.getDate()).padStart(2, '0');
        const monthName = MONTH_NAMES[date.getMonth()];
        const year = date.getFullYear();

        return `${day} ${monthName} ${year}`;
    } catch {
        return String(dateInput);
    }
}

/**
 * Format a full weekday and date (e.g., "Friday, 02 Oct 2026").
 *
 * @param {string|Date|null} dateInput
 * @param {string} fallback
 * @returns {string} e.g. "Friday, 02 Oct 2026"
 */
export function formatFullDate(dateInput, fallback = '—') {
    if (!dateInput) return fallback;

    try {
        let date;
        if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput.trim())) {
            const [y, m, d] = dateInput.trim().split('-').map(Number);
            date = new Date(y, m - 1, d);
        } else {
            date = dateInput instanceof Date ? dateInput : new Date(dateInput);
        }

        if (isNaN(date.getTime())) return String(dateInput);

        const weekday = WEEKDAY_NAMES[date.getDay()];
        const day = String(date.getDate()).padStart(2, '0');
        const monthName = MONTH_NAMES[date.getMonth()];
        const year = date.getFullYear();

        return `${weekday}, ${day} ${monthName} ${year}`;
    } catch {
        return String(dateInput);
    }
}

/**
 * Format date and time combined (e.g., "02 Oct 2026, 02:20 PM").
 *
 * @param {string|Date|null} dateTimeInput
 * @param {string} fallback
 * @returns {string} e.g. "02 Oct 2026, 02:20 PM"
 */
export function formatDateTime(dateTimeInput, fallback = '—') {
    if (!dateTimeInput) return fallback;

    try {
        const date = dateTimeInput instanceof Date ? dateTimeInput : new Date(dateTimeInput);
        if (isNaN(date.getTime())) return String(dateTimeInput);

        const dateStr = formatDate(date);
        const timeStr = formatTime(date);

        return `${dateStr}, ${timeStr}`;
    } catch {
        return String(dateTimeInput);
    }
}

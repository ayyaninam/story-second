import React from "react";

/**
 * Calculates the difference between two dates and returns the number of days.
 * @param startDateStr The start date as a string.
 * @param endDateStr The end date as a string.
 * as JavaScript's Date constructor is used for parsing which has its own parsing rules.
 * @returns The number of days between the two dates or an error message.
 */
export function calculateDaysBetweenDates(
	startDateStr: string,
	endDateStr: string
): string | number {
	try {
		const startDate = new Date(startDateStr);
		const endDate = new Date(endDateStr);
		const timeDiff = endDate.getTime() - startDate.getTime();

		if (isNaN(timeDiff)) {
			throw new Error("Invalid date format.");
		}

		const daysDiff = timeDiff / (1000 * 3600 * 24);

		if (daysDiff < 0) {
			throw new Error("End date must be after start date.");
		}

		return Math.round(daysDiff);
	} catch (error) {
		return `Error: ${(error as Error).message}`;
	}
}

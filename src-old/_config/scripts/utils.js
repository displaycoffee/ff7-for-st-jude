/* React */
import { createRoot } from 'react-dom/client';

/* Create Intl.NumberFormat instance for utils.formatCurrency function */
const formatterOptions = {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
	style: 'currency',
	currency: 'USD',
};
const formatter = new Intl.NumberFormat('en-US', formatterOptions);

export const utils = {
	formatCurrency: (number) => {
		// Format currency using formatter
		return formatter.format(number);
	},
	merge: (array) => {
		// Merge array of arrays
		return array.reduce((merge, next) => merge.concat(next), []);
	},
	updateDonations: (donations) => {
		// Update donation details
		donations = utils.checkArray(donations);
		donations = utils.sort(donations, 'integer', 'milliseconds', 'desc');
		return donations;
	},
};

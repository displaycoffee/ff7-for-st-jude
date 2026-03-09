/* React */
import { createRoot } from 'react-dom/client';

export const utils = {
	updateDonations: (donations) => {
		// Update donation details
		donations = utils.checkArray(donations);
		donations = utils.sort(donations, 'integer', 'milliseconds', 'desc');
		return donations;
	},
};

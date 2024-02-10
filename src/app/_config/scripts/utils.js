export const utils = {
	checkAmount: (number) => {
		// Check number to always return a value
		return number ? utils.convertDecimal(number || number === 0) : 0;
	},
	checkArray: (array) => {
		// Ensure array has length and if not, reset to false
		return array && array.length !== 0 ? array : [];
	},
	checkTotals: (localCache) => {
		let totalChanged = false; // Variable to see if total has changed

		if (localCache.campaign) {
			// Get total amount for checking if prices have changed
			let campaignTotal = localCache.campaign.amounts.amount_raised;
			localCache.supporting.filter((d) => {
				const dValue = d.amount_raised.value || d.amount_raised.value === 0 ? utils.convertDecimal(d.amount_raised.value) : d.amount_raised;
				campaignTotal += dValue;
			});

			// Request campaign from api if amount has changed
			if (campaignTotal != localCache.campaign.amounts.total_amount_raised) {
				totalChanged = true;
			}
		} else {
			// If nothing is in cache, we should request
			totalChanged = true;
		}
		return totalChanged;
	},
	convertDecimal: (number) => {
		// Convert number to two decimal places
		return Math.round(number * 100) / 100;
	},
	filterContent: (type, data) => {
		// Get time for checking if content has expired
		const currentDate = new Date(Date.now());
		const currentMilliseconds = currentDate.getTime();

		// Variables for checking if content should be returned
		const isExpired = data.milliseconds < currentMilliseconds;

		// Set state for checks
		let contentActive = true;
		if (type == 'rewards') {
			const isRemaining = typeof data.quantity_remaining == 'number' && data.quantity_remaining > 0 ? true : false;
			contentActive = !isExpired && isRemaining && data.active;
		} else if (type == 'targets') {
			contentActive = !isExpired && data.active && data.amounts.amount_raised < data.amounts.amount;
		}
		return contentActive;
	},
	getAmounts: (detail) => {
		// Set values from currency data
		const amount = utils.checkAmount(detail?.amount?.value);
		const amount_raised = utils.checkAmount(detail?.amount_raised?.value);
		const goal = utils.checkAmount(detail?.goal?.value);
		const total = utils.checkAmount(detail?.total_amount_raised?.value);
		return {
			amount: amount,
			amount_raised: amount_raised,
			goal: goal,
			total_amount_raised: total,
		};
	},
	getDate: (time) => {
		// Get date and time from unix timestamp
		const date = new Date(time);
		return new Intl.DateTimeFormat(navigator.language, {
			dateStyle: 'full',
			timeStyle: 'long',
		}).format(date);
	},
	handleize: (value) => {
		// Format value for html classes
		return value
			.toLowerCase()
			.replace(/[^\w\s]/g, '')
			.replace(/\s/g, '-')
			.trim();
	},
	merge: (array) => {
		// Merge array of arrays
		return array.reduce((merge, next) => merge.concat(next), []);
	},
	scrollTo: (e, selector) => {
		// Scroll to element on page
		e.preventDefault();
		const scrollElement = selector ? document.querySelector(selector) : document.body;
		scrollElement.scrollIntoView({
			behavior: 'smooth',
		});
	},
	sort: (list, type, field, direction) => {
		// Sort values in a list based on type, field, and direction
		list.sort((a, b) => {
			let sortValueA = type == 'integer' && (a.amounts[field] || a.amounts[field] === 0) ? a.amounts[field] : a[field];
			let sortValueB = type == 'integer' && (b.amounts[field] || b.amounts[field] === 0) ? b.amounts[field] : b[field];

			if (type == 'string' || type == 'boolean') {
				// Make sure booleans are strings
				sortValueA = String(sortValueA);
				sortValueB = String(sortValueB);

				// Sorting method for strings
				if (direction == 'asc') {
					return sortValueA.localeCompare(sortValueB);
				}
				if (direction == 'desc') {
					return sortValueB.localeCompare(sortValueA);
				}
			}
			if (type == 'integer') {
				// Sorting method for numbers
				if (direction == 'asc') {
					return sortValueA - sortValueB;
				}
				if (direction == 'desc') {
					return sortValueB - sortValueA;
				}
			}
		});
		return list;
	},
	updateCampaign: (query, localCache, campaigns) => {
		// Update campaign details
		if (query) {
			localCache.campaign = query;
			localCache.campaign.date = campaigns.current.date;
			localCache.campaign.links = campaigns.current.links;
		} else {
			localCache.campaign = false;
		}
		return localCache.campaign;
	},
	updateDonations: (query, localCache) => {
		// Update donation details
		localCache.donations = utils.checkArray(query);
		localCache.donations = utils.sort(localCache.donations, 'integer', 'milliseconds', 'desc');
		return localCache.donations;
	},
	updateSupporting: (query, localCache) => {
		// Update supporting details
		localCache.supporting = utils.checkArray(query);
		localCache.supporting = utils.sort(localCache.supporting, 'integer', 'total_amount_raised', 'desc');
		return localCache.supporting;
	},
};

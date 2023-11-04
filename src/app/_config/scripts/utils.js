export const utils = {
	checkAmount: (number) => {
		// check number to always urn a value
		return number ? utils.convertDecimal(number || number === 0) : 0;
	},
	convertDecimal: (number) => {
		// convert number to two decimal places
		return Math.round(number * 100) / 100;
	},
	filterContent: (type, data) => {
		// get time for checking if content has expired
		const currentDate = new Date(Date.now());
		const currentMilliseconds = currentDate.getTime();

		// variables for checking if content should be returned
		const isExpired = data.milliseconds < currentMilliseconds;

		// set state for checks
		let contentActive = true;
		if (type == 'reward') {
			const isRemaining = typeof data.quantity_remaining == 'number' && data.quantity_remaining > 0 ? true : false;
			contentActive = !isExpired && isRemaining && data.active;
		} else if (type == 'target') {
			contentActive = !isExpired && data.active && data.amounts.amount_raised < data.amounts.amount;
		}
		return contentActive;
	},
	flatten: (object) => {
		// flatten object into array
		return Object.keys(object).map((value) => {
			return object[value];
		});
	},
	getAmounts: (detail) => {
		// set values from currency data
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
		// get date and time from unix timestamp
		const date = new Date(time);
		return new Intl.DateTimeFormat(navigator.language, {
			dateStyle: 'full',
			timeStyle: 'long',
		}).format(date);
	},
	getTotal: (starting, data, field) => {
		// get total amount for checking if prices have changed
		let total = starting;
		data.filter((d) => {
			const dValue = d[field].value || d[field].value === 0 ? utils.convertDecimal(d[field].value) : d[field];
			total += dValue;
		});
		return total;
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
		// merge array of arrays
		return array.reduce((merge, next) => merge.concat(next), []);
	},
	sort: (list, type, field, direction) => {
		// sort values in a list based on type, field, and direction
		list.sort((a, b) => {
			let sortValueA = type == 'integer' && (a.amounts[field] || a.amounts[field] === 0) ? a.amounts[field] : a[field];
			let sortValueB = type == 'integer' && (b.amounts[field] || b.amounts[field] === 0) ? b.amounts[field] : b[field];

			if (type == 'string' || type == 'boolean') {
				// make sure booleans are strings
				sortValueA = String(sortValueA);
				sortValueB = String(sortValueB);

				// sorting method for strings
				if (direction == 'asc') {
					return sortValueA.localeCompare(sortValueB);
				}
				if (direction == 'desc') {
					return sortValueB.localeCompare(sortValueA);
				}
			}
			if (type == 'integer') {
				// sorting method for numbers
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
};

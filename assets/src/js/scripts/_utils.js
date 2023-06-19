export const utils = {
	handleize: (value) => {
		// format value for html classes
		return value
			.toLowerCase()
			.replace(/[^\w\s]/g, '')
			.replace(/\s/g, '-')
			.trim();
	},
	flatten: (object) => {
		// flatten object into array
		return Object.keys(object).map((value) => {
			return object[value];
		});
	},
	merge: (array) => {
		// merge array of arrays
		return array.reduce((merge, next) => merge.concat(next), []);
	},
	size: (config) => {
		return Object.keys(config).length;
	},
	scrollTo: (e, id) => {
		e.preventDefault();
		document.querySelector(`#${id}`).scrollIntoView({
			behavior: 'smooth',
		});
	},
	values: {
		// functions for manipulating values
		getAmounts: (detail) => {
			// set values from currency data
			const amount = utils.values.checkAmount(detail?.amount?.value);
			const amount_raised = utils.values.checkAmount(detail?.amount_raised?.value);
			const goal = utils.values.checkAmount(detail?.goal?.value);
			const total = utils.values.checkAmount(detail?.total_amount_raised?.value);
			return {
				amount: amount,
				amount_raised: amount_raised,
				goal: goal,
				total_amount_raised: total,
			};
		},
		checkAmount: (number) => {
			// check number to always urn a value
			return number ? utils.values.convertDecimal(number || number === 0) : 0;
		},
		convertDecimal: (number) => {
			// convert number to two decimal places
			return Math.round(number * 100) / 100;
		},
		getTime: (time) => {
			// get date and time from unix timestamp
			return new Intl.DateTimeFormat(navigator.language, {
				dateStyle: 'full',
				timeStyle: 'long',
			}).format(time);
		},
		getTotal: (starting, data, field) => {
			// get total amount for checking if prices have changed
			let total = starting;
			data.filter((d) => {
				const dValue = d[field].value || d[field].value === 0 ? utils.values.convertDecimal(d[field].value) : d[field];
				total += dValue;
			});
			return total;
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
	},
	filterContent: (content, data) => {
		// get time for checking if content has expired
		const currentTime = Date.now();

		// variables for checking if content should be returned
		const isExpired = data.endsAt < currentTime;

		// set state for checks
		let contentActive = true;
		if (content == 'reward') {
			const isRemaining = typeof data.remaining == 'number' && data.remaining > 0 ? true : false;
			contentActive = !isExpired && isRemaining && data.active && !data.alwaysActive;
		} else if (content == 'challenge') {
			contentActive = !isExpired && data.active && data.total_amount_raised < data.amount_raised;
		}
		return contentActive;
	},
};

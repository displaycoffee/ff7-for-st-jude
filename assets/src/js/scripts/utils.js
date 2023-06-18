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
		toNumber: (number) => {
			const numberCheck = number ? number : 0;
			return !isNaN(Number(numberCheck)) ? numberCheck : 0;
		},
		getAmounts: (detail) => {
			const goal = detail?.goal?.value ? utils.values.convertDecimal(detail.goal.value || detail.goal.value === 0) : 0;
			const total = detail?.total_amount_raised?.value
				? utils.values.convertDecimal(detail.total_amount_raised.value || detail.total_amount_raised.value === 0)
				: 0;
			const amount = detail?.amount_raised?.value
				? utils.values.convertDecimal(detail.amount_raised.value || detail.amount_raised.value === 0)
				: 0;

			return {
				goal: goal,
				total_amount_raised: total,
				amount_raised: amount,
			};
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
				total += d[field];
			});
			return total;
		},
		sort: (list, type, field, direction) => {
			// sort values in a list based on type, field, and direction
			list.sort((a, b) => {
				let sortValueA = a[field];
				let sortValueB = b[field];

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
};

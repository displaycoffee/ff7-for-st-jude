export let utils = {
	handleize : (value) => {
		// format value for html classes
		return value.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s/g, '-').trim();
	},
	flatten : (object) => {
		// flatten object into array
		return Object.keys(object).map((value) => {
			return object[value];
		});
	},
	merge : (array) => {
		// merge array of arrays
		return array.reduce((merge, next) => merge.concat(next), []);
	},
	size : (config) => {
		return Object.keys(config).length;
	},
	scrollTo : (e, id) => {
		e.preventDefault();
		document.querySelector(`#${id}`).scrollIntoView({
			behavior : 'smooth'
		});
	},
	values: {
		// functions for manipulating values,
		getTime : (time) => {
			// get date and time from unix timestamp
			return new Intl.DateTimeFormat(navigator.language, {
				dateStyle : 'full',
				timeStyle : 'long'
			}).format(time);
		},
		getTotal : (starting, data, field) => {
			// get total amount for checking if prices have changed
			let total = starting;
			data.filter((d) => {
				total += d[field];
			});
			return total;
		},
		sort : (list, type, field, direction) => {
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

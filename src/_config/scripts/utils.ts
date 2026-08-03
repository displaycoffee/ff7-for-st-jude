/* Create Intl.NumberFormat instance for utils.formatCurrency function */
const formatter = new Intl.NumberFormat('en-US', {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
	style: 'currency',
	currency: 'USD',
});

export const utils: UtilsType = {
	checkAmount: (number?: number) => {
		// Check number to always return a value
		number = number ?? 0;
		return Math.round(number * 100) / 100;
	},
	checkArray: (array: unknown[]) => {
		// Check if array has length
		return array && array.length !== 0;
	},
	formatCurrency: (number: number) => {
		// Format currency using formatter
		return formatter.format(number);
	},
	getAmounts: (detail?: AmountsRawType) => {
		// Setup initial amount details
		const amounts = {
			amount: 0,
			amount_raised: 0,
			goal: 0,
			total_amount_raised: 0,
		};

		// Set values from currency data
		if (detail) {
			amounts.amount = utils.checkAmount(detail?.amount?.value);
			amounts.amount_raised = utils.checkAmount(detail?.amount_raised?.value);
			amounts.goal = utils.checkAmount(detail?.goal?.value);
			amounts.total_amount_raised = utils.checkAmount(detail?.total_amount_raised?.value);
		}

		return amounts;
	},
	getDate: (time: string) => {
		// Get date and time from unix timestamp
		const date = new Date(time);
		return new Intl.DateTimeFormat(navigator.language, {
			dateStyle: 'full',
			timeStyle: 'long',
		}).format(date);
	},
	getLast: (value: string | string[], delimeter?: string) => {
		// Get last item in array
		let valueArray: string[] | number[] = [];
		if (Array.isArray(value)) {
			valueArray = value;
		} else if (delimeter) {
			valueArray = value.split(delimeter);
		}
		return valueArray[valueArray.length - 1] ?? '';
	},
	handleize: (value: string) => {
		// Format value for html classes
		return value
			.toLowerCase()
			.trim()
			.replace(/[^\w\s]/g, '')
			.replace(/\s/g, '-');
	},
	isSticky: (element: HTMLElement | null, stickyClass: string) => {
		if (element) {
			// Create options and callback for observer
			const stickyOptions = { threshold: [1] };
			const stickyCallback = (e: IntersectionObserverEntry) => {
				e.target.classList.toggle(stickyClass, e.intersectionRatio < 1);
			};

			// Observe to toggle sticky class
			const stickyObserver = new IntersectionObserver(([e]) => stickyCallback(e), stickyOptions);
			stickyObserver.observe(element);
		}
	},
	scrollTo: (e?: EventsType, selector?: string, offset?: number) => {
		// Scroll to element on page
		if (e) {
			e.preventDefault();
		}
		const anchor = {
			selector: selector ?? '',
			offset: offset ?? 0,
			position: () => {
				const anchorElement = anchor.selector ? document.querySelector(anchor.selector) : false;
				return anchorElement ? anchorElement.getBoundingClientRect().top + window.scrollY - anchor.offset : -anchor.offset;
			},
		};
		window.scroll({ top: anchor.position(), left: 0, behavior: 'smooth' });

		// Move focus to the target so keyboard/screen-reader users know where they landed
		if (anchor.selector) {
			const anchorElement = document.querySelector<HTMLElement>(anchor.selector);
			anchorElement?.focus({ preventScroll: true });
		}
	},
	setActive: (type: string, data: RewardsType | TargetsType) => {
		// Get time for checking if content has expired
		const currentDate = new Date(Date.now());
		const currentMilliseconds = currentDate.getTime();

		// Variables for checking if content should be returned
		const isExpired = data.milliseconds < currentMilliseconds;

		// Determine if content is active
		let contentActive = true;
		if (type == 'rewards') {
			const rewardsData = data as RewardsType;
			contentActive = !isExpired && rewardsData.remaining > 0 && rewardsData.active;
		} else if (type == 'targets') {
			const targetsData = data as TargetsType;
			contentActive = !isExpired && targetsData.active && targetsData.amounts.amount_raised < targetsData.amounts.amount;
		}

		return contentActive;
	},
	setAttributes: (element: HTMLElement, attributes: ObjectStringType) => {
		// Set multiple attributes on an element
		for (const attribute in attributes) {
			element.setAttribute(attribute, attributes[attribute]);
		}
	},
	sort: (list: SortType[], type: PrimitiveType, field: string, direction: string) => {
		// Sort values in a list based on type, field, and direction
		return [...list].sort((a, b) => {
			let sortedValue = 0;

			if (type == 'string' || type == 'boolean') {
				a = a as ObjectPrimitiveType;
				b = b as ObjectPrimitiveType;

				// Make sure booleans are strings
				const sortValueA = String(a[field]);
				const sortValueB = String(b[field]);

				// Sorting method for strings
				if (direction == 'asc') {
					sortedValue = sortValueA.localeCompare(sortValueB);
				} else if (direction == 'desc') {
					sortedValue = sortValueB.localeCompare(sortValueA);
				}
			} else if (type == 'integer') {
				a = a.amounts as AmountsType;
				b = b.amounts as AmountsType;

				// Make sure values are numbers
				const sortValueA = Number(a[field]);
				const sortValueB = Number(b[field]);

				// Sorting method for numbers
				if (direction == 'asc') {
					sortedValue = sortValueA - sortValueB;
				} else if (direction == 'desc') {
					sortedValue = sortValueB - sortValueA;
				}
			}

			return sortedValue;
		});
	},
	truncate: (string: string, limit: number) => {
		// Limit characters in string
		if (string.length > limit) {
			return `${string.slice(0, limit - 3)}...`;
		} else {
			return string;
		}
	},
};

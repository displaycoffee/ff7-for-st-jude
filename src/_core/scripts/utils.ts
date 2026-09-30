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
	setActive: (type: string, data: PollsType | RewardsType) => {
		// Get time for checking if content has started or ended
		const currentMilliseconds = Date.now();

		// Content without an end date doesn't expire, it stays active until it's turned off
		const hasEnded = data.ends ? new Date(data.ends).getTime() < currentMilliseconds : false;

		// Determine if content is active
		let contentActive = true;
		if (type == 'polls') {
			// Polls close when they end, are turned off, or reach their goal (polls without a goal have a goal of 0)
			const { amount_raised, goal } = data.amounts;
			contentActive = data.active && !hasEnded && (goal == 0 || amount_raised < goal);
		} else if (type == 'rewards') {
			// Rewards are active once they start, until they're turned off, sell out, or end
			// Note: rewards without a start date are available right away, and rewards without a quantity (remaining is null) are unlimited
			const rewardsData = data as RewardsType;
			const hasStarted = rewardsData.starts ? new Date(rewardsData.starts).getTime() <= currentMilliseconds : true;
			const hasQuantity = rewardsData.remaining === null || rewardsData.remaining > 0;
			contentActive = rewardsData.active && hasStarted && !hasEnded && hasQuantity;
		}

		return contentActive;
	},
	setAttributes: (element: HTMLElement, attributes: ObjectStringType) => {
		// Set multiple attributes on an element
		for (const attribute in attributes) {
			element.setAttribute(attribute, attributes[attribute]);
		}
	},
	sort: <T>(list: T[], getValue: (item: T) => PrimitiveType, direction: 'asc' | 'desc') => {
		// Sort a list by the value getValue returns for each item, e.g. (campaign) => campaign.number
		// Note: numbers sort numerically, strings and booleans sort alphabetically
		return [...list].sort((a, b) => {
			const valueA = getValue(a);
			const valueB = getValue(b);
			const sortedValue =
				typeof valueA == 'number' && typeof valueB == 'number' ? valueA - valueB : String(valueA).localeCompare(String(valueB));

			return direction == 'asc' ? sortedValue : -sortedValue;
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

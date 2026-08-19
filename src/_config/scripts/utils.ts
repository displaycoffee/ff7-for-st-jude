/* Track the element that opened each trapped container, so focus can be restored to it on close */
const trapOpenerElements = new WeakMap<HTMLElement, HTMLElement>();

/* Track each container's Tab-trap handler, so it can be removed again on close */
const trapHandlers = new WeakMap<HTMLElement, (e: KeyboardEvent) => void>();

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
	focusTrap: {
		activate: (container: HTMLElement, focusSelector?: string) => {
			// Remember what had focus, move focus into the container (or a specific element within it), and trap Tab/Shift+Tab
			const opener = document.activeElement as HTMLElement | null;
			if (opener) trapOpenerElements.set(container, opener);

			// Focus on taget selector or container
			const target = (focusSelector ? container.querySelector<HTMLElement>(focusSelector) : null) ?? container;
			target.focus();

			// Selector for elements that can receive focus, used to trap Tab within the container
			const notDisabled = ':not([disabled])';
			const notTabIndex = ':not([tabindex="-1"])';
			const focusableSelector = `a[href], button${notDisabled}, input${notDisabled}, select${notDisabled}, textarea${notDisabled}, [tabindex]${notTabIndex}`;

			// Exclude elements matched by focusableSelector that are hidden (e.g. a collapsed dropdown's content)
			// and therefore not actually reachable via Tab, even though they match the selector
			const isFocusable = (element: HTMLElement) => {
				const style = getComputedStyle(element);
				return style.visibility !== 'hidden' && style.display !== 'none';
			};

			// Keep Tab / Shift + Tab cycling within the container while it's open
			const handleTrap = (e: KeyboardEvent) => {
				// If not the tab key, exit
				if (e.key !== 'Tab') return;

				// If no focusable elements, exit
				const focusable = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(isFocusable);
				if (focusable.length === 0) return;

				// Get first and last focusable elements
				const first = focusable[0];
				const last = focusable[focusable.length - 1];

				// Focus on first or last elements
				if (e.shiftKey && document.activeElement === first) {
					e.preventDefault();
					last.focus();
				} else if (!e.shiftKey && document.activeElement === last) {
					e.preventDefault();
					first.focus();
				}
			};

			// Save the handler so it can be removed on deactivate, then start trapping Tab
			trapHandlers.set(container, handleTrap);
			container.addEventListener('keydown', handleTrap);
		},
		deactivate: (container: HTMLElement) => {
			// Remove the Tab trap and restore focus to whatever opened the container
			const handleTrap = trapHandlers.get(container);
			if (handleTrap) {
				container.removeEventListener('keydown', handleTrap);
				trapHandlers.delete(container);
			}

			// Restore focus to whatever opened the container, then forget it
			trapOpenerElements.get(container)?.focus();
			trapOpenerElements.delete(container);
		},
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
			const targetsData = data;
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
				const objectA = a as ObjectPrimitiveType;
				const objectB = b as ObjectPrimitiveType;

				// Make sure booleans are strings
				const sortValueA = String(objectA[field]);
				const sortValueB = String(objectB[field]);

				// Sorting method for strings
				if (direction == 'asc') {
					sortedValue = sortValueA.localeCompare(sortValueB);
				} else if (direction == 'desc') {
					sortedValue = sortValueB.localeCompare(sortValueA);
				}
			} else if (type == 'integer') {
				const amountsA = a.amounts as AmountsType;
				const amountsB = b.amounts as AmountsType;

				// Make sure values are numbers
				const sortValueA = Number(amountsA[field as keyof AmountsType]);
				const sortValueB = Number(amountsB[field as keyof AmountsType]);

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

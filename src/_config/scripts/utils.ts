/* React */
import { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

export const utils = {
	checkAmount: (number?: number) => {
		// Check number to always return a value
		return number || number === 0 ? utils.convertDecimal(number) : 0;
	},
	checkArray: (array: ObjectPrimitiveType[]) => {
		// Ensure array has length and if not, reset to false
		return array && array.length !== 0 ? array : [];
	},
	checkTotals: (content: ContentType) => {
		const { campaign, supporting } = content;
		let totalChanged = false; // Variable to see if total has changed

		if (campaign && typeof campaign == 'object' && supporting && typeof supporting == 'object') {
			// Get total amount for checking if prices have changed
			let campaignTotal = campaign.amounts.amount_raised;
			supporting.forEach((d: AmountsValueType) => {
				const amountRaised = d?.amount_raised?.value ?? 0;
				const dValue = amountRaised ? utils.convertDecimal(amountRaised) : d.amount_raised;
				campaignTotal += dValue as number;
			});

			// Request campaign from api if amount has changed
			if (campaignTotal != campaign.amounts.total_amount_raised) {
				totalChanged = true;
			}
		} else {
			// If nothing is in cache, we should request
			totalChanged = true;
		}
		return totalChanged;
	},
	convertDecimal: (number: number) => {
		// Convert number to two decimal places
		return Math.round(number * 100) / 100;
	},
	filterContent: (type: string, data: FilterContentType) => {
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
	getAmounts: (detail?: AmountsValueType) => {
		// Setup initial amount details
		let amounts = {
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
	getLast: (value: string | [], delimeter?: string) => {
		// Get last item in array
		let valueArray = [] as string[] | number[];
		if (Array.isArray(value)) {
			valueArray = value;
		} else if (delimeter) {
			valueArray = value.split(delimeter);
		}
		return valueArray[valueArray.length - 1];
	},
	getPage: () => {
		// Get previous / parent page
		return window.location.pathname.split('/').slice(0, -1).join('/');
	},
	handleize: (value: string) => {
		// Format value for html classes
		return value
			.toLowerCase()
			.replace(/[^\w\s]/g, '')
			.replace(/\s/g, '-')
			.trim();
	},
	isSticky: (element: HTMLElement, stickyClass: string) => {
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
	renderTarget: (element: string, component: ReactNode) => {
		// Render target for app
		const targetElement = document.querySelector(element);
		if (targetElement) {
			const targetHasChildren = targetElement?.children && targetElement.children.length !== 0 ? true : false;
			if (!targetHasChildren) {
				const targetTarget = createRoot(targetElement);
				targetTarget.render(component);
			}
		}
	},
	scrollTo: (e: EventsType, selector: string | undefined, offset: number) => {
		// Scroll to element on page
		if (e) {
			e.preventDefault();
		}
		const anchor = {
			selector: selector,
			offset: offset ? offset : 0,
			position: () => {
				const anchorElement = anchor.selector && document.querySelector(anchor.selector) ? document.querySelector(anchor.selector) : false;
				return anchorElement ? anchorElement.getBoundingClientRect().top + window.scrollY - anchor.offset : 0 - anchor.offset;
			},
		};
		window.scroll({ top: anchor.position(), left: 0, behavior: 'smooth' });
	},
	setAttributes: (element: HTMLElement, attributes: ObjectStringType) => {
		// Set multiple attributes on an element
		for (const attribute in attributes) {
			element.setAttribute(attribute, attributes[attribute]);
		}
	},
	setId: (id: string) => {
		// Take id (typically from useId) and update it
		return id
			.slice(1, -1)
			.replace(/^\_|\_$/g, '')
			.replace(/\_/g, '-');
	},
	sort: (list: SortType[], type: string | number | boolean, field: string, direction: string) => {
		// Sort values in a list based on type, field, and direction
		list.sort((a, b) => {
			let sortedValue = 0;

			if (type == 'string' || type == 'boolean') {
				// Make sure booleans are strings
				const sortValueA = String(a[field]);
				const sortValueB = String(b[field]);

				// Sorting method for strings
				if (direction == 'asc') {
					sortedValue = sortValueA.localeCompare(sortValueB);
				}
				if (direction == 'desc') {
					sortedValue = sortValueB.localeCompare(sortValueA);
				}
			} else if (type == 'integer' && a?.amounts && b?.amounts) {
				const sortValueA = a.amounts[field];
				const sortValueB = b.amounts[field];

				// Sorting method for numbers
				if (direction == 'asc') {
					sortedValue = sortValueA - sortValueB;
				}
				if (direction == 'desc') {
					sortedValue = sortValueB - sortValueA;
				}
			}

			return sortedValue;
		});

		return list;
	},
	updateCampaign: (campaign: ContentCampaignType, campaigns: CampaignsType) => {
		// Update campaign details
		if (campaign && typeof campaign == 'object') {
			campaign.date = campaigns.current.date;
			campaign.links = campaigns.current.links;
		} else {
			campaign = false;
		}
		return campaign;
	},
	updateSupporting: (supporting: ContentSupportingType) => {
		// Update supporting details
		if (supporting) {
			supporting = utils.checkArray(supporting as ObjectPrimitiveType[]);
			supporting = utils.sort(supporting, 'integer', 'total_amount_raised', 'desc');
		} else {
			supporting = false;
		}
		return supporting;
	},
};

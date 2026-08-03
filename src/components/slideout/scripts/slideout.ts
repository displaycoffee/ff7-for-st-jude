// Selector for elements that can receive focus, used to trap Tab within an open slideout
const focusableSelector =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Track the element that opened each slideout, so focus can be restored to it on close
const openerElements = new WeakMap<HTMLElement, HTMLElement>();

// Track each slideout's Tab-trap handler, so it can be removed again on close
const trapHandlers = new WeakMap<HTMLElement, (e: KeyboardEvent) => void>();

// Exclude elements matched by focusableSelector that are hidden (e.g. a collapsed dropdown's content)
// and therefore not actually reachable via Tab, even though they match the selector
const isVisible = (el: HTMLElement) => {
	const style = getComputedStyle(el);
	return style.visibility !== 'hidden' && style.display !== 'none';
};

// Keep Tab / Shift + Tab cycling within the slideout menu while it's open
const trapFocus = (menu: HTMLElement, e: KeyboardEvent) => {
	if (e.key !== 'Tab') return;

	const focusable = Array.from(menu.querySelectorAll<HTMLElement>(focusableSelector)).filter(isVisible);
	if (focusable.length === 0) return;

	const first = focusable[0];
	const last = focusable[focusable.length - 1];

	if (e.shiftKey && document.activeElement === first) {
		e.preventDefault();
		last.focus();
	} else if (!e.shiftKey && document.activeElement === last) {
		e.preventDefault();
		first.focus();
	}
};

export const slideout = {
	config: {
		classes: {
			// Class variables for component
			activeBody: 'slideout-active-body',
			active: 'slideout-active',
			overlay: 'slideout-overlay',
			slideout: 'slideout',
			menu: 'slideout-menu',
		},
		values: {
			// Default values if props are not defined
			width: '350px',
			direction: 'left',
			vertical: '110%',
		},
	},
	get: {
		orientation: (direction: string) => {
			// Get orientation of slideout
			return direction === 'top' || direction === 'bottom' ? 'vertical' : 'horizontal';
		},
	},
	set: {
		body: (state: string) => {
			// Toggle slideout body class
			const classes = slideout.config.classes;
			const body = document.querySelector('body');
			if (body) {
				if (state === 'add') {
					body.classList.add(classes.activeBody);
				} else {
					body.classList.remove(classes.activeBody);
				}
			}
		},
		slideout: (element: HTMLElement, state: string) => {
			// Helper function to toggle slideout properties
			const config = slideout.config;
			const { classes, values } = config;
			const menu = element.querySelector(`.${classes.menu}`) as HTMLElement;

			if (menu && element?.dataset) {
				// Get data attributes
				const width = element.dataset.width;
				const direction = element.dataset.direction as string;
				const orientation = element.dataset.orientation;

				// Update elements depending on state
				if (state === 'add') {
					element.classList.add(classes.active);
					menu.style.setProperty(direction, '0');
					menu.inert = false;

					// Remember what had focus so it can be restored on close, then move focus into the menu
					const opener = document.activeElement as HTMLElement | null;
					if (opener) openerElements.set(element, opener);
					menu.querySelector<HTMLElement>('.slideout-close')?.focus();

					// Trap Tab/Shift+Tab within the menu while it's open
					const handleTrap = (e: KeyboardEvent) => trapFocus(menu, e);
					trapHandlers.set(menu, handleTrap);
					menu.addEventListener('keydown', handleTrap);
				} else {
					element.classList.remove(classes.active);
					menu.style.setProperty(direction, orientation === 'vertical' ? values.vertical : `-${width}`);
					menu.inert = true;

					// Remove the Tab trap and restore focus to whatever opened the menu
					const handleTrap = trapHandlers.get(menu);
					if (handleTrap) {
						menu.removeEventListener('keydown', handleTrap);
						trapHandlers.delete(menu);
					}
					openerElements.get(element)?.focus();
					openerElements.delete(element);
				}
			}
		},
	},
	toggle: (e: EventsType, id: string | boolean) => {
		e.preventDefault();
		const { config, set } = slideout;
		const classes = config.classes;
		const activeSelector = `.${classes.slideout}.${classes.active}`;

		// Reset active slideout menus
		document.querySelectorAll(activeSelector).forEach((active) => {
			const element = active as HTMLElement;
			set.slideout(element, 'remove');
		});

		// Perform actions for current slideout menu
		if (id) {
			const element = document.querySelector(`#${id}`) as HTMLElement;
			const elementState = !element.classList.contains(classes.active) ? 'add' : 'remove';
			set.slideout(element, elementState);
		}

		// Reset body classes
		// Note: using a slight timeout to ensure slideout actions have processed
		setTimeout(() => {
			const slideoutActiveElements = document.querySelectorAll(activeSelector);
			const bodyState = slideoutActiveElements.length !== 0 ? 'add' : 'remove';
			set.body(bodyState);
		}, 100);
	},
};

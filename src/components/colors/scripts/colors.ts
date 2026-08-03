// Selector for elements that can receive focus, used to trap Tab within the open panel
const focusableSelector =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Track the element that opened the panel, so focus can be restored to it on close
const openerElements = new WeakMap<HTMLElement, HTMLElement>();

// Track the panel's Tab-trap handler, so it can be removed again on close
const trapHandlers = new WeakMap<HTMLElement, (e: KeyboardEvent) => void>();

// Exclude elements matched by focusableSelector that are hidden and therefore not actually reachable via Tab
const isVisible = (el: HTMLElement) => {
	const style = getComputedStyle(el);
	return style.visibility !== 'hidden' && style.display !== 'none';
};

// Keep Tab / Shift + Tab cycling within the panel while it's open
const trapFocus = (panel: HTMLElement, e: KeyboardEvent) => {
	if (e.key !== 'Tab') return;

	const focusable = Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector)).filter(isVisible);
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

export const colors = {
	config: {
		id: 'colors',
		classes: {
			active: 'colors-active',
		},
	},
	toggle: (e: EventsType, action?: string) => {
		// Toggle active class on colors element
		e.preventDefault();
		const config = colors.config;
		const element = document.querySelector(`#${config.id}`) as HTMLElement;
		const isActive = element.classList.contains(config.classes.active);

		if (action == 'close' && isActive) {
			colors.close(element);
		} else if (action != 'close') {
			if (isActive) {
				colors.close(element);
			} else {
				colors.open(element);
			}
		}
	},
	open: (element: HTMLElement) => {
		const config = colors.config;
		element.classList.add(config.classes.active);

		// Remember what had focus so it can be restored on close, then move focus into the panel
		const opener = document.activeElement as HTMLElement | null;
		if (opener) openerElements.set(element, opener);
		element.querySelector<HTMLElement>('[aria-label="Close Colors Button"]')?.focus();

		// Trap Tab/Shift+Tab within the panel while it's open
		const handleTrap = (e: KeyboardEvent) => trapFocus(element, e);
		trapHandlers.set(element, handleTrap);
		element.addEventListener('keydown', handleTrap);
	},
	close: (element: HTMLElement) => {
		const config = colors.config;
		element.classList.remove(config.classes.active);

		// Remove the Tab trap and restore focus to whatever opened the panel
		const handleTrap = trapHandlers.get(element);
		if (handleTrap) {
			element.removeEventListener('keydown', handleTrap);
			trapHandlers.delete(element);
		}
		openerElements.get(element)?.focus();
		openerElements.delete(element);
	},
};

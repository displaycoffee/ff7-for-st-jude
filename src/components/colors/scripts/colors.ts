/* Scripts */
import { utils } from '../../../_config/scripts/utils';

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

		// Trap Tab/Shift+Tab within the panel while it's open, focusing the close button
		utils.focusTrap.activate(element, '[aria-label="Close Colors Button"]');
	},
	close: (element: HTMLElement) => {
		const config = colors.config;
		element.classList.remove(config.classes.active);

		// Remove the Tab trap and restore focus to whatever opened the panel
		utils.focusTrap.deactivate(element);
	},
};

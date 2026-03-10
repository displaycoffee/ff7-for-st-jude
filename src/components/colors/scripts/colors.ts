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

		if (action == 'close' && element.classList.contains(config.classes.active)) {
			element.classList.remove(config.classes.active);
		} else {
			if (element.classList.contains(config.classes.active)) {
				element.classList.remove(config.classes.active);
			} else {
				element.classList.add(config.classes.active);
			}
		}
	},
};

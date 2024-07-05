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
		orientation: (direction) => {
			// Get orientation of slideout
			return direction == 'top' || direction == 'bottom' ? 'vertical' : 'horizontal';
		},
	},
	set: {
		body: (state) => {
			// Toggle slideout body class
			const classes = slideout.config.classes;
			const body = document.querySelector('body');
			state == 'add' ? body.classList.add(classes.activeBody) : body.classList.remove(classes.activeBody);
		},
		slideout: (element, state) => {
			// Helper function to toggle slideout properties
			const config = slideout.config;
			const { classes, values } = config;
			const menu = element.querySelector(`.${classes.menu}`);

			// Get data attributes
			const width = element.dataset.width;
			const direction = element.dataset.direction;
			const orientation = element.dataset.orientation;

			// Update elements depending on state
			if (state == 'add') {
				element.classList.add(classes.active);
				menu.style[direction] = 0;
			} else {
				element.classList.remove(classes.active);
				menu.style[direction] = orientation == 'vertical' ? values.vertical : `-${width}`;
			}
		},
	},
	toggle: (e, id) => {
		e.preventDefault();
		const { config, set } = slideout;
		const classes = config.classes;
		const activeSelector = `.${classes.slideout}.${classes.active}`;

		// Reset active slideout menus
		document.querySelectorAll(activeSelector).forEach((element) => {
			set.slideout(element, 'remove');
		});

		// Perform actions for current slideout menu
		if (id) {
			const element = document.querySelector(`#${id}`);
			const elementState = !element.classList.contains(classes.active) ? 'add' : 'remove';
			set.slideout(element, elementState);
		}

		// Reset body classes
		// Note: using a slight timeout to ensure slideout actions have processed
		setTimeout(() => {
			const slideoutActiveElements = document.querySelectorAll(activeSelector);
			const bodyState = slideoutActiveElements && slideoutActiveElements.length !== 0 ? 'add' : 'remove';
			set.body(bodyState);
		}, 100);
	},
};

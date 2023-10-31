export const slideout = {
	config: {
		classes: {
			// Class variables for component
			activeBody: 'slideout-active-body',
			active: 'slideout-active',
			overlay: 'slideout-overlay',
			slideout: 'slideout',
			content: 'slideout-content',
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
		overlay: () => {
			// Create slideout overlay if not present and append to body
			const classes = slideout.config.classes;
			if (!document.querySelector(`.${classes.overlay}`)) {
				const overlay = document.createElement('div');
				overlay.setAttribute('class', classes.overlay);
				overlay.onclick = (e) => slideout.toggle(e, false);
				document.querySelector('body').appendChild(overlay);
			}
		},
		slideout: (element, state) => {
			// Helper function to toggle slideout properties
			const classes = slideout.config.classes;
			const content = element.querySelector(`.${classes.content}`);

			// Get data attributes
			const width = element.dataset.width;
			const direction = element.dataset.direction;
			const orientation = element.dataset.orientation;

			// Update elements depending on state
			if (state == 'add') {
				element.classList.add(classes.active);
				content.style[direction] = 0;
			} else {
				element.classList.remove(classes.active);
				content.style[direction] = orientation == 'vertical' ? config.values.vertical : `-${width}`;
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

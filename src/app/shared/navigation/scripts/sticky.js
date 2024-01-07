export const sticky = () => {
	const stickyConfig = {
		class: 'sticky',
		init: (options) => {
			if (document.querySelector(options.selector) && document.querySelector(options.anchor)) {
				stickyConfig.move(options);
			}
		},
		move: (options) => {
			// Set a sticky false state
			let stickyOnce = false;

			// Sticky elements
			const stickyElement = document.querySelector(options.selector);
			const anchorElement = document.querySelector(options.anchor);

			// Ensure certain options are set
			const offset = options.offset ? options.offset : 0;
			const y = options.y ? options.y : 'top';
			const position = options.position ? options.position : 0;

			// Positions for checking sticky
			const windowTop = window.scrollY;
			const anchorTop = anchorElement.getBoundingClientRect().top - offset;

			// If the window position is greater than the selector...
			if (!stickyOnce && windowTop > anchorTop) {
				// Add sticky class
				stickyElement.classList.add(stickyConfig.class);
				stickyElement.setAttribute('style', `position: fixed; ${y}: ${position}px; z-index: 9999;`);

				// After everything has been done, set sticky to true so it doesn't run again on scroll
				stickyOnce = true;
			} else {
				// Remove sticky class
				stickyElement.classList.remove(stickyConfig.class);
				stickyElement.removeAttribute('style');

				// Then set sticky to false again so we can start over
				stickyOnce = false;
			}
		},
	};

	// Set up config for navigation
	const stickyNavigationOptions = {
		selector: '.navigation-header',
		anchor: 'main.main',
		y: 'top', // top or bottom
		position: 0,
		offset: 0,
	};

	// Init function on load and on window scroll
	stickyConfig.init(stickyNavigationOptions);
	window.onscroll = () => {
		stickyConfig.init(stickyNavigationOptions);
	};
};

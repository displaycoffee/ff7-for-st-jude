export const sticky = () => {
	const stickyConfig = {
		class: 'sticky',
		init: (options) => {
			if (document.querySelector(options.selector) && document.querySelector(options.anchor)) {
				stickyConfig.move(options);
			}
		},
		move: (options) => {
			// set a sticky false state
			let stickyOnce = false;

			// sticky elements
			const stickyElement = document.querySelector(options.selector);
			const anchorElement = document.querySelector(options.anchor);

			// ensure certain options are set
			const offset = options.offset ? options.offset : 0;
			const y = options.y ? options.y : 'top';
			const position = options.position ? options.position : 0;

			// positions for checking sticky
			const windowTop = window.scrollY;
			const anchorTop = anchorElement.getBoundingClientRect().top - offset;

			// if the window position is greater than the selector...
			if (!stickyOnce && windowTop > anchorTop) {
				// add sticky class
				stickyElement.classList.add(stickyConfig.class);
				stickyElement.setAttribute('style', `position: fixed; ${y}: ${position}px; z-index: 9999;`);

				// after everything has been done, set sticky to true so it doesn't run again on scroll
				stickyOnce = true;
			} else {
				// remove sticky class
				stickyElement.classList.remove(stickyConfig.class);
				stickyElement.removeAttribute('style');

				// then set sticky to false again so we can start over
				stickyOnce = false;
			}
		},
	};

	// set up config for navigation
	const stickyNavigationOptions = {
		selector: '.navigation-header',
		anchor: 'main.main',
		y: 'top', // top or bottom
		position: 0,
		offset: 0,
	};

	// init function on load and on window scroll
	stickyConfig.init(stickyNavigationOptions);
	window.onscroll = () => {
		stickyConfig.init(stickyNavigationOptions);
	};
};

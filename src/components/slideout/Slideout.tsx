/* Styles */
import './styles/slideout.scss';

/* Packages */
import { createRef, RefObject, useEffect, useRef } from 'react';

/* Scripts */
import { useFormattedId } from '../../_config/scripts/hooks';
import { useAppContext } from '../../context/scripts/context-hooks';
import { SlideoutOverlayProps, SlideoutProps, SlideoutTouchType, SlideoutTouchRefType, SlideoutOverlayRefType } from './scripts/slideout-types';
import { slideout } from './scripts/slideout';

export const Slideout = (props: SlideoutProps) => {
	const { children, options } = props;
	const { utils } = useAppContext();
	const { config, get, toggle } = slideout;
	const fallbackId = useFormattedId();
	const id = `slideout-${options?.id ?? fallbackId}`;
	const title = `${id}-title`;
	const ref: RefObject<HTMLDivElement | null> = createRef();

	// Get default attributes for slideout
	const width = options?.width ?? config.values.width;
	const direction = options?.direction ?? config.values.direction;
	const orientation = slideout.get.orientation(direction);
	const styles = get.styles(direction, width);

	// Create shared slideout button
	const slideoutButton = (
		<div className="slideout-button-fixed gradient-section">
			<button className="slideout-button unstyled pointer a" type="button" onClick={(e) => toggle(e, id)}>
				{options.label} &gt;
			</button>
		</div>
	);

	// Set button properties
	const button = typeof options?.button === 'object' ? options.button : { outside: false, show: true };

	// Track touch start position to detect a swipe that closes the slideout
	const touchStart = useRef<SlideoutTouchRefType>(null);
	const swipeThreshold = 50; // minimum distance (px) to count as a swipe
	const isNegativeDirection = direction === 'top' || direction === 'left';

	// Touch start function for swipe on mobile
	const handleTouchStart = (e: SlideoutTouchType) => {
		const touch = e.touches[0];
		touchStart.current = { x: touch.clientX, y: touch.clientY };
	};

	// Touch end function for swipe on mobile
	const handleTouchEnd = (e: SlideoutTouchType) => {
		if (!touchStart.current) return;

		// Set delta coordinates
		const touch = e.changedTouches[0];
		const deltaX = touch.clientX - touchStart.current.x;
		const deltaY = touch.clientY - touchStart.current.y;
		touchStart.current = null;

		// Use whichever axis matches the direction the slideout enters / exits along
		const delta = orientation === 'vertical' ? deltaY : deltaX;
		const crossDelta = orientation === 'vertical' ? deltaX : deltaY;

		// Ignore short drags and swipes that lean more on the cross axis (e.g. scrolling the nav list)
		if (Math.abs(delta) < swipeThreshold || Math.abs(delta) < Math.abs(crossDelta)) return;

		// Only close when swiping toward the edge the slideout exits through
		const isClosingSwipe = isNegativeDirection ? delta < 0 : delta > 0;
		if (isClosingSwipe) toggle(e, false);
	};

	// Set sticky class on slideout
	useEffect(() => {
		utils.isSticky(ref?.current, 'is-sticky');
	}, [utils, ref]);

	return button.outside && button.show ? (
		slideoutButton
	) : (
		<div
			id={id}
			className={`${config.classes.slideout} slideout-${orientation} slideout-${direction}`}
			data-width={width}
			data-direction={direction}
			data-orientation={orientation}
			ref={ref}
		>
			{!button.outside && button.show ? slideoutButton : null}

			<div
				className={`${config.classes.content} gradient-background`}
				style={styles}
				inert
				role="dialog"
				aria-modal="true"
				aria-labelledby={title}
				onTouchStart={handleTouchStart}
				onTouchEnd={handleTouchEnd}
			>
				<header className="slideout-header flex-nowrap flex-align-items-center">
					<h2 id={title} className="slideout-title">
						{options.label}
					</h2>

					<button
						className="slideout-close pointer unstyled"
						type="button"
						aria-label="Slideout Close Button"
						onClick={(e) => toggle(e, false)}
					>
						x
					</button>
				</header>

				<div className="slideout-scrollbar scrollbar">
					<div
						className="slideout-body"
						onClick={(e) => {
							const eventElement = e.target as HTMLElement;

							// Close slideout content if inner nav button is clicked on
							if (eventElement) {
								const elementName = eventElement?.nodeName?.toLowerCase() ?? '';
								if (elementName === 'a' || (elementName === 'button' && eventElement.classList.contains('a'))) {
									setTimeout(() => {
										toggle(e, false);
									});
								}
							}
						}}
						role="presentation"
					>
						{children}
					</div>
				</div>
			</div>
		</div>
	);
};

export const SlideoutOverlay = (props: SlideoutOverlayProps) => {
	const { options } = props;
	const { utils } = useAppContext();
	const { config, set, toggle } = slideout;
	const elementRef: SlideoutOverlayRefType = useRef(null);

	// Create overlay element and append to body on mount, remove on unmount
	useEffect(() => {
		const slideoutTarget = document.querySelector('body');
		if (!slideoutTarget) return;

		// Create overlay
		const overlay = document.createElement('div');

		// Set attributes
		utils.setAttributes(overlay, {
			class: 'slideout-overlay pointer',
			role: 'presentation',
		});

		// Add onclick
		overlay.onclick = (e) => toggle(e, false);

		// Set children and ref
		slideoutTarget.appendChild(overlay);
		elementRef.current = overlay;

		return () => {
			overlay.remove();
			elementRef.current = null;
		};
	}, [utils, toggle]);

	// If we are on desktop and a slideout is active, fully close it (content state, focus trap, focus restore, overlay)
	useEffect(() => {
		if (!options.isDesktop) return;

		// Get active selector and elements
		const activeSelector = `.${config.classes.slideout}.${config.classes.active}`;
		const activeElements = document.querySelectorAll<HTMLElement>(activeSelector);

		// Close any active elements
		activeElements.forEach((element) => {
			set.slideout(element, 'remove');
		});

		// Remove active slideout class from body
		set.body('remove');
	}, [config, options.isDesktop, set]);

	// Close active slideout(s) when escape is pressed
	// Note: set.slideout already restores focus to whatever opened the content
	useEffect(() => {
		const activeSelector = `.${config.classes.slideout}.${config.classes.active}`;

		// Function for keydown events
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key !== 'Escape') return;
			if (document.querySelectorAll(activeSelector).length === 0) return;
			toggle(e, false);
		};

		// Add and remove event listeners
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [config, toggle]);

	return null;
};

/* Styles */
import './styles/slideout.scss';

/* Packages */
import { createRef, RefObject, useEffect, useRef, useState } from 'react';

/* Scripts */
import { useFormattedId } from '../../_config/scripts/hooks';
import { useAppContext } from '../../context/scripts/context-hooks';
import { SlideoutOverlayProps, SlideoutProps, SlideoutTouchType, SlideoutTouchRefType, SlideoutOverlayRefType } from './scripts/slideout-types';
import { slideout } from './scripts/slideout';

/* Components */
import { Button } from '../forms/Forms';

export const Slideout = (props: SlideoutProps) => {
	const { children, options } = props;
	const { utils } = useAppContext();
	const { config, get, toggle } = slideout;
	const fallbackId = useFormattedId();
	const id = `slideout-${options?.id ?? fallbackId}`;
	const title = `${id}-title`;
	const ref: RefObject<HTMLDivElement | null> = createRef();
	const [isActive, setIsActive] = useState(false);

	// Get default attributes for slideout
	const width = options?.width ?? config.values.width;
	const direction = options?.direction ?? config.values.direction;
	const orientation = slideout.get.orientation(direction);
	const styles = get.styles(direction, width);

	// Create shared slideout button
	const slideoutButton = (
		<div className="slideout-button-fixed gradient-section">
			<Button
				className="slideout-button"
				label={`${options.label} >`}
				onClick={(e) => toggle(e, id)}
				variant="link"
				aria-expanded={isActive}
				aria-label={`Open ${options.label}`}
			/>
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

	// Track active state for aria-expanded
	// Note: looked up by id (not ref) since toggle() mutates classList directly, and the button can render
	// separately from the slideout element when options.button.outside is true (a different Slideout instance
	// renders the element with this id) — watch the document for it to mount rather than assuming it's already there
	useEffect(() => {
		let classObserver: MutationObserver | null = null;

		// Start tracking the slideout element's active class once it's found
		const trackElement = (element: HTMLElement) => {
			const updateActiveState = () => setIsActive(element.classList.contains(config.classes.active));
			updateActiveState();

			classObserver = new MutationObserver(updateActiveState);
			classObserver.observe(element, { attributes: true, attributeFilter: ['class'] });
		};

		const existingElement = document.getElementById(id);
		if (existingElement) {
			trackElement(existingElement);
			return () => classObserver?.disconnect();
		}

		// Element isn't mounted yet — watch the document for it to appear
		const bodyObserver = new MutationObserver(() => {
			const element = document.getElementById(id);
			if (!element) return;
			bodyObserver.disconnect();
			trackElement(element);
		});
		bodyObserver.observe(document.body, { childList: true, subtree: true });

		return () => {
			bodyObserver.disconnect();
			classObserver?.disconnect();
		};
	}, [id, config.classes.active]);

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

					<Button
						className="slideout-close"
						hideLabel={true}
						label="Slideout Close Button"
						onClick={(e) => toggle(e, false)}
						variant="unstyled"
					>
						x
					</Button>
				</header>

				<div className="slideout-scrollbar scrollbar">
					<div
						className="slideout-body"
						onClick={(e) => {
							const eventElement = (e.target as HTMLElement)?.closest('a, button.a');

							// Close slideout content if inner nav button is clicked on
							if (eventElement) {
								setTimeout(() => {
									toggle(e, false);
								});
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

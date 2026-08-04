/* Styles */
import './styles/slideout.scss';

/* Packages */
import { createRef, RefObject, useEffect, useRef } from 'react';

/* Scripts */
import { useFormattedId } from '../../_config/scripts/hooks';
import { useAppContext } from '../../context/scripts/context-hooks';
import { SlideoutOverlayProps, SlideoutProps } from './scripts/slideout-types';
import { slideout } from './scripts/slideout';

export const Slideout = (props: SlideoutProps) => {
	const { children, options } = props;
	const { utils } = useAppContext();
	const { config, get, toggle } = slideout;
	const fallbackId = useFormattedId();
	const slideoutId = `slideout-${options?.id ?? fallbackId}`;
	const slideoutTitle = `${slideoutId}-title`;
	const slideoutRef: RefObject<HTMLDivElement | null> = createRef();

	// Get default attributes for slideout
	const width = options?.width ?? config.values.width;
	const direction = options?.direction ?? config.values.direction;
	const orientation = get.orientation(direction);
	const styles = {
		width: width,
		transition: `${direction} 0.5s ease-in-out`,
		[direction]: orientation === 'vertical' ? config.values.vertical : `-${width}`,
	};

	// Create shared slideout button
	const slideoutButton = (
		<div className="slideout-button-fixed gradient-section">
			<button className="slideout-button unstyled pointer a" type="button" aria-label="Slideout Button" onClick={(e) => toggle(e, slideoutId)}>
				{options.label} &gt;
			</button>
		</div>
	);

	// Set button properties
	const button = typeof options?.button === 'object' ? options.button : { outside: false, show: true };

	// Set sticky class on slideout
	useEffect(() => {
		utils.isSticky(slideoutRef?.current, 'is-sticky');
	}, [utils, slideoutRef]);

	return button.outside && button.show ? (
		slideoutButton
	) : (
		<div
			id={slideoutId}
			className={`${config.classes.slideout} slideout-${orientation}`}
			data-width={width}
			data-direction={direction}
			data-orientation={orientation}
			ref={slideoutRef}
		>
			{!button.outside && button.show ? slideoutButton : null}

			<div
				className={`${config.classes.menu} gradient-background`}
				style={styles}
				inert
				role="dialog"
				aria-modal="true"
				aria-labelledby={slideoutTitle}
			>
				<header className="slideout-header flex-nowrap flex-align-items-center">
					<h2 id={slideoutTitle} className="slideout-title">
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
						className="slideout-content"
						onClick={(e) => {
							const eventNode = e.target as Node;

							// Close slideout menu if inner link is clicked on
							if (eventNode?.nodeName) {
								if (eventNode.nodeName.toLowerCase() === 'a') {
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
	const elementRef: RefObject<HTMLDivElement | null> = useRef(null);

	// Create overlay element and append to body on mount, remove on unmount
	useEffect(() => {
		const slideoutTarget = document.querySelector('body');
		if (!slideoutTarget) return;

		const overlay = document.createElement('div');
		utils.setAttributes(overlay, {
			class: 'slideout-overlay pointer',
			role: 'presentation',
		});
		overlay.onclick = (e) => toggle(e, false);
		slideoutTarget.appendChild(overlay);
		elementRef.current = overlay;

		return () => {
			overlay.remove();
			elementRef.current = null;
		};
	}, [utils, toggle]);

	// If we are on desktop and a slideout is active, fully close it (menu state, focus trap, focus restore, overlay)
	useEffect(() => {
		if (!options.isDesktop) return;

		const activeSelector = `.${config.classes.slideout}.${config.classes.active}`;
		const activeElements = document.querySelectorAll<HTMLElement>(activeSelector);

		activeElements.forEach((element) => {
			set.slideout(element, 'remove');
		});

		if (activeElements.length !== 0) {
			set.body('remove');
		}
	}, [config, options.isDesktop, set]);

	// Close active slideout(s) when escape is pressed
	// Note: set.slideout already restores focus to whatever opened the menu
	useEffect(() => {
		const activeSelector = `.${config.classes.slideout}.${config.classes.active}`;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key !== 'Escape') return;
			if (document.querySelectorAll(activeSelector).length === 0) return;
			toggle(e, false);
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [config, toggle]);

	return null;
};

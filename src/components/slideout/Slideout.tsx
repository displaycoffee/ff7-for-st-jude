/* React */
import { createRef, RefObject, useContext, useEffect, useRef } from 'react';

/* Local styles */
import './styles/slideout.scss';

/* Local scripts */
import { useFormattedId } from '../../_config/scripts/hooks';
import { SlideoutOverlayProps, SlideoutProps } from './scripts/slideout-types';
import { slideout } from './scripts/slideout';

/* Local components */
import { Context } from '../../context/Context';

export const Slideout = (props: SlideoutProps) => {
	let { options } = props;
	const context = useContext(Context);
	const { config, get, toggle } = slideout;
	const fallbackId = useFormattedId();
	const slideoutId = `slideout-${options?.id ? options.id : fallbackId}`;
	const slideoutRef: RefObject<HTMLDivElement | null> = createRef();

	// Get default attributes for slideout
	const width = options?.width ? options.width : config.values.width;
	const direction = options?.direction ? options.direction : config.values.direction;
	const orientation = get.orientation(direction);
	const styles = {
		width: width,
		transition: `${direction} 0.5s ease-in-out`,
		[direction]: orientation == 'vertical' ? config.values.vertical : `-${width}`,
	};

	// Create shared slideout button
	const slideoutButton = (
		<div className="slideout-button-fixed gradient-section">
			<button className="slideout-button unstyled pointer a" type="button" onClick={(e) => toggle(e, slideoutId)}>
				{options.label} &gt;
			</button>
		</div>
	);

	// Set button properties
	const button = typeof options?.button == 'object' ? options.button : { outside: false, show: true };

	// Set sticky class on slideout
	useEffect(() => {
		context.utils.isSticky(slideoutRef?.current, 'is-sticky');
	}, []);

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

			<div className={`${config.classes.menu} gradient-background`} style={styles}>
				<header className="slideout-header flex-nowrap flex-align-items-center">
					<h2 className="slideout-title">{options.label}</h2>

					<button className="slideout-close pointer unstyled" type="button" onClick={(e) => toggle(e, false)}>
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
								if (eventNode.nodeName.toLowerCase() == 'a') {
									setTimeout(() => {
										toggle(e, false);
									});
								}
							}
						}}
						role="presentation"
					>
						{options?.content ? options?.content : null}
					</div>
				</div>
			</div>
		</div>
	);
};

export const SlideoutOverlay = (props: SlideoutOverlayProps) => {
	const { options } = props;
	const context = useContext(Context);
	const { config, set, toggle } = slideout;

	// Get slideout target and create element reference
	const slideoutTarget = useRef(document.querySelector('body')).current;
	const elementRef: RefObject<HTMLDivElement | null> = useRef(null);

	// If there is no target, don't return anything
	if (!slideoutTarget) return null;

	// Create element reference to inject slideout overlay
	if (!elementRef.current) {
		elementRef.current = document.createElement('div');
		context.utils.setAttributes(elementRef.current, {
			class: 'slideout-overlay pointer',
			role: 'presentation',
		});
		elementRef.current.onclick = (e) => toggle(e, false);
		slideoutTarget.appendChild(elementRef.current);
	}

	// If we are on desktop and slideout is active, remove body classes to hide overlay
	const body = document.querySelector('body');
	if (body && body.classList.contains(config.classes.activeBody) && options.isDesktop) {
		set.body('remove');
	}
};

/* React */
import { useId, useEffect, useContext, useRef } from 'react';

/* Local styles */
import './styles/slideout.scss';

/* Local scripts */
import { slideout } from './scripts/slideout';

/* Local components */
import { Context } from '../../entry/context/Context';

export const Slideout = (props) => {
	let { id, width, direction, label, content } = props;
	const context = useContext(Context);
	const { config, get, toggle } = slideout;
	const fallbackId = useId().replace(/:/g, '');
	const slideoutId = `slideout-${id ? id : fallbackId}`;

	// Get default attributes for slideout
	width = width ? width : config.values.width;
	direction = direction ? direction : config.values.direction;
	const orientation = get.orientation(direction);
	const styles = {
		width: width,
		transition: `${direction} 0.5s ease-in-out`,
		[direction]: orientation == 'vertical' ? config.values.vertical : `-${width}`,
	};

	useEffect(() => {
		context.utils.isSticky(document.querySelector(`#${slideoutId}`), 'is-sticky');
	}, []);

	return (
		<div
			id={slideoutId}
			className={`${config.classes.slideout} slideout-${orientation}`}
			data-width={width}
			data-direction={direction}
			data-orientation={orientation}
		>
			<div className="slideout-button-fixed">
				<button className="slideout-button pointer unstyled a" type="button" onClick={(e) => toggle(e, slideoutId)}>
					{label} &gt;
				</button>
			</div>

			<div className={`${config.classes.menu} blue-background`} style={styles}>
				<header className="slideout-header flex-nowrap flex-align-items-center">
					<h3 className="slideout-title">{label}</h3>

					<button className="slideout-close pointer unstyled" type="button" onClick={(e) => toggle(e, false)}>
						x
					</button>
				</header>

				<div className="slideout-scrollbar scrollbar">
					<div
						className="slideout-content"
						onClick={(e) => {
							// Close slideout menu if inner element is a link or button
							if (e?.target?.nodeName) {
								const nodeLower = e.target.nodeName.toLowerCase();
								if (nodeLower == 'a' || nodeLower == 'button') {
									setTimeout(() => {
										toggle(e, false);
									});
								}
							}
						}}
						role="button"
						tabIndex={0}
						aria-hidden="true"
					>
						{content ? content : null}
					</div>
				</div>
			</div>
		</div>
	);
};

export const SlideoutOverlay = (props) => {
	const { isDesktop } = props;
	const context = useContext(Context);
	const { config, set, toggle } = slideout;

	// Get slideout target and create element reference
	const slideoutTarget = useRef(document.querySelector('body')).current;
	const elementRef = useRef(false);

	// If there is no target, don't return anything
	if (!slideoutTarget) return null;

	// Create element reference to inject slideout overlay
	if (!elementRef.current) {
		elementRef.current = document.createElement('div');
		context.utils.setAttributes(elementRef.current, {
			class: 'slideout-overlay',
			role: 'button',
			tabindex: 0,
			'aria-hdden': true,
		});
		elementRef.current.onclick = (e) => toggle(e, false);
		slideoutTarget.appendChild(elementRef.current);
	}

	// If we are no desktop and slideout is active, remove body classes to hide overlay
	const body = document.querySelector('body');
	if (body && body.classList.contains(config.classes.activeBody) && isDesktop) {
		set.body('remove');
	}
};

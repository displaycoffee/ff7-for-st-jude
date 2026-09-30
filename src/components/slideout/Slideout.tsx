/* Styles */
import './styles/slideout.scss';

/* Packages */
import { useEffect, useRef, useState } from 'react';

/* Scripts */
import type { SlideoutProps, SlideoutTouchType, SlideoutTouchRefType } from './scripts/slideout-types';
import { useFormattedId } from '../../_core/scripts/hooks';
import { useAppContext } from '../../context/scripts/context-hooks';
import { slideout } from './scripts/slideout';

/* Components */
import { Button } from '../forms/Forms';
import { Overlay } from '../overlay/Overlay';

export const Slideout = (props: SlideoutProps) => {
	const { children, options } = props;
	const { utils } = useAppContext();
	const { config, get } = slideout;
	const fallbackId = useFormattedId();
	const id = `slideout-${options?.id ?? fallbackId}`;
	const title = `${id}-title`;
	const buttonRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(false);

	// Get default attributes for slideout
	const width = options?.width ?? config.values.width;
	const direction = options?.direction ?? config.values.direction;
	const orientation = get.orientation(direction);

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
		if (isClosingSwipe) setIsOpen(false);
	};

	// Set sticky class on slideout button
	useEffect(() => utils.isSticky(buttonRef.current, 'is-sticky'), [utils]);

	return (
		<>
			<div className="slideout-button-container" ref={buttonRef}>
				<div className="slideout-button-fixed gradient-section">
					<Button
						className={'slideout-button'}
						label={`${options.label} >`}
						onClick={() => setIsOpen(true)}
						variant={'link'}
						aria-controls={id}
						aria-expanded={isOpen}
						aria-haspopup={'dialog'}
						aria-label={`Open ${options.label}`}
					/>
				</div>
			</div>

			<Overlay
				id={id}
				className={`slideout gradient-background slideout-${orientation} slideout-${direction}`}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				aria-labelledby={title}
				style={{ width }}
				onTouchStart={handleTouchStart}
				onTouchEnd={handleTouchEnd}
			>
				<header className="slideout-header flex-nowrap flex-align-items-center">
					<h2 id={title} className="slideout-title">
						{options.label}
					</h2>

					<Button
						className={'slideout-close'}
						hideLabel={true}
						label={'Slideout Close Button'}
						onClick={() => setIsOpen(false)}
						variant={'unstyled'}
						data-autofocus
					>
						x
					</Button>
				</header>

				<div className="slideout-scrollbar scrollbar">
					<div
						className="slideout-body"
						onClick={(e) => {
							// Close slideout if an inner link or link-style button is clicked on
							if ((e.target as HTMLElement)?.closest('a, button.a')) setIsOpen(false);
						}}
						role="presentation"
					>
						{children}
					</div>
				</div>
			</Overlay>
		</>
	);
};

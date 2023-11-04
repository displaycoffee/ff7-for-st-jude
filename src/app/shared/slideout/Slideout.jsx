/* React */
import { useId } from 'react';

/* Local styles */
import './styles/slideout.scss';

/* Local scripts */
import { slideout } from './scripts/slideout';

// Create slideout overlay outside component so this happens once always
slideout.set.overlay();

export const Slideout = (props) => {
	let { id, width, direction, label, content, closeOnClick } = props;
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

	return (
		<div
			id={slideoutId}
			className={`${config.classes.slideout} slideout-${orientation}`}
			data-width={width}
			data-direction={direction}
			data-orientation={orientation}
		>
			<button className="slideout-button pointer unstyled a" type="button" onClick={(e) => toggle(e, slideoutId)}>
				{label} &gt;
			</button>

			<div
				className={`${config.classes.content} blue-background`}
				style={styles}
				onClick={(e) => e.stopPropagation()}
				role="button"
				tabIndex={0}
				aria-hidden="true"
			>
				<header className="slideout-header flex-nowrap flex-align-items-center">
					<h3 className="slideout-title">{label}</h3>

					<button className="slideout-close pointer unstyled" type="button" onClick={(e) => toggle(e, false)}>
						x
					</button>
				</header>

				<div
					className="slideout-scrollbar scrollbar"
					onClick={(e) => {
						if (closeOnClick) {
							toggle(e, false);
						} else {
							return false;
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
	);
};

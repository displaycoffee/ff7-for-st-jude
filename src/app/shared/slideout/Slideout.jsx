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
	const slideoutId = `slideout-${id ? id : useId().replace(/\:/g, '')}`;

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
			<button className="slideout-button flex-nowrap flex-align-items-center" type="button" onClick={(e) => toggle(e, slideoutId)}>
				<span className="icon-wrapper icon-wrapper-large">
					<svg className="icon icon-equalizer">
						<use xlinkHref="#icon-equalizer"></use>
					</svg>
				</span>{' '}
				{label}
			</button>

			<div className={config.classes.content} style={styles} onClick={(e) => e.stopPropagation()}>
				<header className="slideout-header flex-nowrap flex-align-items-center">
					<h3 className="slideout-title">{label}</h3>

					<button className="slideout-close" type="button" onClick={(e) => toggle(e, false)}>
						<span className="icon-wrapper">
							<svg className="icon icon-close-thin">
								<use xlinkHref="#icon-close-thin"></use>
							</svg>
						</span>
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
				>
					{content ? content : null}
				</div>
			</div>
		</div>
	);
};

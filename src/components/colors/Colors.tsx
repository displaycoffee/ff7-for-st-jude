/* Styles */
import './styles/colors.scss';

/* Packages */
import { useState } from 'react';

/* Scripts */
import { useAppContext } from '../../context/scripts/context-hooks';
import { ColorsProps, ColorsFieldProps } from './scripts/color-types';
import { colors as colorsUtils } from './scripts/colors';

export const Colors = (props: ColorsProps) => {
	const { showButton } = props;
	const { theme } = useAppContext();

	// Default color and style rules
	const defaultColors = {
		color01: theme.colors.color06,
		color02: theme.colors.color06,
		color03: theme.colors.color07,
		color04: theme.colors.color07,
	};
	const defaultStyles = `.gradient-section, .gradient-background {
		background-color: ${defaultColors.color01};
		background-image: linear-gradient(160deg, ${defaultColors.color01} 35%, ${defaultColors.color03});
	}`;

	// Colors and gradient rules
	const [colors, setColors] = useState(defaultColors);
	const [styles, setStyles] = useState(defaultStyles);

	// Function to handle color and gradient change
	const changeColors = (action: string, color01?: string, color02?: string, color03?: string, color04?: string) => {
		if (action == 'submit' && color01 && color02 && color03 && color04) {
			// Check if colors have changed
			const color01Changed = defaultColors.color01 != color01;
			const color02Changed = defaultColors.color02 != color02;
			const color03Changed = defaultColors.color03 != color03;
			const color04Changed = defaultColors.color04 != color04;

			// Add new colors and styles
			if (color01Changed || color02Changed || color03Changed || color04Changed) {
				setColors({
					color01: color01,
					color02: color02,
					color03: color03,
					color04: color04,
				});
				setStyles(`.gradient-section, .gradient-background {
					background-color: ${colors.color01};
					background-image: linear-gradient(160deg, ${colors.color01} 20%, ${colors.color02} 40%, ${colors.color03} 60%, ${colors.color04});
				}`);
			}
		} else {
			// Reset colors
			setColors(defaultColors);
			setStyles(defaultStyles);
		}
	};

	return showButton ? (
		<button className="colors-buttons unstyled a" type="button" aria-label="Window Color Button" onClick={(e) => colorsUtils.toggle(e)}>
			Window Color
		</button>
	) : (
		<>
			<style className="colors-styles">{styles}</style>

			<div id={colorsUtils.config.id} className="colors flex-wrap flex-align-items-center flex-justify-content-center">
				<div className="colors-container container">
					<form
						className="colors-form gradient-section"
						onSubmit={(e) => {
							e.preventDefault();
							const formData = new FormData(e.target);

							// Set new colors and gradient
							changeColors(
								'submit',
								formData.get('color01') as string,
								formData.get('color02') as string,
								formData.get('color03') as string,
								formData.get('color04') as string,
							);
						}}
						onReset={() => changeColors('reset')}
					>
						<ColorsField colors={colors} id={1} label={'Upper left corner'} setColors={setColors} />

						<ColorsField colors={colors} id={2} label={'Upper right corner'} setColors={setColors} />

						<ColorsField colors={colors} id={3} label={'Bottom left corner'} setColors={setColors} />

						<ColorsField colors={colors} id={4} label={'Bottom right corner'} setColors={setColors} />

						<div className="colors-actions row row-nowrap row-align-items-center row-fit row-spacing-10">
							<div className="column column-button">
								<button className="colors-buttons unstyled a" type="submit" aria-label="Change Colors Button">
									Change
								</button>
							</div>
							<div className="column column-button">
								<button className="colors-buttons unstyled a" type="reset" aria-label="Reset Colors Button">
									Reset
								</button>
							</div>
							<div className="column column-button">
								<button
									className="colors-buttons unstyled a"
									onClick={(e) => colorsUtils.toggle(e, 'close')}
									aria-label="Close Colors Button"
								>
									x Close
								</button>
							</div>
						</div>
					</form>
				</div>

				<div className="colors-overlay pointer" role="presentation" onClick={(e) => colorsUtils.toggle(e, 'close')}></div>
			</div>
		</>
	);
};

export const ColorsField = (props: ColorsFieldProps) => {
	const { colors, id, label, setColors } = props;
	const colorId = `color0${id}`;

	return (
		<div className="colors-picker row row-nowrap row-align-items-center row-fit row-spacing-10">
			<div className="column column-label">
				<label htmlFor={colorId}>{label}</label>
			</div>
			<div className="column column-input">
				<input
					type="color"
					id={colorId}
					className="pointer"
					name={colorId}
					value={colors[colorId] as string}
					onChange={(e) => {
						setColors({ ...colors, [`${colorId}`]: e.target.value });
					}}
				/>
			</div>
		</div>
	);
};

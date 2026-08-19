/* Styles */
import './styles/colors.scss';

/* Packages */
import { useEffect, useState } from 'react';

/* Scripts */
import { useAppContext } from '../../context/scripts/context-hooks';
import { ColorsProps } from './scripts/color-types';
import { colors as colorsUtils } from './scripts/colors';

/* Components */
import { Button, Form, FormActions, Input } from '../forms/Forms';

export const Colors = (props: ColorsProps) => {
	const { showButton } = props;
	const { theme } = useAppContext();

	// Close the panel when Escape is pressed
	// Note: colorsUtils.close already restores focus to whatever opened the panel
	useEffect(() => {
		if (showButton) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key !== 'Escape') return;
			const element = document.querySelector<HTMLElement>(`#${colorsUtils.config.id}`);
			if (!element?.classList.contains(colorsUtils.config.classes.active)) return;
			colorsUtils.close(element);
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [showButton]);

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
					background-color: ${color01};
					background-image: linear-gradient(160deg, ${color01} 20%, ${color02} 40%, ${color03} 60%, ${color04});
				}`);
			}
		} else {
			// Reset colors
			setColors(defaultColors);
			setStyles(defaultStyles);
		}
	};

	return showButton ? (
		<Button
			className="colors-buttons"
			label="Window Color"
			variant="link"
			aria-label="Window Color Button"
			onClick={(e) => colorsUtils.toggle(e)}
		/>
	) : (
		<>
			<style className="colors-styles">{styles}</style>

			<div
				id={colorsUtils.config.id}
				className="colors flex-wrap flex-align-items-center flex-justify-content-center"
				role="dialog"
				aria-modal="true"
				aria-labelledby="colors-title"
			>
				<div className="colors-container container">
					<h2 id="colors-title">Window Color</h2>

					<Form
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
						{Object.entries(colors).map(([color, colorValue]) => {
							// Crate label for input
							const vertical = color == 'color01' || color == 'color02' ? 'Upper' : 'Bottom';
							const horizontal = color == 'color01' || color == 'color03' ? 'left' : 'right';

							return (
								<Input
									id={color}
									className={'pointer'}
									label={`${vertical} ${horizontal} corner`}
									type={'color'}
									value={colorValue as string}
									onChange={(e) => {
										setColors({ ...colors, [color]: e.target.value });
									}}
									key={color}
								/>
							);
						})}

						<FormActions className="colors-actions">
							<Button className="colors-buttons" label="Change" variant="link" type="submit" aria-label="Change Colors Button" />

							<Button className="colors-buttons" label="Reset" variant="link" type="reset" aria-label="Reset Colors Button" />

							<Button
								className="colors-buttons"
								label="x Close"
								variant="link"
								aria-label="Close Colors Button"
								onClick={(e) => colorsUtils.toggle(e, 'close')}
							/>
						</FormActions>
					</Form>
				</div>

				<div className="colors-overlay pointer" role="presentation" onClick={(e) => colorsUtils.toggle(e, 'close')}></div>
			</div>
		</>
	);
};

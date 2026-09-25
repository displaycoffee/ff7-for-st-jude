/* Styles */
import './styles/colors.scss';

/* Packages */
import { useState } from 'react';

/* Scripts */
import type { ColorsProps } from './scripts/color-types';
import { useAppContext } from '../../context/scripts/context-hooks';
import { colors as colorsUtils } from './scripts/colors';

/* Components */
import { Button, Form, FormActions, Input } from '../forms/Forms';
import { Overlay } from '../overlay/Overlay';

export const Colors = (props: ColorsProps) => {
	const { showButton } = props;
	const { isColorsOpen, setIsColorsOpen, theme } = useAppContext();
	const { id } = colorsUtils.config;

	// Default colors
	const defaultColors = {
		color01: theme.colors.color06,
		color02: theme.colors.color06,
		color03: theme.colors.color07,
		color04: theme.colors.color07,
	};

	// Draft colors (controlled inputs) and applied colors (null means defaults are applied)
	const [colors, setColors] = useState(defaultColors);
	const [appliedColors, setAppliedColors] = useState<typeof defaultColors | null>(null);

	// Gradient rules derived from applied colors
	const styles = appliedColors
		? `.gradient-section, .gradient-background {
			background-color: ${appliedColors.color01};
			background-image: linear-gradient(160deg, ${appliedColors.color01} 20%, ${appliedColors.color02} 40%, ${appliedColors.color03} 60%, ${appliedColors.color04});
		}`
		: `.gradient-section, .gradient-background {
			background-color: ${defaultColors.color01};
			background-image: linear-gradient(160deg, ${defaultColors.color01} 35%, ${defaultColors.color03});
		}`;

	// Apply draft colors, falling back to the default gradient if they match the defaults
	const applyColors = () => {
		const isDefault = Object.entries(defaultColors).every(([color, colorValue]) => colors[color as keyof typeof colors] == colorValue);
		setAppliedColors(isDefault ? null : colors);
	};

	// Reset draft and applied colors
	const resetColors = () => {
		setColors(defaultColors);
		setAppliedColors(null);
	};

	return showButton ? (
		<Button
			className={'colors-buttons'}
			label={'Window Color'}
			variant={'link'}
			aria-controls={id}
			aria-expanded={isColorsOpen}
			aria-haspopup={'dialog'}
			aria-label={'Window Color Button'}
			onClick={() => setIsColorsOpen(true)}
		/>
	) : (
		<>
			<style className="colors-styles">{styles}</style>

			<Overlay id={id} className={'colors'} isOpen={isColorsOpen} onClose={() => setIsColorsOpen(false)} aria-labelledby="colors-title">
				<div className="colors-container container">
					<h2 id="colors-title">Window Color</h2>

					<Form
						className={'colors-form gradient-section'}
						onSubmit={(e) => {
							e.preventDefault();
							applyColors();
						}}
						onReset={() => resetColors()}
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

						<FormActions className={'colors-actions'}>
							<Button
								className={'colors-buttons'}
								label={'Change'}
								variant={'link'}
								type={'submit'}
								aria-label={'Change Colors Button'}
							/>

							<Button className={'colors-buttons'} label={'Reset'} variant={'link'} type={'reset'} aria-label={'Reset Colors Button'} />

							<Button
								className={'colors-buttons'}
								label={'x Close'}
								variant={'link'}
								aria-label={'Close Colors Button'}
								onClick={() => setIsColorsOpen(false)}
								data-autofocus
							/>
						</FormActions>
					</Form>
				</div>
			</Overlay>
		</>
	);
};

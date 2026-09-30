/* Styles */
import './styles/icons.scss';

/* Scripts */
import type { IconsProps } from './scripts/icons-types';

export const Icon = (props: IconsProps) => {
	const { id, size } = props;
	const iconClass = 'icon';

	// Create icon classes
	const iconClasses = [`icon`, `icon-${id}`];
	if (size) iconClasses.push(`${iconClass}-${size}`);

	return <span className={iconClasses.join(' ')} aria-hidden="true"></span>;
};

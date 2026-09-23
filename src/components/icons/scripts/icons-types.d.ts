/* Packages */
import type { ComponentType, SVGProps } from 'react';

/* Type definitions */
type Icons = {
	icon: ComponentType<SVGProps<SVGSVGElement>>;
	size?: string;
};

/* Export prop types */
export type IconsProps = Icons;

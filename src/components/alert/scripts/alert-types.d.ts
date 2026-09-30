/* Packages */
import type { HTMLAttributes, ReactElement, ReactNode } from 'react';

/* Type definitions */
type Alert = {
	children: ReactNode;
	className?: string;
	type?: 'error' | 'info' | 'success' | 'warning';
} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'className' | 'role'>;

type AlertIcon = Record<NonNullable<AlertProps['type']>, ReactElement>;

/* Export types */
export type AlertIconType = AlertIcon;

/* Export prop types */
export type AlertProps = Alert;

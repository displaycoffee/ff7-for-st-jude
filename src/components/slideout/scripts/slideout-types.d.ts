/* Packages */
import { RefObject } from 'react';

/* Type definitions */
type SlideoutButton = {
	outside: boolean;
	show: boolean;
};

type SlideoutOptions = {
	children?: ReactNode;
	options: {
		button: SlideoutButton;
		direction?: string;
		id?: string;
		isDesktop: boolean;
		label: string;
		width?: string;
	};
};

type SlideoutOverlayRef = RefObject<HTMLDivElement | null>;

type SlideoutTouch = React.TouchEvent;

type SlideoutTouchRef = { x: number; y: number } | null;

/* Export types */
export type SlideoutOverlayRefType = SlideoutOverlayRef;

export type SlideoutTouchType = SlideoutTouch;

export type SlideoutTouchRefType = SlideoutTouchRef;

/* Export prop types */
export type SlideoutOverlayProps = SlideoutOptions;

export type SlideoutProps = SlideoutOptions;

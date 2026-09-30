/* Packages */
import type { RefObject } from 'react';
import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from '@tanstack/react-router';

export const useAvailableMinHeight = (ref: RefObject<HTMLElement | null>) => {
	// main persists across routes, so a stale min-height can hold it at the old size and mask
	// the resize from ResizeObserver. Re-run on pathname change to force a fresh measurement.
	const location = useLocation();

	// Reserves exactly the viewport space around this element — regardless of what surrounds it,
	// or how many pieces (header, nav, footer, none of the above) — so content mounting in later
	// doesn't shift whatever comes after it. Sets min-height directly, no CSS-side setup needed.
	useLayoutEffect(() => {
		const element = ref.current;
		if (!element) return;

		const updateMinHeight = () => {
			// Temporarily clear so this element's own current height can't feed back into the
			// measurement (its min-height from a prior run would otherwise inflate scrollHeight)
			element.style.minHeight = '';

			const rect = element.getBoundingClientRect();
			const spaceAbove = rect.top + window.scrollY;
			const spaceBelow = document.documentElement.scrollHeight - (rect.bottom + window.scrollY);
			const minHeight = Math.max(0, window.innerHeight - spaceAbove - spaceBelow);

			element.style.minHeight = `${minHeight}px`;
		};

		// Set it synchronously before paint too — ResizeObserver's first callback is only
		// guaranteed to fire eventually, not synchronously ahead of the next paint
		updateMinHeight();

		// Watch the whole page rather than individual siblings — anything that changes the
		// page's total height (header, nav, footer, main's own content, none of the above)
		// should trigger a recompute, without this hook needing to know what those things are
		const observer = new ResizeObserver(updateMinHeight);
		observer.observe(document.body);
		window.addEventListener('resize', updateMinHeight);

		return () => {
			observer.disconnect();
			window.removeEventListener('resize', updateMinHeight);
		};
	}, [ref, location.pathname]);
};

/* Variables for useBodyClass */
const bodyPrefix = 'page-';
const bodySelector = document.querySelector('body');
let previousPage = '';

export const useBodyClass = (defaultPrefix: string) => {
	const location = useLocation();

	useEffect(() => {
		if (!bodySelector) return;

		// Remove any previous body class
		bodySelector.classList.remove(`${bodyPrefix}${previousPage || defaultPrefix}`);

		// Update previous location path
		// Replace any body prefix, remove first slash, and replace any other slash with hyphen
		previousPage = location.pathname.replace(bodyPrefix, '').replace(/\/+$/, '').replace('/', '').replace(/\//g, '-');

		// Add new body class
		bodySelector.classList.add(`${bodyPrefix}${previousPage || defaultPrefix}`);
	}, [location, defaultPrefix]);

	return null;
};

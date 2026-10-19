/* Styles */
import './styles/container-overlay.scss';

/* Packages */
import { Outlet } from '@tanstack/react-router';

/* Scripts */
import { useBodyClass } from '@displaycoffee/scripts/hooks-tanstack';

/* Components */
import { Colors } from '@/components/colors/Colors';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';

export const ContainerOverlay = () => {
	// Set body class using custom hook (page-overlay or page-overlay-widget)
	useBodyClass('overlay');

	return (
		<ErrorBoundary message={<p>Something went wrong loading the overlay.</p>}>
			{/* Adds the window gradient styles */}
			<Colors showButton={false} />

			<Outlet />
		</ErrorBoundary>
	);
};

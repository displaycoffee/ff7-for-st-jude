/* Packages */
import { createRootRoute, useRouterState } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

/* Components */
import { ContextProvider } from '@/context/Context';
import { Container } from '@/layout/container/Container';
import { OverlayContainer } from '@/layout/overlay-container/OverlayContainer';

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	// Overlays are OBS browser sources, so they skip the site layout and the site's live refresh (the widget listens for updates itself)
	const isOverlay = useRouterState({ select: (state) => state.matches.some((match) => match.routeId.startsWith('/overlay')) });

	return (
		<>
			<ContextProvider live={!isOverlay}>
				{isOverlay ? (
					<OverlayContainer />
				) : (
					<>
						<Container />
						<TanStackRouterDevtools />
						<ReactQueryDevtools />
					</>
				)}
			</ContextProvider>
		</>
	);
}

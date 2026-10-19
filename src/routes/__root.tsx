/* Packages */
import { createRootRoute, useRouterState } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

/* Components */
import { ContextProvider } from '@/context/Context';
import { Container } from '@/layout/container/Container';
import { ContainerOverlay } from '@/layout/container/ContainerOverlay';

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
					<ContainerOverlay />
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

/* Packages */
import { createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

/* Components */
import { ContextProvider } from '../context/Context';
import { Container } from '../layout/container/Container';

export const Route = createRootRoute({
	component: () => (
		<>
			<ContextProvider>
				<Container />
				<TanStackRouterDevtools />
				<ReactQueryDevtools />
			</ContextProvider>
		</>
	),
});

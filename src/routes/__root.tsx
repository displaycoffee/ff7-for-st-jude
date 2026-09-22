/* Packages */
import { createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

/* Components */
import { ContextProvider } from '../context/Context';
import { Container } from '../layout/container/Container';

export const Route = createRootRoute({
	component: () => (
		<>
			<ContextProvider>
				<Container />
			</ContextProvider>
			<TanStackRouterDevtools />
		</>
	),
});

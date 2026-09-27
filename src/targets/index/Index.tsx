/* Packages */
import { createRouter, Link, RouterProvider } from '@tanstack/react-router';

/* Scripts */
import { index } from './scripts';
import { variables } from '../../_core/scripts/variables';
import { routeTree } from '../../routeTree.gen';

/* Not found component */
function NotFound() {
	return (
		<p className="not-found">
			Page not found. <Link to={'/'}>Go back</Link>.
		</p>
	);
}

/* Smooth scroll to the top after navigating (instant with reduced motion); opt a link out with resetScroll={false} */
const scrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

/* Create router */
const router = createRouter({
	routeTree,
	basepath: variables.paths.basename,
	defaultNotFoundComponent: NotFound,
	scrollRestorationBehavior: scrollBehavior,
});

/* Register router type for full type safety across the app */
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}

/* Create main target entry point */
index.renderTarget('#index', <RouterProvider router={router} />);

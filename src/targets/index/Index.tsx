/* Packages */
import { createRouter, RouterProvider } from '@tanstack/react-router';

/* Scripts */
import { index } from './scripts';
import { variables } from '../../_core/scripts/variables';
import { routeTree } from '../../routeTree.gen';

/* Create router */
const router = createRouter({ routeTree, basepath: variables.paths.basename });

/* Register router type for full type safety across the app */
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}

/* Create main target entry point */
index.renderTarget('#index', <RouterProvider router={router} />);

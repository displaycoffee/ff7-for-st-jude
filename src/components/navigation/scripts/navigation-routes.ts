/* Local scripts */
import { NavigationMapType, NavigationRoutesType } from './navigation-types';
import { navigation } from './navigation';
import { navigationUtils } from './navigation-utils';

/* Local components */
import { Home } from '../../../pages/home/Home';
import { Dashboard } from '../../../pages/dashboard/Dashboard';
import { Donations } from '../../../pages/donations/Donations';
import { ParticipantGuide } from '../../../pages/participant-guide/ParticipantGuide';

/* Set up component mapping for routes */
/* Note: this should match the navigation.url value in navigation.ts (without the '/') */
const routeMap = {
	home: Home,
	dashboard: Dashboard,
	donations: Donations,
	'participant-guide': ParticipantGuide,
} as NavigationMapType;

/* Create routes array */
const routes = [] as NavigationRoutesType[];

navigation.forEach((nav) => {
	const navKey = navigationUtils.routes.build.key(nav.url);

	if (nav.isRoute && routeMap[navKey]) {
		// Build parent nav config
		const navConfig = {
			...navigationUtils.routes.build.config(nav, routeMap),
			children: [] as NavigationRoutesType[],
		};

		// Build child config
		if (nav?.children && nav.children.length !== 0) {
			nav.children.forEach((child) => {
				const childKey = navigationUtils.routes.build.key(child.url);

				if (child.isRoute && routeMap[childKey]) {
					const childConfig = navigationUtils.routes.build.config(child, routeMap);
					navConfig.children.push(childConfig);
				}
			});
		}

		// Then push routes
		routes.push(navConfig);
	}
});

export const navigationRoutes = routes;

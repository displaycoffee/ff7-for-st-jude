/* Local components */
import { Home } from '../../../pages/home/Home';
import { Dashboard } from '../../../pages/dashboard/Dashboard';
import { Donations } from '../../../pages/donations/Donations';
import { ParticipantGuide } from '../../../pages/participant-guide/ParticipantGuide';

export const navigation = [
	{
		id: 5,
		label: 'Commentary Stream',
		alt: 'Commentary Stream',
		url: '//twitch.tv/MonetaryDragon',
		showInNav: false,
		isRoute: false,
		hasChildren: false,
	},
	{
		id: 4,
		label: 'Donations',
		alt: 'Donations',
		url: '/donations',
		showInNav: true,
		isRoute: true,
		hasChildren: false,
		component: Donations,
	},
	{
		id: 3,
		label: 'Dashboard',
		alt: 'Dashboard',
		url: '/dashboard',
		showInNav: true,
		isRoute: true,
		hasChildren: false,
		component: Dashboard,
	},
	{
		id: 2,
		label: 'Signup Sheet',
		alt: 'Signup Sheet',
		url: '//docs.google.com/spreadsheets/d/1pxX1Pf7qK3eO2nKksbLGp3VbWV7ZByPC6dxVNmo8pds/edit',
		showInNav: false,
		isRoute: false,
		hasChildren: false,
	},
	{
		id: 1,
		label: 'Participant Guide',
		alt: 'Participant Guide',
		url: '/participant-guide',
		showInNav: false,
		isRoute: true,
		hasChildren: false,
		component: ParticipantGuide,
	},
	{
		id: 0,
		label: 'Home',
		alt: 'Home',
		url: '/',
		showInNav: true,
		isRoute: true,
		hasChildren: false,
		component: Home,
	},
].sort((a, b) => {
	// Sort navigation by id
	return a.id - b.id;
});

/* Function to filter out navigation links */
export const createNavigationList = (navigation, isRoute) => {
	// Determine initial navigaton check
	let hasNavigation = navigation && navigation.length !== 0 ? true : false;

	// Filter out navigation links
	navigation = navigation.filter((nav) => {
		const hasNavLink = (isRoute && nav.isRoute) || (!isRoute && nav.showInNav) ? true : false;
		return hasNavLink;
	});

	// Check navigation again
	hasNavigation = navigation && navigation.length !== 0 ? true : false;

	// Return final navigation
	return hasNavigation ? navigation : [];
};

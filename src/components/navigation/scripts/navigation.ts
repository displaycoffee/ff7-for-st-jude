/* React */
import { lazy } from 'react';

/* Local scripts */
import { NavigationType } from './navigation-types';

/* Local components */
const Home = lazy(() => import('../../../pages/home/Home').then((m) => ({ default: m.Home })));
const Dashboard = lazy(() => import('../../../pages/dashboard/Dashboard').then((m) => ({ default: m.Dashboard })));
const Donations = lazy(() => import('../../../pages/donations/Donations').then((m) => ({ default: m.Donations })));
const ParticipantGuide = lazy(() => import('../../../pages/participant-guide/ParticipantGuide').then((m) => ({ default: m.ParticipantGuide })));

export const navigation = [
	{
		id: 5,
		alt: 'Commentary Stream',
		element: Home,
		isRoute: false,
		label: 'Commentary Stream',
		showInNav: false,
		url: '//twitch.tv/MonetaryDragon',
	},
	{
		id: 4,
		alt: 'Donations',
		element: Donations,
		isRoute: true,
		label: 'Donations',
		showInNav: true,
		url: '/donations',
	},
	{
		id: 3,
		alt: 'Dashboard',
		element: Dashboard,
		isRoute: true,
		label: 'Dashboard',
		showInNav: true,
		url: '/dashboard',
	},
	{
		id: 2,
		alt: 'Signup Sheet',
		isRoute: false,
		label: 'Signup Sheet',
		showInNav: false,
		url: '//docs.google.com/spreadsheets/d/1pxX1Pf7qK3eO2nKksbLGp3VbWV7ZByPC6dxVNmo8pds/edit',
	},
	{
		id: 1,
		alt: 'Participant Guide',
		element: ParticipantGuide,
		isRoute: true,
		label: 'Participant Guide',
		url: '/participant-guide',
		showInNav: true,
	},
	{
		id: 0,
		alt: 'Home',
		isRoute: true,
		label: 'Home',
		url: '/',
		showInNav: true,
	},
] as NavigationType[];

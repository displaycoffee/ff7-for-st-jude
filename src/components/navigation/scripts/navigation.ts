/* Local scripts */
import { NavigationType } from './navigation-types';

export const navigation = [
	{
		id: 5,
		alt: 'Commentary Stream',
		isRoute: false,
		label: 'Commentary Stream',
		showInNav: true,
		url: '//twitch.tv/MonetaryDragon',
	},
	{
		id: 4,
		alt: 'Donations',
		isRoute: true,
		label: 'Donations',
		showInNav: true,
		url: '/donations',
	},
	{
		id: 3,
		alt: 'Dashboard',
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
		showInNav: true,
		url: '//docs.google.com/spreadsheets/d/1pxX1Pf7qK3eO2nKksbLGp3VbWV7ZByPC6dxVNmo8pds/edit',
	},
	{
		id: 1,
		alt: 'Participant Guide',
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

/* Scripts */
import type { NavigationMapType } from './navigation-types';
import { navigationUtils } from './navigation-utils';

const { create } = navigationUtils;

export const navigationHeader: NavigationMapType = {
	...create({ key: 'index', label: 'Home', url: '/' }),
	...create({ key: 'participant-guide', label: 'Participant Guide' }),
	...create({
		key: 'sign-up-sheet',
		label: 'Signup Sheet',
		isRoute: false,
		url: '//docs.google.com/spreadsheets/d/1akF7X7c78D3lgtaUNT1Hontkgiqge4FzcpySVmVX4Mk/edit?gid=0#gid=0',
	}),
	...create({ key: 'dashboard', label: 'Dashboard' }),
	...create({ key: 'donations', label: 'Donations' }),
	...create({ key: 'commentary-stream', label: 'Commentary Stream', isRoute: false, url: '//twitch.tv/MonetaryDragon', showInNav: false }),
};

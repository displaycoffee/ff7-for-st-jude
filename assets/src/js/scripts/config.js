/* local script imports */
import { campaigns } from './_campaigns';
import { navigation } from './_navigation';
import { requests } from './_requests';
import { theme } from './_theme';
import { utils } from './_utils';
import { variables } from './_variables';

/* joins other scripts into one object */
export const config = {
	campaigns: campaigns,
	navigation: navigation,
	requests: requests,
	theme: theme,
	utils: utils,
	variables: variables,
};

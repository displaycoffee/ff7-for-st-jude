/* local script imports */
import { campaigns } from './_campaigns';
import { requests } from './_requests';
import { variables } from './_variables';

/* joins other scripts into one object */
export const config = {
	campaigns: campaigns,
	requests: requests,
	variables: variables,
};

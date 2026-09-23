/* Tiltify API proxy */
const api = import.meta.env.VITE_API_URL as string;

/* This config contains variables to use through application */
const directory = '/ff7-st-jude';
export const variables: VariablesType = {
	paths: {
		basename: typeof window == 'object' && window.location.pathname.includes(directory) ? directory : '',
	},
	api: {
		campaigns: `${api}/api/public/campaigns`,
		teams: `${api}/api/public/team_campaigns`,
	},
	urls: {
		tiltify: '//tiltify.com',
		team: '//tiltify.com/+ff7-for-st-jude',
		campaign: '//tiltify.com/+ff7-for-st-jude/ff7-for-st-jude-10',
	},
	placeholders: {
		endDate: '2026-11-25T23:59:59Z',
		endDateReadable: 'November 25, 2026',
	},
};

/* Tiltify API proxy */
const tiltifyApi = 'https://api.ff7forstjude.org';

/* This config contains variables to use through application */
const directory = '/ff7-st-jude';
export const variables = {
	paths: {
		basename: window.location.pathname.includes(directory) ? directory : '',
	},
	api: {
		campaigns: `${tiltifyApi}/api/public/campaigns`,
		teams: `${tiltifyApi}/api/public/team_campaigns`,
	},
	urls: {
		tiltify: '//tiltify.com',
		team: '//tiltify.com/+ff7-for-st-jude',
		campaign: '//tiltify.com/+ff7-for-st-jude/ff7-for-st-jude-7',
	},
	placeholders: {
		endDate: '2024-05-30T24:00:00Z',
		endDateReadable: 'May 30, 2024',
	},
};

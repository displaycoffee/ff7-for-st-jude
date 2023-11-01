/* tiltify api proxy */
const tiltifyApi = 'http://ff7forstjude.org:5000';

/* This config contains variables to use through application */
export const variables = {
	paths: {
		base: window.location.pathname.includes('/ff7-st-jude') ? '/ff7-st-jude' : '',
	},
	api: {
		campaign: `${tiltifyApi}/api/public/campaigns`,
		teams: `${tiltifyApi}/api/public/team_campaigns`,
	},
	urls: {
		tiltify: 'https://tiltify.com',
		team: 'https://tiltify.com/+ff7-for-st-jude',
		campaign: 'https://tiltify.com/+ff7-for-st-jude/ff7-for-st-jude-6',
	},
};

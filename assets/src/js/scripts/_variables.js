/* cors-anywhere url to get around cors cross-site block when testing with locahost */
/* note: if this fails, you may need to re-run the demo by visiting https://cors-anywhere.herokuapp.com/corsdemo */
const corsBypass = window.location.href.includes('localhost') ? 'https://cors-anywhere.herokuapp.com/' : '';

/* tiltify api domain */
const tiltifyApi = `${corsBypass}https://v5api.tiltify.com`;

/* this config contains variables to use through application */
export const variables = {
	api: {
		token: `${tiltifyApi}/oauth/token`,
		campaign: `${tiltifyApi}/api/public/campaigns`,
		teams: `${tiltifyApi}/api/public/team_campaigns`,
	},
	urls: {
		team: `https://tiltify.com/+ff7-for-st-jude`,
	},
};

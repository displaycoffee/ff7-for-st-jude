/* local imports */ 
import secret from '../../../../secret.txt';

export const tiltify = {
	token : secret,
	campaign : 169251,
	api : {
		supporting : (id) => {
			return `https://tiltify.com/api/v3/campaigns/${id}/supporting-campaigns`
		},
		donations : (id) => {
			return `https://tiltify.com/api/v3/campaigns/${id}/donations`
		}
	},
	fetchParams : {
		method: 'GET',
		headers: {
			'Authorization' : `Bearer ${secret}`,
			'Content-Type' : `application/json`
		}
	}
};
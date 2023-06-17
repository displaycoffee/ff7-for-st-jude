/* local imports */
import secret from '../../../../secret.txt';

/* split secret */
const splitSecret = secret.split('::');

const bodyOptions = {
	method: 'POST',
	client_id: splitSecret[0],
	client_secret: splitSecret[1],
	grant_type: 'client_credentials',
	scope: 'public',
};

const options = {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify(bodyOptions),
};

export const getToken = async () => {
	const responsePrefix = window.location.href.includes('localhost') ? 'https://cors-anywhere.herokuapp.com/' : '';
	const response = await fetch(`${responsePrefix}https://v5api.tiltify.com/oauth/token`, options);
	const json = await response.json();
	return json.access_token;
};

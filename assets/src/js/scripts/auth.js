/* local script imports */
import { settings } from './settings';
import secret from '../../../../secret.txt';

/* split secret */
const splitSecret = secret.split('::');

const bodyOptions = {
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
	const response = await fetch(`${settings.corsBypass}${settings.tiltifyApi}/oauth/token`, options);
	const json = await response.json();
	return json.access_token;
};

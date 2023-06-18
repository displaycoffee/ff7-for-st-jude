/* local script imports */
import secret from '../../../../secret.txt';
import { variables } from './_variables';

/* setup parameters to pass to fetches */
const parameters = {
	token: {
		body: () => {
			// split secret
			const splitSecret = secret.split('::');

			return {
				client_id: splitSecret[0],
				client_secret: splitSecret[1],
				grant_type: 'client_credentials',
				scope: 'public',
			};
		},
		options: () => {
			return {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			};
		},
	},
	tiltify: {
		options: (token) => {
			return {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
			};
		},
	},
};

export const requests = {
	token: async () => {
		// set options for fetch
		const options = {
			...parameters.token.options(),
			body: JSON.stringify(parameters.token.body()),
		};

		// authorize and get token
		const response = await fetch(variables.api.token, options);
		const json = await response.json();
		return {
			token: json.access_token,
			created: json.created_at,
		};
	},
	campaign: async (token, campaign) => {
		// fetch base campaign
		const response = await fetch(`${variables.api.teams}/${campaign}`, parameters.tiltify.options(token));
		const json = await response.json();

		// update user data of campaign
		if (json && json.data) {
			json.data.url = json.data.team.url;
			json.data.user = {
				username: json.data.name,
				url: json.data.url,
			};
			return json.data;
		}
	},
	supporting: async (token, campaign) => {
		// fetch supporting campaigns
		const response = await fetch(`${variables.api.teams}/${campaign}/supporting_campaigns`, parameters.tiltify.options(token));
		const json = await response.json();
		return json;
	},
};

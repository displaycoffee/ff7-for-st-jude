/* local script imports */
import secret from '../../../../secret.txt';
import { variables } from './_variables';
import { utils } from './utils';

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
	campaign: async (id, token) => {
		// fetch base campaign
		const response = await fetch(`${variables.api.teams}/${id}`, parameters.tiltify.options(token));
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
	supporting: async (id, token) => {
		// fetch supporting campaigns
		const response = await fetch(`${variables.api.teams}/${id}/supporting_campaigns`, parameters.tiltify.options(token));
		const json = await response.json();
		return json;
	},
	content: async (id, isBase, token, supporting, donationsFetch, donationsCache) => {
		// empty content config to fetch and store data in
		let contentConfig = {
			donations: [],
			rewards: [],
			challenges: [],
		};

		// set fetch path
		const contentUrl = `${variables.api[isBase ? 'teams' : 'campaign']}/${id}`;

		// set fetch parameters
		const contentParameters = parameters.tiltify.options(token);

		// fetch donations, rewards, and challenges from tiltify using promises
		let [donations, rewards, challenges] = await Promise.all([
			donationsFetch ? fetch(`${contentUrl}/donations`, contentParameters) : Promise.resolve({}),
			fetch(`${contentUrl}/rewards`, contentParameters),
			fetch(`${contentUrl}/targets`, contentParameters),
		]);

		// get json from response
		let [donationsJson, rewardsJson, challengesJson] = await Promise.all([
			donationsFetch ? donations.json() : Promise.resolve({ data: donationsCache }),
			rewards.json(),
			challenges.json(),
		]);

		if (donationsJson && donationsJson.data) {
			// add campaign id and links to donations
			donationsJson.data = donationsJson.data.filter((data) => {
				data.id = id;
				data.links = utils.checkLinks(supporting, data)
					? [
							{
								label: supporting[data.id].username,
								url: supporting[data.id].campaign,
							},
					  ]
					: [];
				return data;
			});

			// then add donations to contentConfig
			contentConfig.donations = donationsJson.data;
		}

		if (rewardsJson && rewardsJson.data) {
			// add id and links and filter out inactive rewards
			rewardsJson.data = rewardsJson.data.filter((data) => {
				data.id = id;
				data.links = utils.checkLinks(supporting, data)
					? [
							{
								label: `Redeem at ${supporting[data.id].username}`,
								url: supporting[data.id].campaign,
							},
					  ]
					: [];
				return utils.filterContent('reward', data);
			});

			// then add rewards to contentConfig
			contentConfig.rewards = rewardsJson.data;
		}

		if (challengesJson && challengesJson.data) {
			// add id and links and filter out inactive challenges
			challengesJson.data = challengesJson.data.filter((data) => {
				data.id = id;
				data.links = utils.checkLinks(supporting, data)
					? [
							{
								label: `Participate at ${supporting[data.id].username}`,
								url: supporting[data.id].campaign,
							},
					  ]
					: [];
				return utils.filterContent('challenge', data);
			});

			// then add challenges to contentConfig
			contentConfig.challenges = challengesJson.data;
		}

		return contentConfig;
	},
};

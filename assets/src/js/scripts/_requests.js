/* local script imports */
import secret from '../../../../secret.txt';
import { variables } from './_variables';
import { utils } from './_utils';

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

		if (json && json.data) {
			// add details to campaign data
			json.data.url = json.data.team.url;
			json.data.user = {
				username: json.data.name,
				url: json.data.url,
			};
			json.data.amounts = utils.getAmounts(json.data);
			return json.data;
		}
	},
	donations: async (token, campaign, supporting) => {
		let donations = false; // storage for donations data

		// fetch donations
		const response = await fetch(`${variables.api.teams}/${campaign[0].id}/donations?limit=100`, parameters.tiltify.options(token));
		const json = await response.json();

		if (json && json.data) {
			donations = json.data.filter((data) => {
				// add details to donations data
				data.milliseconds = new Date(data.completed_at).getTime();
				data.amounts = utils.getAmounts(data);
				data.links = [];
				if (data.campaign_id) {
					supporting.forEach((support) => {
						if (data.campaign_id == support.id) {
							return data.links.push({
								label: support.username,
								url: `${variables.urls.tiltify}${support.url}`,
							});
						}
					});
				} else {
					data.links.push({
						label: campaign[0].user.username,
						url: variables.urls.campaign,
					});
				}
				return data;
			});
		}

		return donations;
	},
	supporting: async (id, token) => {
		let supporting = false; // storage for supporting data

		// fetch supporting campaigns
		const response = await fetch(`${variables.api.teams}/${id}/supporting_campaigns`, parameters.tiltify.options(token));
		const json = await response.json();

		if (json && json.data) {
			supporting = json.data.filter((data) => {
				// add details to supporting data
				data.amounts = utils.getAmounts(data);
				data.username = data.user.username.trim();
				data.campaign = `${variables.urls.tiltify}${data.user.url}/${data.slug}`;
				data.links = [
					{
						label: `Support ${data.username}`,
						url: data.campaign,
					},
				];
				if (data?.livestream?.type == 'twitch') {
					data.links.unshift({
						label: 'Watch stream',
						url: `https://${data.livestream.type}.tv/${data.livestream.channel}`,
					});
				}
				return data;
			});
		}

		return supporting;
	},
	content: async (id, token, support) => {
		// empty content config to fetch and store data in
		let contentConfig = {
			rewards: [],
			targets: [],
		};

		// set fetch path
		const contentUrl = `${variables.api.campaign}/${id}`;

		// set fetch parameters
		const contentParameters = parameters.tiltify.options(token);

		// set fetch array
		const contentFetch = [
			fetch(`${contentUrl}/rewards?limit=100`, contentParameters),
			fetch(`${contentUrl}/targets?limit=100`, contentParameters),
		];

		// fetch rewards, and targets from tiltify using promises
		await Promise.all(contentFetch)
			.then(([rewardsResponse, resPosts]) => {
				return Promise.all([rewardsResponse.json(), resPosts.json()]);
			})
			.then(([rewardsJson, targetsJson]) => {
				if (rewardsJson && rewardsJson.data) {
					// add id and links and filter out inactive rewards
					rewardsJson.data = rewardsJson.data.filter((data) => {
						data.ends_at = data.ends_at ? data.ends_at : '2023-09-30T24:00:00Z';
						data.date = utils.getDate(data.ends_at);
						data.milliseconds = new Date(data.ends_at).getTime();
						data.amounts = utils.getAmounts(data);
						data.links = [
							{
								label: `Redeem at ${support.username}`,
								url: `${variables.urls.tiltify}${support.url}`,
							},
						];
						return utils.filterContent('reward', data);
					});

					// then add rewards to contentConfig
					contentConfig.rewards = rewardsJson.data;
				}

				if (targetsJson && targetsJson.data) {
					// add id and links and filter out inactive rewards
					targetsJson.data = targetsJson.data.filter((data) => {
						data.ends_at = data.ends_at ? data.ends_at : '2023-09-30T24:00:00Z';
						data.date = utils.getDate(data.ends_at);
						data.milliseconds = new Date(data.ends_at).getTime();
						data.amounts = utils.getAmounts(data);
						data.links = [
							{
								label: `Participate at ${support.username}`,
								url: `${variables.urls.tiltify}${support.url}`,
							},
						];
						return utils.filterContent('target', data);
					});

					// then add targets to contentConfig
					contentConfig.targets = targetsJson.data;
				}
			});

		return contentConfig;
	},
};

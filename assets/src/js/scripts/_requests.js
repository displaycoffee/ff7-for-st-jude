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
			json.data.amounts = utils.values.getAmounts(json.data);
			return json.data;
		}
	},
	donations: async (token, campaign, supporting) => {
		let donations = false; // storage for donations data

		// fetch donations
		const response = await fetch(`${variables.api.teams}/${campaign[0].id}/donations`, parameters.tiltify.options(token));
		const json = await response.json();

		if (json && json.data) {
			donations = json.data.filter((data) => {
				// add details to donations data
				data.amounts = utils.values.getAmounts(data);
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
						url: campaign[0].user.url,
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
				data.amounts = utils.values.getAmounts(data);
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
		let response1 = false;
		let response2 = false;

		await Promise.all([fetch(`${contentUrl}/rewards`, contentParameters), fetch(`${contentUrl}/targets`, contentParameters)])
			.then(([resUsers, resPosts]) => Promise.all([resUsers.json(), resPosts.json()]))
			.then(([dataUsers, dataPosts]) => {
				response1 = dataUsers;
				response2 = dataPosts;
			});

		console.log('check promises', response1, response2);

		// let [rewards, challenges] = await Promise.all([
		// 	//donationsFetch ? fetch(`${contentUrl}/donations`, contentParameters) : Promise.resolve({}),
		// 	fetch(`${contentUrl}/rewards`, contentParameters),
		// 	fetch(`${contentUrl}/targets`, contentParameters),
		// ]);

		// get json from response
		// let [rewardsJson, challengesJson] = await Promise.all([
		// 	//donationsFetch ? donations.json() : Promise.resolve({ data: donationsCache }),
		// 	rewards.json(),
		// 	challenges.json(),
		// ]);

		// const fetchPromises = graphQLChunks.map((chunk) => {
		// 	return graphQLConfig.fetchGraphQLData(chunk);
		// });
		// await Promise.all(fetchPromises);

		//console.log('content function', rewards, rewardsJson);

		// if (rewardsJson && rewardsJson.data) {
		// 	console.log('in here', rewardsJson.data);
		// 	// add id and links and filter out inactive rewards
		// 	rewardsJson.data = rewardsJson.data.filter((data) => {
		// 		data.links = utils.checkLinks(supporting, id)
		// 			? [
		// 					{
		// 						label: `Redeem at ${supporting[id].username}`,
		// 						url: supporting[id].campaign,
		// 					},
		// 			  ]
		// 			: [];
		// 		return utils.filterContent('reward', data);
		// 	});

		// 	// then add rewards to contentConfig
		// 	contentConfig.rewards = rewardsJson.data;
		// }

		// if (challengesJson && challengesJson.data) {
		// 	// add id and links and filter out inactive challenges
		// 	challengesJson.data = challengesJson.data.filter((data) => {
		// 		data.links = utils.checkLinks(supporting, id)
		// 			? [
		// 					{
		// 						label: `Participate at ${supporting[id].username}`,
		// 						url: supporting[id].campaign,
		// 					},
		// 			  ]
		// 			: [];
		// 		return utils.filterContent('challenge', data);
		// 	});

		// 	// then add challenges to contentConfig
		// 	contentConfig.challenges = challengesJson.data;
		// }

		console.log('continue request', contentConfig);

		return contentConfig;
	},
};

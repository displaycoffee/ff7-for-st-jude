/* local script imports */
import { variables } from './_variables';
import { utils } from './utils';

/* st. jude ff7 campaign ids */
const campaignIds = {
	1: 'e96852f5-6234-4c36-ab09-82de953ae6fa',
	2: 'f7e6a172-16be-40c0-9f99-3afe2eda3a3c',
	3: '3f4c8d77-43a3-4414-9ecb-25ef430f77c7',
	4: 'e9048b01-70ce-4f0a-9cc9-29c583b1a997',
	5: 'f0db38a3-df52-4f4c-8030-3b2c81db39d1',
	6: '6805c495-d02f-42ea-81d8-9b6c5ff5d3b5',
};

export const tiltify = {
	campaign: campaignIds[6],
	campaigns: [
		{
			id: campaignIds[5],
			name: 'FF7 for St. Jude #5',
			total_amount_raised: 9254.38,
			date: 'December 10, 2022',
			links: [
				{
					label: 'See campaign',
					url: 'https://tiltify.com/+ff7-for-st-jude/ff7-for-st-jude-5',
				},
			],
		},
		{
			id: campaignIds[4],
			name: 'FF7 No-Slots for St. Jude #4',
			total_amount_raised: 8770.46,
			date: 'June 25, 2022',
			links: [
				{
					label: 'See campaign',
					url: 'https://tiltify.com/+ff7-for-st-jude/ff7-no-slots-for-st-jude-4',
				},
			],
		},
		{
			id: campaignIds[3],
			name: 'FF7 No-Slots for St. Jude #3',
			total_amount_raised: 6448.34,
			date: 'December 11, 2021',
			links: [
				{
					label: 'See campaign',
					url: 'https://tiltify.com/+ff7-for-st-jude/ff7-no-slots-for-st-jude-3',
				},
			],
		},
		{
			id: campaignIds[2],
			name: 'FF7 No-Slots For St. Jude #2',
			total_amount_raised: 4469.69,
			date: 'June 26, 2021',
			links: [
				{
					label: 'See campaign',
					url: 'https://tiltify.com/+ff7-for-st-jude/ff7-no-slots-for-st-jude-2',
				},
			],
		},
		{
			id: campaignIds[1],
			name: 'FF7 No-Slots For St. Jude',
			total_amount_raised: 2313.06,
			date: 'December 28, 2020',
			links: [
				{
					label: 'See campaign',
					url: 'https://tiltify.com/+ff7-for-st-jude/ff7-no-slots-for-st-jude',
				},
			],
		},
	],
	api: `${variables.corsBypass}${variables.tiltifyApi}/api/public/team_campaigns/`,
	fetchParams: (token) => {
		return {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		};
	},
	checkLinks: (supporting, data) => {
		return supporting[data.campaignId].username && supporting[data.campaignId].campaign ? true : false;
	},
	filterContent: (content, data) => {
		// get time for checking if content has expired
		const currentTime = Date.now();

		// variables for checking if content should be returned
		const isExpired = data.endsAt < currentTime;

		// set state for checks
		let contentActive = true;
		if (content == 'reward') {
			const isRemaining = typeof data.remaining == 'number' && data.remaining > 0 ? true : false;
			contentActive = !isExpired && isRemaining && data.active && !data.alwaysActive;
		} else if (content == 'challenge') {
			contentActive = !isExpired && data.active && data.total_amount_raised < data.amount_raised;
		}
		return contentActive;
	},
	request: {
		campaign: async () => {
			const response = await fetch(`${tiltify.api}${tiltify.campaign}`, tiltify.fetchParams);
			const json = await response.json();

			if (json && json.data) {
				// update user data of campaign
				json.data.url = json.data.team.url;
				json.data.user = {
					username: json.data.name,
					url: json.data.url,
				};

				return json.data;
			}
		},
		content: async (id, supporting, donationsFetch, donationsCache) => {
			// empty content config to fetch and store data in
			let contentConfig = {
				donations: [],
				rewards: [],
				challenges: [],
			};

			// fetch donations, rewards, and challenges from tiltify using promises
			let [donations, rewards, challenges] = await Promise.all([
				donationsFetch ? fetch(`${tiltify.api}${id}/donations?count=100`, tiltify.fetchParams) : Promise.resolve({}),
				fetch(`${tiltify.api}${id}/rewards`, tiltify.fetchParams),
				fetch(`${tiltify.api}${id}/challenges`, tiltify.fetchParams),
			]);

			// get json from response
			let [donationsJson, rewardsJson, challengesJson] = await Promise.all([
				donationsFetch ? donations.json() : Promise.resolve({ data: donationsCache }),
				rewards.json(),
				challenges.json(),
			]);

			if (donationsJson && donationsJson.data) {
				// add campaignId and links to donations
				donationsJson.data = donationsJson.data.filter((data) => {
					data.campaignId = utils.values.toNumber(id);
					data.links = tiltify.checkLinks(supporting, data)
						? [
								{
									label: supporting[data.campaignId].username,
									url: supporting[data.campaignId].campaign,
								},
						  ]
						: [];
					return data;
				});

				// then add donations to contentConfig
				contentConfig.donations = donationsJson.data;
			}

			if (rewardsJson && rewardsJson.data) {
				// add campaignId and links and filter out inactive rewards
				rewardsJson.data = rewardsJson.data.filter((data) => {
					data.campaignId = utils.values.toNumber(id);
					data.links = tiltify.checkLinks(supporting, data)
						? [
								{
									label: `Redeem at ${supporting[data.campaignId].username}`,
									url: supporting[data.campaignId].campaign,
								},
						  ]
						: [];
					return tiltify.filterContent('reward', data);
				});

				// then add rewards to contentConfig
				contentConfig.rewards = rewardsJson.data;
			}

			if (challengesJson && challengesJson.data) {
				// add campaignId and links and filter out inactive challenges
				challengesJson.data = challengesJson.data.filter((data) => {
					data.campaignId = utils.values.toNumber(id);
					data.links = tiltify.checkLinks(supporting, data)
						? [
								{
									label: `Participate at ${supporting[data.campaignId].username}`,
									url: supporting[data.campaignId].campaign,
								},
						  ]
						: [];
					return tiltify.filterContent('challenge', data);
				});

				// then add challenges to contentConfig
				contentConfig.challenges = challengesJson.data;
			}

			return contentConfig;
		},
	},
};

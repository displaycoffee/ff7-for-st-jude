/* local imports */
import secret from '../../../../secret.txt';

/* st. jude ff7 campaign ids */
const campaignIds = {
	4: 169251,
	5: 463822,
};

export const tiltify = {
	token: secret,
	campaign: campaignIds[5],
	api: 'https://tiltify.com/api/v3/campaigns/',
	fetchParams: {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${secret}`,
			'Content-Type': `application/json`,
		},
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
			contentActive = !isExpired && data.totalAmountRaised < data.amount;
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
		content: async (id) => {
			// empty content config to fetch and store data in
			let contentConfig = {
				donations: [],
				rewards: [],
				challenges: [],
			};

			// fetch donations, rewards, and challenges from tiltify using promises
			let [donations, rewards, challenges] = await Promise.all([
				fetch(`${tiltify.api}${id}/donations?count=50`, tiltify.fetchParams),
				fetch(`${tiltify.api}${id}/rewards`, tiltify.fetchParams),
				fetch(`${tiltify.api}${id}/challenges`, tiltify.fetchParams),
			]);

			// get json from response
			let [donationsJson, rewardsJson, challengesJson] = await Promise.all([donations.json(), rewards.json(), challenges.json()]);

			if (donationsJson && donationsJson.data) {
				// add campaignId to donations
				donationsJson.data = donationsJson.data.filter((data) => {
					data.campaignId = id;
					return data;
				});

				// then add donations to contentConfig
				contentConfig.donations = donationsJson.data;
			}

			if (rewardsJson && rewardsJson.data) {
				// add campaignId and filter out inactive rewards
				rewardsJson.data = rewardsJson.data.filter((data) => {
					data.campaignId = id;
					return tiltify.filterContent('reward', data);
				});

				// then add rewards to contentConfig
				contentConfig.rewards = rewardsJson.data;
			}

			if (challengesJson && challengesJson.data) {
				// add campaignId and filter out inactive challenges
				challengesJson.data = challengesJson.data.filter((data) => {
					data.campaignId = id;
					return tiltify.filterContent('challenge', data);
				});

				// then add challenges to contentConfig
				contentConfig.challenges = challengesJson.data;
			}

			return contentConfig;
		},
	},
};

/* Local scripts */
import { variables } from './variables';
import { utils } from './utils';

/* Setup parameters to pass to fetches */
const parameters = {
	tiltify: {
		options: () => {
			return {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			};
		},
	},
};

export const requests = {
	campaign: async ({ queryKey }) => {
		const current = queryKey[1];

		// Storage for campaign data
		let campaign = false;

		// Fetch base campaign
		const response = await fetch(`${variables.api.teams}/${current.id}/`, parameters.tiltify.options());
		const json = await response.json();

		if (json && json.data) {
			// Add details to campaign data
			json.data.url = json.data.team.url;
			json.data.user = {
				username: json.data.name,
				url: json.data.url,
			};
			json.data.amounts = utils.getAmounts(json.data);
			campaign = json.data;
		}
		return campaign;
	},
	supporting: async ({ queryKey }) => {
		const current = queryKey[1];

		// Storage for supporting data
		let supporting = false;

		// Fetch base campaign
		const response = await fetch(`${variables.api.teams}/${current.id}/supporting_campaigns?limit=50`, parameters.tiltify.options());
		const json = await response.json();

		if (json && json.data) {
			// Add details to supporting data
			supporting = json.data.filter((data) => {
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
	donations: async (current, supporting) => {
		// Storage for donations data
		let donations = false;

		// Fetch base campaign
		const response = await fetch(`${variables.api.teams}/${current.id}/donations?limit=100`, parameters.tiltify.options());
		const json = await response.json();

		if (json && json.data) {
			// Add details to donations data
			donations = json.data.filter((data) => {
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
						label: current.name,
						url: variables.urls.campaign,
					});
				}
				return data;
			});
			return donations;
		} else {
			return donations;
		}
	},
	rewards: async (current) => {
		// Storage for rewards data
		let rewards = false;

		// Fetch base campaign
		const response = await fetch(`${variables.api.campaigns}/${current.id}/rewards?limit=100`, parameters.tiltify.options());
		const json = await response.json();

		if (json && json.data) {
			// Add details to rewards data
			rewards = json.data.filter((data) => {
				data.ends_at = data.ends_at ? data.ends_at : variables.placeholders.endDate;
				data.date = utils.getDate(data.ends_at);
				data.milliseconds = new Date(data.ends_at).getTime();
				data.amounts = utils.getAmounts(data);
				data.links = [
					{
						label: `Redeem at ${current.username}`,
						url: `${variables.urls.tiltify}${current.url}`,
					},
				];
				return utils.filterContent('rewards', data);
			});
			return rewards;
		} else {
			return rewards;
		}
	},
	targets: async (current) => {
		// Storage for targets data
		let targets = false;

		// Fetch base campaign
		const response = await fetch(`${variables.api.campaigns}/${current.id}/targets?limit=100`, parameters.tiltify.options());
		const json = await response.json();

		if (json && json.data) {
			// Add details to targets data
			targets = json.data.filter((data) => {
				data.ends_at = data.ends_at ? data.ends_at : variables.placeholders.endDate;
				data.date = utils.getDate(data.ends_at);
				data.milliseconds = new Date(data.ends_at).getTime();
				data.amounts = utils.getAmounts(data);
				data.links = [
					{
						label: `Participate at ${current.username}`,
						url: `${variables.urls.tiltify}${current.url}`,
					},
				];
				return utils.filterContent('targets', data);
			});
			return targets;
		} else {
			return targets;
		}
	},
};

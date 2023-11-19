/* local script imports */
import { variables } from './variables';
import { utils } from './utils';

/* setup parameters to pass to fetches */
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
		const current = queryKey[2];

		// storage for campaign data
		let campaign = false;

		// fetch base campaign
		const response = await fetch(`${variables.api.teams}/${current.id}/`, parameters.tiltify.options());
		const json = await response.json();

		if (json && json.data) {
			// add details to campaign data
			json.data.url = json.data.team.url;
			json.data.user = {
				username: json.data.name,
				url: json.data.url,
			};
			json.data.amounts = utils.getAmounts(json.data);
			campaign = json.data;
			return campaign;
		} else {
			return campaign;
		}
	},
	supporting: async ({ queryKey }) => {
		const current = queryKey[2];

		// storage for supporting data
		let supporting = false;

		// fetch base campaign
		const response = await fetch(`${variables.api.teams}/${current.id}/supporting_campaigns/`, parameters.tiltify.options());
		const json = await response.json();

		if (json && json.data) {
			// add details to supporting data
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
			return supporting;
		} else {
			return supporting;
		}
	},
	donations: async ({ queryKey }) => {
		const current = queryKey[2];
		const supportingResults = queryKey[3];

		// storage for donations data
		let donations = false;

		// fetch base campaign
		const response = await fetch(`${variables.api.teams}/${current.id}/donations?limit=100`, parameters.tiltify.options());
		const json = await response.json();

		if (json && json.data) {
			// add details to donations data
			donations = json.data.filter((data) => {
				data.milliseconds = new Date(data.completed_at).getTime();
				data.amounts = utils.getAmounts(data);
				data.links = [];
				if (data.campaign_id) {
					supportingResults.forEach((support) => {
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
	rewards: async ({ queryKey }) => {
		const campaign = queryKey[2];

		// storage for rewards data
		let rewards = false;

		// fetch base campaign
		const response = await fetch(`${variables.api.campaigns}/${campaign.id}/rewards?limit=100`, parameters.tiltify.options());
		const json = await response.json();

		if (json && json.data) {
			// add details to rewards data
			rewards = json.data.filter((data) => {
				data.ends_at = data.ends_at ? data.ends_at : variables.placeholders.endsAt;
				data.date = utils.getDate(data.ends_at);
				data.milliseconds = new Date(data.ends_at).getTime();
				data.amounts = utils.getAmounts(data);
				data.links = [
					{
						label: `Redeem at ${campaign.username}`,
						url: `${variables.urls.tiltify}${campaign.url}`,
					},
				];
				return utils.filterContent('rewards', data);
			});
			return rewards;
		} else {
			return rewards;
		}
	},
	targets: async ({ queryKey }) => {
		const campaign = queryKey[2];

		// storage for targets data
		let targets = false;

		// fetch base campaign
		const response = await fetch(`${variables.api.campaigns}/${campaign.id}/targets?limit=100`, parameters.tiltify.options());
		const json = await response.json();

		if (json && json.data) {
			// add details to targets data
			targets = json.data.filter((data) => {
				data.ends_at = data.ends_at ? data.ends_at : variables.placeholders.endsAt;
				data.date = utils.getDate(data.ends_at);
				data.milliseconds = new Date(data.ends_at).getTime();
				data.amounts = utils.getAmounts(data);
				data.links = [
					{
						label: `Participate at ${campaign.username}`,
						url: `${variables.urls.tiltify}${campaign.url}`,
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

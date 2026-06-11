/* Packages */
import { QueryFunctionContext } from '@tanstack/react-query';

/* Scripts */
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

/* If the API returns an error (401, 404, etc.), throw an error to trigger retry logic in QueryClientProvider */
const throwError = (json: ResponseErrorType) => {
	if (json?.error) {
		const error = new Error(json.error.message || 'API Error');
		(error as RequestErrorType).status = json.error.status;
		throw error;
	}
};

export const requests: RequestsType = {
	campaign: async ({ queryKey }: QueryFunctionContext) => {
		// queryKey: ['campaign', campaign]
		const current = queryKey[1] as CampaignType;

		// Storage for campaign data
		let campaign = {} as CampaignType;

		// Fetch base campaign
		const response = await fetch(`${variables.api.teams}/${current.id}`, parameters.tiltify.options());
		const json = await response.json();

		// Check for API errors
		throwError(json);

		if (json && json.data) {
			// Add details to campaign data
			campaign = {
				...current,
				amounts: utils.getAmounts(json.data),
				key: `campaign-${current.id.split('-')[0]}-0`,
			};
		}

		return campaign;
	},
	donations: async ({ queryKey }: QueryFunctionContext) => {
		// queryKey: ['donations', campaign, supporting content]
		const current = queryKey[1] as CampaignType;
		const supporting = queryKey[2] as SupportingContentType;

		// Storage for donations data
		const donations = [] as DonationsType[];

		// Fetch base campaign
		const response = await fetch(`${variables.api.teams}/${current.id}/donations?limit=100`, parameters.tiltify.options());
		const json = await response.json();

		if (json && json.data) {
			// Add details to donations data
			json.data.forEach((data: DonationsRawType, index: number) => {
				// Format donations data
				const donationsData = {
					id: data.id,
					amounts: utils.getAmounts(data),
					comment: data?.donor_comment || false,
					from: data.donor_name,
					key: `donation-${data.id.split('-')[0]}-${index}`,
					links: [] as LinksType[],
					milliseconds: new Date(data.completed_at).getTime(),
				};

				// Build links for donations
				if (data?.campaign_id) {
					supporting.values.forEach((support) => {
						if (data.campaign_id == support.id) {
							donationsData.links.push({
								label: support.username,
								url: support.campaign,
							});
						}
					});
				} else {
					donationsData.links.push({
						label: current.name,
						url: variables.urls.campaign,
					});
				}

				donations.push(donationsData);
			});
		}

		return donations;
	},
	rewards: async ({ queryKey }: QueryFunctionContext) => {
		// queryKey: ['rewards', campaign, number]
		const current = queryKey[1] as CampaignType;
		const queryIndex = queryKey[2] as number;

		// Storage for rewards data
		const rewards = [] as RewardsType[];

		// Fetch base campaign
		const response = await fetch(`${variables.api.campaigns}/${current.id}/rewards?limit=100`, parameters.tiltify.options());
		const json = await response.json();

		if (json && json.data) {
			// Add details to rewards data
			json.data.forEach((data: RewardsRawType, index: number) => {
				const date = data.ends_at ? data.ends_at : variables.placeholders.endDate;

				// Format rewards data
				const rewardsData = {
					id: data.id,
					active: data.active,
					amounts: utils.getAmounts(data),
					date: utils.getDate(date),
					description: data?.description ?? '',
					key: `reward-${data.id.split('-')[0]}-${queryIndex}-${index}`,
					milliseconds: new Date(date).getTime(),
					name: data.name,
					remaining: data?.quantity_remaining && typeof data.quantity_remaining == 'number' ? data.quantity_remaining : 0,
					username: current.name,
					links: [
						{
							label: `Redeem at ${current.name}`,
							url: current.campaign,
						},
					],
				};

				// Re-check active state
				rewardsData.active = utils.setActive('rewards', rewardsData);

				rewards.push(rewardsData);
			});
		}

		return rewards;
	},
	supporting: async ({ queryKey }: QueryFunctionContext) => {
		// queryKey: ['supporting', campaign]
		const current = queryKey[1] as CampaignType;

		// Storage for supporting data
		const supporting = [] as SupportingType[];

		// Fetch base campaign
		const response = await fetch(`${variables.api.teams}/${current.id}/supporting_campaigns?limit=50`, parameters.tiltify.options());
		const json = await response.json();

		// Check for API errors
		throwError(json);

		if (json && json.data) {
			// Add details to supporting data
			json.data.forEach((data: SupportingRawType, index: number) => {
				const username = data.user.username.trim();
				const campaign = `${variables.urls.tiltify}${data.user.url}/${data.slug}`;

				// Format supporting data
				const supportingData = {
					id: data.id,
					amounts: utils.getAmounts(data),
					campaign: campaign,
					key: `supporting-${data.id.split('-')[0]}-${index}`,
					name: data.name,
					username: username,
					links: [
						{
							label: `Support ${username}`,
							url: campaign,
						},
					],
				};

				// If live stream is available, add if
				if (data?.livestream?.type == 'twitch') {
					supportingData.links.unshift({
						label: 'Watch stream',
						url: `https://${data.livestream.type}.tv/${data.livestream.channel}`,
					});
				}

				supporting.push(supportingData);
			});
		}

		return supporting;
	},
	targets: async ({ queryKey }: QueryFunctionContext) => {
		// queryKey: ['targets', campaign, number]
		const current = queryKey[1] as CampaignType;
		const queryIndex = queryKey[2] as number;

		// Storage for targets data
		const targets = [] as TargetsType[];

		// Fetch base campaign
		const response = await fetch(`${variables.api.campaigns}/${current.id}/targets?limit=100`, parameters.tiltify.options());
		const json = await response.json();

		if (json && json.data) {
			json.data.forEach((data: TargetsRawType, index: number) => {
				const date = data.ends_at ? data.ends_at : variables.placeholders.endDate;

				// Format targets data
				const targetsData = {
					id: data.id,
					active: data.active,
					amounts: utils.getAmounts(data),
					date: utils.getDate(date),
					description: data?.description ?? '',
					key: `target-${data.id.split('-')[0]}-${queryIndex}-${index}`,
					milliseconds: new Date(date).getTime(),
					name: data.name,
					username: current.name,
					links: [
						{
							label: `Participate at ${current.name}`,
							url: current.campaign,
						},
					],
				};

				// Re-check active state
				targetsData.active = utils.setActive('targets', targetsData);

				targets.push(targetsData);
			});
		}

		return targets;
	},
};

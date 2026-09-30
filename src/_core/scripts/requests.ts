/* Packages */
import type { QueryFunctionContext } from '@tanstack/react-query';

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
		const json = (await response.json()) as ResponseBodyType<AmountsRawType>;

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
		const json = (await response.json()) as ResponseBodyType<DonationsRawType[]>;

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
	milestones: async ({ queryKey }: QueryFunctionContext) => {
		// queryKey: ['milestones', campaign, number]
		const current = queryKey[1] as CampaignType;
		const queryIndex = queryKey[2] as number;

		// Storage for milestones data
		const milestones = [] as MilestonesType[];

		// Fetch base campaign
		const response = await fetch(`${variables.api.campaigns}/${current.id}/milestones?limit=100`, parameters.tiltify.options());
		const json = (await response.json()) as ResponseBodyType<MilestonesRawType[]>;

		if (json && json.data) {
			// Add details to milestones data
			json.data.forEach((data: MilestonesRawType, index: number) => {
				const date = variables.placeholders.endDate;

				// Format milestones data
				const milestonesData = {
					id: data.id,
					active: data.active,
					amounts: utils.getAmounts(data),
					date: utils.getDate(date),
					key: `milestone-${data.id.split('-')[0]}-${queryIndex}-${index}`,
					milliseconds: new Date(date).getTime(),
					name: data.name,
					username: current.name,
					links: [
						{
							label: `Contribute to ${current.name}`,
							url: current.campaign,
						},
					],
				};

				milestones.push(milestonesData);
			});
		}

		return milestones;
	},
	polls: async ({ queryKey }: QueryFunctionContext) => {
		// queryKey: ['polls', campaign, number]
		const current = queryKey[1] as CampaignType;
		const queryIndex = queryKey[2] as number;

		// Storage for polls data
		const polls = [] as PollsType[];

		// Fetch base campaign
		const response = await fetch(`${variables.api.campaigns}/${current.id}/polls?limit=100`, parameters.tiltify.options());
		const json = (await response.json()) as ResponseBodyType<PollsRawType[]>;

		if (json && json.data) {
			// Add details to polls data
			json.data.forEach((data: PollsRawType, index: number) => {
				const date = data.ends_at ? data.ends_at : variables.placeholders.endDate;

				// Format polls data
				const pollsData = {
					id: data.id,
					active: data.active,
					amounts: utils.getAmounts(data),
					date: utils.getDate(date),
					ends: data?.ends_at ? data.ends_at : undefined,
					key: `poll-${data.id.split('-')[0]}-${queryIndex}-${index}`,
					milliseconds: new Date(date).getTime(),
					name: data.name,
					username: current.name,
					links: [
						{
							label: `Vote at ${current.name}`,
							url: current.campaign,
						},
					],
				};

				// Re-check active state
				pollsData.active = utils.setActive('polls', pollsData);

				polls.push(pollsData);
			});
		}

		return polls;
	},
	rewards: async ({ queryKey }: QueryFunctionContext) => {
		// queryKey: ['rewards', campaign, number]
		const current = queryKey[1] as CampaignType;
		const queryIndex = queryKey[2] as number;

		// Storage for rewards data
		const rewards = [] as RewardsType[];

		// Fetch base campaign
		const response = await fetch(`${variables.api.campaigns}/${current.id}/rewards?limit=100`, parameters.tiltify.options());
		const json = (await response.json()) as ResponseBodyType<RewardsRawType[]>;

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
					ends: data?.ends_at ? data.ends_at : undefined,
					key: `reward-${data.id.split('-')[0]}-${queryIndex}-${index}`,
					milliseconds: new Date(date).getTime(),
					name: data.name,
					remaining: typeof data?.quantity_remaining == 'number' ? data.quantity_remaining : null, // null means unlimited
					starts: data?.starts_at ? data.starts_at : undefined,
					upcoming: data?.starts_at ? new Date(data.starts_at).getTime() > Date.now() : false,
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
		const json = (await response.json()) as ResponseBodyType<SupportingRawType[]>;

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
};

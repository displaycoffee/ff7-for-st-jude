/* Packages */
import { produce } from 'immer';

/* Scripts */
import { campaigns } from '../../_core/scripts/campaigns';

/* Get total of all previous campaigns */
let previousTotals = 0;
campaigns.previous.forEach((campaign) => {
	previousTotals += campaign.amounts.total_amount_raised;
});

/* Create state for app */
const initialState: ContentType = {
	totals: {
		amountRaised: 0,
		goal: 2000.0,
		totalRaised: previousTotals, // shown until the current campaign loads, then the reducer adds its amount
	},
	campaign: {
		fetched: false,
	},
	supporting: {
		fetched: false,
		values: [],
	},
	donations: {
		fetched: false,
		values: [],
	},
	rewards: {
		fetched: false,
		values: [],
	},
	targets: {
		fetched: false,
		values: [],
	},
};

export const content = {
	initialState,
	reducer: (state: ContentType, action: ContentActionType): ContentType => {
		// Every change to the fetched content goes through here, so all routes share the same rules
		return produce(state, (draft) => {
			// Donations, rewards and targets are only saved once supporting campaigns and the campaign are available
			const isReady = () => draft.supporting.fetched && draft.campaign.fetched;

			switch (action.type) {
				case 'supporting_loaded': {
					draft.supporting.fetched = true;
					draft.supporting.values = action.values;
					break;
				}
				case 'campaign_loaded': {
					draft.campaign = {
						...action.campaign,
						fetched: true,
					};
					break;
				}
				case 'donations_loaded': {
					if (isReady()) {
						draft.donations.fetched = true;
						draft.donations.values = action.values;
					}
					break;
				}
				case 'rewards_loaded': {
					if (isReady()) {
						draft.rewards.fetched = true;
						draft.rewards.values = action.values;
					}
					break;
				}
				case 'targets_loaded': {
					if (isReady()) {
						draft.targets.fetched = true;
						draft.targets.values = action.values;
					}
					break;
				}
				case 'content_reset': {
					action.keys.forEach((key) => {
						draft[key] = { fetched: false, values: [] };
					});
					break;
				}
			}

			// Totals come from the campaign, so keep them in step whenever it and the supporting campaigns are available
			if (isReady()) {
				const campaignDraft = draft.campaign as CampaignType;
				draft.totals.amountRaised = campaignDraft.amounts.total_amount_raised;
				draft.totals.goal = campaignDraft.amounts.goal;
				draft.totals.totalRaised = campaignDraft.amounts.total_amount_raised + previousTotals;
			}
		});
	},
};

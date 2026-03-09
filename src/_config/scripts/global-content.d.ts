/* Type definitions */
type Amounts = {
	amount: number;
	amount_raised: number;
	goal: number;
	total_amount_raised: number;
};

type AmountsUnformatted = {
	amount?: {
		value?: number;
	};
	amount_raised?: {
		value?: number;
	};
	goal?: {
		value?: number;
	};
	total_amount_raised?: {
		value?: number;
	};
};

type Campaign = {
	amounts: Amounts;
	campaign: string;
	date: string;
	id: string;
	key: string;
	links: Links[];
	name: string;
};

type CampaignContent = FetchedStatus | (FetchedStatus & Campaign);

type CampaignQueryKey = {
	queryKey: [string, Campaign];
};

type CampaignRequest = [Campaign, Statuses];

type Campaigns = {
	current: Campaign;
	previous: Campaign[];
};

type Content = {
	campaign: CampaignContent;
	donations: DonationsContent;
	rewards: RewardsContent;
	supporting: SupportingContent;
	targets: TargetsContent;
};

type Donations = {
	amounts: Amounts;
	comment: string | boolean;
	from: string;
	id: string;
	key: string;
	links: Links[];
	milliseconds: number;
};

type DonationsContent = FetchedStatus & { values: [] | Donations[] };

type DonationsQueryKey = {
	queryKey: [string, Campaign, SupportingContent];
};

type DonationsUnformatted = {
	id: string;
	campaign_id?: string;
	completed_at: string;
	donor_comment?: string;
	donor_name: string;
	slug: string;
	user: {
		username: string;
		url: string;
	};
} & AmountsUnformatted;

type DonationsRequest = [Donations[], Statuses];

type FetchedStatus = {
	fetched: boolean;
};

type Links = {
	label: string;
	url: string;
};

type QueryKey = [string, Campaign] | [string, Campaign, SupportingContent];

type Requests = {
	[key: string]: (args: any) => Promise<Supporting[] | Campaign | Donations[] | Rewards[] | Targets[]>;
};

type Rewards = {
	active: boolean;
	amounts: Amounts;
	date: string;
	description: string | boolean;
	id: string;
	key: string;
	links: Links[];
	milliseconds: number;
	name: string;
	remaining: number;
	username: string;
};

type RewardsContent = FetchedStatus & { values: [] | Rewards[] };

type RewardsQueryKey = {
	queryKey: [string, Campaign, number];
};

type RewardsUnformatted = {
	active: boolean;
	id: string;
	description?: string;
	ends_at?: string;
	name: string;
	quantity_remaining?: number;
} & AmountsUnformatted;

type RewardsRequest = [Rewards[], Statuses];

type Sort = ObjectPrimitive | { amounts: Amounts };

type Statuses = {
	fetched: boolean;
	pending: boolean;
	success: boolean;
};

type Supporting = {
	amounts: Amounts;
	campaign: string;
	id: string;
	key: string;
	links: Links[];
	name: string;
	username: string;
};

type SupportingContent = FetchedStatus & { values: [] | Supporting[] };

type SupportingQueryKey = {
	queryKey: [string, Campaign];
};

type SupportingUnformatted = {
	id: string;
	livestream?: {
		channel: string;
		type: string;
	};
	name: string;
	slug: string;
	user: {
		username: string;
		url: string;
	};
} & AmountsUnformatted;

type SupportingRequest = [Supporting[], Statuses];

type Targets = {
	active: boolean;
	amounts: Amounts;
	date: string;
	description: string | boolean;
	id: string;
	key: string;
	links: Links[];
	milliseconds: number;
	name: string;
	username: string;
};

type TargetsContent = FetchedStatus & { values: [] | Targets[] };

type TargetsQueryKey = {
	queryKey: [string, Campaign, number];
};

type TargetsUnformatted = {
	active: boolean;
	id: string;
	description?: string;
	ends_at?: string;
	name: string;
} & AmountsUnformatted;

type TargetsRequest = [Targets[], Statuses];

declare global {
	/* Declare global types */
	type AmountsType = Amounts;

	type AmountsUnformattedType = AmountsUnformatted;

	type CampaignType = Campaign;

	type CampaignQueryKeyType = CampaignQueryKey;

	type CampaignRequestType = CampaignRequest;

	type CampaignsType = Campaigns;

	type ContentType = Content;

	type DonationsType = Donations;

	type DonationsQueryKeyType = DonationsQueryKey;

	type DonationsRequestType = DonationsRequest;

	type DonationsUnformattedType = DonationsUnformatted;

	type LinksType = Links;

	type QueryKeyType = QueryKey;

	type RequestsType = Requests;

	type RewardsType = Rewards;

	type RewardsQueryKeyType = RewardsQueryKey;

	type RewardsRequestType = RewardsRequest;

	type RewardsUnformattedType = RewardsUnformatted;

	type SortType = Sort;

	type SupportingType = Supporting;

	type SupportingQueryKeyType = SupportingQueryKey;

	type SupportingRequestType = SupportingRequest;

	type SupportingUnformattedType = SupportingUnformatted;

	type TargetsType = Targets;

	type TargetsQueryKeyType = TargetsQueryKey;

	type TargetsRequestType = TargetsRequest;

	type TargetsUnformattedType = TargetsUnformatted;
}

/* Export global types */
export {};

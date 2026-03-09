/* Generic type definitions */
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

type Events = SyntheticEvent | Event;

type Links = {
	label: string;
	url: string;
};

type ObjectString = {
	[key: string]: string;
};

type ObjectPrimitive = {
	[key: string]: string | number | boolean;
};

type Sort = ObjectPrimitive | { amounts: Amounts };

/* Content type definitions */
type Campaign = {
	amounts: Amounts;
	campaign: string;
	date: string;
	id: string;
	key: string;
	links: Links[];
	name: string;
};

type CampaignContent = Fetched | (Fetched & Campaign);

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

type DonationsContent = Fetched & { values: [] | Donations[] };

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

type RewardsContent = Fetched & { values: [] | Rewards[] };

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

type Supporting = {
	amounts: Amounts;
	campaign: string;
	id: string;
	key: string;
	links: Links[];
	name: string;
	username: string;
};

type SupportingContent = Fetched & { values: [] | Supporting[] };

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

type TargetsContent = Fetched & { values: [] | Targets[] };

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

/* Request type definitions */
type Fetched = {
	fetched: boolean;
};

type QueryKey = [string, Campaign] | [string, Campaign, SupportingContent];

type Requests = {
	[key: string]: (args: any) => Promise<Supporting[] | Campaign | Donations[] | Rewards[] | Targets[]>;
};

type Statuses = {
	fetched: boolean;
	pending: boolean;
	success: boolean;
};

declare global {
	/* Declare global generic types */
	type AmountsType = Amounts;

	type AmountsUnformattedType = AmountsUnformatted;

	type EventsType = Events;

	type LinksType = Links;

	type ObjectStringType = ObjectString;

	type ObjectPrimitiveType = ObjectPrimitive;

	type SortType = Sort;

	/* Declare global content types */
	type CampaignType = Campaign;

	type CampaignQueryKeyType = CampaignQueryKey;

	type CampaignRequestType = CampaignRequest;

	type ContentType = Content;

	type DonationsType = Donations;

	type DonationsQueryKeyType = DonationsQueryKey;

	type DonationsRequestType = DonationsRequest;

	type DonationsUnformattedType = DonationsUnformatted;

	type RewardsType = Rewards;

	type RewardsQueryKeyType = RewardsQueryKey;

	type RewardsRequestType = RewardsRequest;

	type RewardsUnformattedType = RewardsUnformatted;

	type SupportingType = Supporting;

	type SupportingQueryKeyType = SupportingQueryKey;

	type SupportingRequestType = SupportingRequest;

	type SupportingUnformattedType = SupportingUnformatted;

	type TargetsType = Targets;

	type TargetsQueryKeyType = TargetsQueryKey;

	type TargetsRequestType = TargetsRequest;

	type TargetsUnformattedType = TargetsUnformatted;

	/* Declare global request types */
	type QueryKeyType = QueryKey;

	type RequestsType = Requests;
}

/* Export global types */
export {};

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
	links: Links[];
	name: string;
};

type CampaignContent = FetchedStatus | (FetchedStatus & Campaign);

type CampaignQueryKey = {
	queryKey: [string, CampaignType];
};

type CampaignRequest = [Campaign, Status];

type Campaigns = {
	current: Campaign;
	previous: Campaign[];
};

type Content = {
	campaign: CampaignContentType;
	donations: DonationsContentType;
	rewards: RewardsContentType;
	supporting: SupportingContentType;
	targets: TargetsContentType;
};

type Donations = {
	amounts: Amounts;
	comment: string | boolean;
	from: string;
	id: string;
	links: Links[];
	milliseconds: number;
};

type DonationsContent = FetchedStatus & { values: [] | Donations[] };

type DonationsQueryKey = {
	queryKey: [string, CampaignType, SupportingContentType];
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

type DonationsRequest = [Donations[], Status];

type Events = SyntheticEvent | Event;

type FetchedStatus = {
	fetched: boolean;
};

type FilterContent = {
	active: boolean;
	amounts: Amounts;
	milliseconds: number;
	quantity_remaining: number;
};

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

type QueryKey = [string, Campaign] | [string, Campaign, SupportingContent];

type Requests = {
	[key: string]: (args: any) => Promise<Supporting[] | Campaign | Donations[] | Rewards[] | Targets[]>;
};

type Rewards = {
	amounts: Amounts;
	date: string;
	description: string | boolean;
	id: string;
	milliseconds: number;
	name: string;
	links: Links[];
};

type RewardsContent = FetchedStatus & { values: [] | Rewards[] };

type RewardsQueryKey = {
	queryKey: [string, CampaignType];
};

type RewardsUnformatted = {
	id: string;
	description?: string;
	ends_at?: string;
	name: string;
} & AmountsUnformatted;

type RewardsRequest = [Rewards[], Status];

type Sort = ObjectPrimitive | { amounts: Amounts };

type Status = {
	fetched: boolean;
	pending: boolean;
	success: boolean;
};

type Supporting = {
	amounts: Amounts;
	campaign: string;
	id: string;
	links: Links[];
	name: string;
	username: string;
};

type SupportingContent = FetchedStatus & { values: [] | Supporting[] };

type SupportingQueryKey = {
	queryKey: [string, CampaignType];
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

type SupportingRequest = [Supporting[], Status];

type Targets = {
	amounts: Amounts;
	date: string;
	description: string | boolean;
	id: string;
	milliseconds: number;
	name: string;
	links: Links[];
};

type TargetsContent = FetchedStatus & { values: [] | Targets[] };

type TargetsQueryKey = {
	queryKey: [string, CampaignType];
};

type TargetsUnformatted = {
	id: string;
	description?: string;
	ends_at?: string;
	name: string;
} & AmountsUnformatted;

type TargetsRequest = [Targets[], Status];

declare global {
	/* Declare global types */
	type AmountsType = Amounts;

	type AmountsUnformattedType = AmountsUnformatted;

	type CampaignType = Campaign;

	type CampaignContentType = CampaignContent;

	type CampaignQueryKeyType = CampaignQueryKey;

	type CampaignRequestType = CampaignRequest;

	type CampaignsType = Campaigns;

	type ContentType = Content;

	type DonationsType = Donations;

	type DonationsContentType = DonationsContent;

	type DonationsQueryKeyType = DonationsQueryKey;

	type DonationsRequestType = DonationsRequest;

	type DonationsUnformattedType = DonationsUnformatted;

	type EventsType = Events;

	type FilterContentType = FilterContent;

	type LinksType = Links;

	type ObjectStringType = ObjectString;

	type ObjectPrimitiveType = ObjectPrimitive;

	type QueryKeyType = QueryKey;

	type RequestsType = Requests;

	type RewardsType = Rewards;

	type RewardsContentType = RewardsContent;

	type RewardsQueryKeyType = RewardsQueryKey;

	type RewardsRequestType = RewardsRequest;

	type RewardsUnformattedType = RewardsUnformatted;

	type SortType = Sort;

	type StatusType = Status;

	type SupportingType = Supporting;

	type SupportingContentType = SupportingContent;

	type SupportingQueryKeyType = SupportingQueryKey;

	type SupportingRequestType = SupportingRequest;

	type SupportingUnformattedType = SupportingUnformatted;

	type TargetsType = Targets;

	type TargetsContentType = TargetsContent;

	type TargetsQueryKeyType = TargetsQueryKey;

	type TargetsRequestType = TargetsRequest;

	type TargetsUnformattedType = TargetsUnformatted;

	/* Declare global prop types */
	type ObjectPrimitiveProps = ObjectPrimitive;
}

/* Export global types */
export {};

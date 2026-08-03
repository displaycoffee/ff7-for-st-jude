/// <reference types="vite/client" />

/* Packages */
import { QueryFunctionContext } from '@tanstack/react-query';

/* Generic type definitions */
type Amounts = {
	amount: number;
	amount_raised: number;
	goal: number;
	total_amount_raised: number;
};

type AmountsRaw = {
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
	[key: string]: Primitive;
};

type Primitive = string | number | boolean;

type Sort = ObjectPrimitive | { amounts: Amounts };

type Theme = {
	bps: {
		bp01: Primitive;
		bp02: Primitive;
		bp03: Primitive;
		bp04: Primitive;
	};
	colors: {
		color01: Primitive;
		color02: Primitive;
		color03: Primitive;
		color04: Primitive;
		color05: Primitive;
		color06: Primitive;
		color07: Primitive;
		color08: Primitive;
		color09: Primitive;
		color10: Primitive;
		color11: Primitive;
		color12: Primitive;
		color13: Primitive;
		color14: Primitive;
		color15: Primitive;
		color16: Primitive;
		color17: Primitive;
		color18: Primitive;
	};
	details: {
		[key: string]: {
			id: string;
			content: {
				header: string;
				name: string;
			};
			layout: {
				columns: string;
				top: boolean;
			};
			skeleton: {
				columns: number;
				paragraphs: number;
			};
			sort?: {
				field: string;
				direction: string;
			};
		};
	};
};

type Utils = {
	checkAmount: (number?: number) => number;
	checkArray: (array: unknown[]) => boolean;
	formatCurrency: (number: number) => string;
	getAmounts: (detail?: AmountsRaw) => Amounts;
	getDate: (time: string) => string;
	getLast: (value: string | string[], delimeter?: string) => string | number;
	handleize: (value: string) => string;
	isSticky: (element: HTMLElement | null, stickyClass: string) => void;
	scrollTo: (e?: Events, selector?: string, offset?: number) => void;
	setActive: (type: string, data: Rewards | Targets) => boolean;
	setAttributes: (element: HTMLElement, attributes: ObjectString) => void;
	sort: (list: Sort[], type: Primitive, field: string, direction: string) => Sort[];
	truncate: (string: string, limit: number) => string;
};

type Variables = {
	paths: {
		basename: string;
	};
	api: {
		campaigns: string;
		teams: string;
	};
	urls: {
		tiltify: string;
		team: string;
		campaign: string;
	};
	placeholders: {
		endDate: string;
		endDateReadable: string;
	};
};

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

type CampaignRequest = [Campaign, Statuses];

type Content = {
	totals: {
		amountRaised: number;
		goal: number;
		totalRaised: number;
	};
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

type DonationsRaw = {
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
} & AmountsRaw;

type DonationsRequest = [Donations[], Statuses];

type Rewards = {
	active: boolean;
	amounts: Amounts;
	date: string;
	description: string;
	id: string;
	key: string;
	links: Links[];
	milliseconds: number;
	name: string;
	remaining: number;
	username: string;
};

type RewardsContent = Fetched & { values: [] | Rewards[] };

type RewardsRaw = {
	active: boolean;
	id: string;
	description?: string;
	ends_at?: string;
	name: string;
	quantity_remaining?: number;
} & AmountsRaw;

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

type SupportingRaw = {
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
} & AmountsRaw;

type SupportingRequest = [Supporting[], Statuses];

type Targets = {
	active: boolean;
	amounts: Amounts;
	date: string;
	description: string;
	id: string;
	key: string;
	links: Links[];
	milliseconds: number;
	name: string;
	username: string;
};

type TargetsContent = Fetched & { values: [] | Targets[] };

type TargetsRaw = {
	active: boolean;
	id: string;
	description?: string;
	ends_at?: string;
	name: string;
} & AmountsRaw;

type TargetsRequest = [Targets[], Statuses];

/* Request type definitions */
type Fetched = {
	fetched: boolean;
};

type QueryKey = [string, Campaign] | [string, Campaign, SupportingContent];

type RequestError = Error & {
	status?: number;
};

type Requests = {
	campaign: (context: QueryFunctionContext) => Promise<Campaign>;
	donations: (context: QueryFunctionContext) => Promise<Donations[]>;
	rewards: (context: QueryFunctionContext) => Promise<Rewards[]>;
	supporting: (context: QueryFunctionContext) => Promise<Supporting[]>;
	targets: (context: QueryFunctionContex) => Promise<Targets[]>;
};

type ResponseError = Response & {
	error?: RequestError;
};

type Statuses = {
	fetched: boolean;
	pending: boolean;
	success: boolean;
};

declare global {
	/* Declare global generic types */
	type AmountsType = Amounts;

	type AmountsRawType = AmountsRaw;

	type EventsType = Events;

	type LinksType = Links;

	type ObjectStringType = ObjectString;

	type ObjectPrimitiveType = ObjectPrimitive;

	type PrimitiveType = Primitive;

	type SortType = Sort;

	type ThemeType = Theme;

	type UtilsType = Utils;

	type VariablesType = Variables;

	/* Declare global content types */
	type CampaignType = Campaign;

	type CampaignRequestType = CampaignRequest;

	type ContentType = Content;

	type DonationsType = Donations;

	type DonationsContentType = DonationsContent;

	type DonationsRequestType = DonationsRequest;

	type DonationsRawType = DonationsRaw;

	type RewardsType = Rewards;

	type RewardsRequestType = RewardsRequest;

	type RewardsRawType = RewardsRaw;

	type SupportingType = Supporting;

	type SupportingContentType = SupportingContent;

	type SupportingRequestType = SupportingRequest;

	type SupportingRawType = SupportingRaw;

	type TargetsType = Targets;

	type TargetsRequestType = TargetsRequest;

	type TargetsRawType = TargetsRaw;

	/* Declare global request types */
	type QueryKeyType = QueryKey;

	type RequestErrorType = RequestError;

	type RequestsType = Requests;

	type ResponseErrorType = ResponseError;
}

/* Export global types */
export {};

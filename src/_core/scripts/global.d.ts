/* Packages */
import type { QueryFunctionContext } from '@tanstack/react-query';
import type { SyntheticEvent } from 'react';
import type themeJson from '../tokens/theme.json';

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

type Site = {
	name: string;
	description: string;
	url: string;
};

type Target = {
	name: string;
	src: string;
	hasTabindex: boolean;
	isScript: boolean;
};

type Theme = {
	breakpoints: (typeof themeJson)['breakpoint'];
	colors: (typeof themeJson)['color'];
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
	setActive: (type: string, data: Polls | Rewards) => boolean;
	setAttributes: (element: HTMLElement, attributes: ObjectString) => void;
	sort: <T>(list: T[], getValue: (item: T) => Primitive, direction: 'asc' | 'desc') => T[];
	truncate: (string: string, limit: number) => string;
};

type Variables = {
	api: {
		campaigns: string;
		teams: string;
	};
	paths: {
		basename: string;
	};
	placeholders: {
		endDate: string;
		endDateReadable: string;
	};
	site: Site;
	urls: {
		tiltify: string;
		team: string;
		campaign: string;
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
	number: number;
};

type CampaignContent = Fetched | (Fetched & Campaign);

type CampaignRequest = [Campaign, Statuses];

type ContentAction =
	| { type: 'supporting_loaded'; values: Supporting[] }
	| { type: 'campaign_loaded'; campaign: Campaign }
	| { type: 'donations_loaded'; values: Donations[] }
	| { type: 'milestones_loaded'; values: Milestones[] }
	| { type: 'polls_loaded'; values: Polls[] }
	| { type: 'rewards_loaded'; values: Rewards[] }
	| { type: 'content_reset'; keys: ('donations' | 'milestones' | 'polls' | 'rewards')[] };

type Content = {
	totals: {
		amountRaised: number;
		goal: number;
		totalRaised: number;
	};
	campaign: CampaignContent;
	donations: DonationsContent;
	milestones: MilestonesContent;
	polls: PollsContent;
	rewards: RewardsContent;
	supporting: SupportingContent;
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

type Milestones = {
	active: boolean;
	amounts: Amounts;
	date: string;
	id: string;
	key: string;
	links: Links[];
	milliseconds: number;
	name: string;
	username: string;
};

type MilestonesContent = Fetched & { values: [] | Milestones[] };

type MilestonesRaw = {
	active: boolean;
	amount: {
		currency: string;
		value: string;
	};
	id: string;
	name: string;
} & AmountsRaw;

type MilestonesRequest = [Milestones[], Statuses];

type Polls = {
	active: boolean;
	amounts: Amounts;
	date: string;
	ends: string | undefined;
	id: string;
	key: string;
	links: Links[];
	milliseconds: number;
	name: string;
	username: string;
};

type PollsContent = Fetched & { values: [] | Polls[] };

type PollsRaw = {
	active: boolean;
	amount_raised: {
		currency: string;
		value: string;
	};
	id: string;
	ends_at?: string;
	goal: {
		currency: string;
		value: string;
	};
	name: string;
} & AmountsRaw;

type PollsRequest = [Polls[], Statuses];

type Rewards = {
	active: boolean;
	amounts: Amounts;
	date: string;
	description: string;
	ends: string | undefined;
	id: string;
	key: string;
	links: Links[];
	milliseconds: number;
	name: string;
	remaining: number | null;
	starts: string | undefined;
	upcoming: boolean;
	username: string;
};

type RewardsContent = Fetched & { values: [] | Rewards[] };

type RewardsRaw = {
	active: boolean;
	id: string;
	description?: string;
	ends_at?: string;
	name: string;
	quantity_remaining?: number | null;
	starts_at?: string;
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
	milestones: (context: QueryFunctionContext) => Promise<Milestones[]>;
	polls: (context: QueryFunctionContext) => Promise<Polls[]>;
	rewards: (context: QueryFunctionContext) => Promise<Rewards[]>;
	supporting: (context: QueryFunctionContext) => Promise<Supporting[]>;
};

type ResponseError = {
	error?: RequestError;
};

type ResponseBody<T = unknown> = ResponseError & {
	data?: T;
};

type Statuses = {
	fetched: boolean;
	pending: boolean;
	success: boolean;
};

declare global {
	// Declare global generic types
	type AmountsType = Amounts;

	type AmountsRawType = AmountsRaw;

	type EventsType = Events;

	type LinksType = Links;

	type ObjectStringType = ObjectString;

	type ObjectPrimitiveType = ObjectPrimitive;

	type PrimitiveType = Primitive;

	type SiteType = Site;

	type TargetType = Target;

	type ThemeType = Theme;

	type UtilsType = Utils;

	type VariablesType = Variables;

	// Declare global content types
	type CampaignType = Campaign;

	type CampaignRequestType = CampaignRequest;

	type ContentType = Content;

	type ContentActionType = ContentAction;

	type DonationsType = Donations;

	type DonationsContentType = DonationsContent;

	type DonationsRequestType = DonationsRequest;

	type DonationsRawType = DonationsRaw;

	type MilestonesType = Milestones;

	type MilestonesRequestType = MilestonesRequest;

	type MilestonesRawType = MilestonesRaw;

	type PollsType = Polls;

	type PollsRequestType = PollsRequest;

	type PollsRawType = PollsRaw;

	type RewardsType = Rewards;

	type RewardsRequestType = RewardsRequest;

	type RewardsRawType = RewardsRaw;

	type SupportingType = Supporting;

	type SupportingContentType = SupportingContent;

	type SupportingRequestType = SupportingRequest;

	type SupportingRawType = SupportingRaw;

	// Declare global request types
	type QueryKeyType = QueryKey;

	type RequestErrorType = RequestError;

	type RequestsType = Requests;

	type ResponseErrorType = ResponseError;

	type ResponseBodyType<T = unknown> = ResponseBody<T>;
}

/* Export global types */
export {};

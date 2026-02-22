/* Type definitions */
type Amounts = {
	amount: number;
	amount_raised: number;
	goal: number;
	total_amount_raised: number;
};

type AmountsValue = {
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
	amounts?: Amounts;
	date: string;
	id: string;
	links: Links[];
	name: string;
};

type Campaigns = {
	current: Campaign;
	previous: Campaign[];
};

type Content = {
	campaign: boolean | (ObjectPrimitive & { amounts: Amounts });
	supporting: boolean | ObjectPrimitive[];
	donations: boolean;
	rewards: boolean;
	targets: boolean;
};

type ContentCampaign = boolean | (ObjectPrimitive[] & { date?: string; links?: Links[] });

type ContentSupporting = boolean | ObjectPrimitive[];

type Events = SyntheticEvent | Event;

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

type Request = [ObjectPrimitive, Status];

type Sort = {
	[key: string]: string | number | boolean;
	amounts?: Record<string, number>;
};

type Status = {
	fetched: boolean;
	pending: boolean;
	success: boolean;
};

declare global {
	/* Declare global types */
	type AmountsType = Amounts;

	type AmountsValueType = AmountsValue;

	type CampaignType = Campaign;

	type CampaignsType = Campaigns;

	type ContentType = Content;

	type ContentCampaignType = ContentCampaign;

	type ContentSupportingType = ContentSupporting;

	type EventsType = Events;

	type FilterContentType = FilterContent;

	type LinksType = Links;

	type ObjectStringType = ObjectString;

	type ObjectPrimitiveType = ObjectPrimitive;

	type RequestType = Request;

	type SortType = Sort;

	type StatusType = Status;

	/* Declare global prop types */
	type ObjectPrimitiveProps = ObjectPrimitive;
}

/* Export global types */
export {};

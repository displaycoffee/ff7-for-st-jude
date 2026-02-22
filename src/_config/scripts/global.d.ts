/* Type definitions */
type Amounts = {
	amount?: number;
	amount_raised?: number;
	goal?: number;
	total_amount_raised?: number;
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
	links: CampaignLinks[];
	name: string;
};

type CampaignLinks = {
	label: string;
	url: string;
};

type Events = SyntheticEvent | Event;

type ObjectString = {
	[key: string]: string;
};

type ObjectPrimitive = {
	[key: string]: string | number | boolean;
};

declare global {
	/* Declare global types */
	type AmountsTYpe = Amounts;

	type AmountsValueType = AmountsValue;

	type CampaignType = Campaign;

	type EventsType = Events;

	type ObjectStringType = ObjectString;

	type ObjectPrimitiveType = ObjectPrimitive;

	/* Declare global prop types */
	type ObjectPrimitiveProps = ObjectPrimitive;
}

/* Export global types */
export {};

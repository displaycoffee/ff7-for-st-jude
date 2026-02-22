/* React */
import { QueryClient } from '@tanstack/react-query';

/* Type definitions */

type ContextDetails = {
	id: string;
	content: ObjectPrimitiveType;
	sort: boolean | ObjectPrimitiveType;
	layout: ObjectPrimitiveType;
	skeleton: ObjectPrimitiveType;
};

/* Export types */

export type ContextValuesType = {
	campaigns: CampaignsType;
	content: ContentType;
	queryClient: QueryClient;
	setContent: Dispatch;
	theme: {
		bps: ObjectPrimitiveType;
		details: {
			campaign: ContextDetails;
			donations: ContextDetails;
			previous: ContextDetails;
			rewards: ContextDetails;
			supporting: ContextDetails;
			targets: ContextDetails;
		};
	};
	utils: {
		[key: string]: Function;
	};
	variables: {
		[key: string]: ObjectPrimitiveType;
	};
};

/* Export prop types */
export type ContextProps = {
	children: ReactNode;
};

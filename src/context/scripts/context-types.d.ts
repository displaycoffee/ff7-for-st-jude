/* React */
import { QueryClient } from '@tanstack/react-query';

/* Export types */
export type ContextValuesType = {
	campaigns: {
		current: CampaignType;
		previous: CampaignType[];
	};
	content: {
		campaign: boolean;
		supporting: boolean;
		donations: boolean;
		rewards: boolean;
		targets: boolean;
	};
	queryClient: QueryClient;
	setContent: Dispatch;
	theme: {
		[key: string]: ObjectPrimitiveType;
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

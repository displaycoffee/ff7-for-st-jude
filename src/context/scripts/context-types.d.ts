/* React */
import { QueryClient } from '@tanstack/react-query';

/* Type definitions */
type ThemeDetails = {
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

/* Export types */
export type ContextValuesType = {
	campaigns: CampaignsType;
	content: ContentType;
	queryClient: QueryClient;
	theme: {
		bps: ObjectPrimitiveType;
		details: {
			campaign: ThemeDetails;
			donations: ThemeDetails;
			previous: ThemeDetails;
			rewards: ThemeDetails;
			supporting: ThemeDetails;
			targets: ThemeDetails;
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

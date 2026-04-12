/* React */
import { QueryClient } from '@tanstack/react-query';

/* Type definitions */
type ContextValues = {
	content: ContentType;
	setContent: React.Dispatch;
	campaigns: {
		current: Campaign;
		previous: Campaign[];
	};
	queryClient: QueryClient;
	theme: {
		bps: ObjectPrimitiveType;
		colors: ObjectPrimitiveType;
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
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: (...args: any[]) => any;
	};
	variables: {
		[key: string]: ObjectPrimitiveType;
	};
};

type Context = {
	children: ReactNode;
};

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
export type ContextValuesType = ContextValues;

/* Export prop types */
export type ContextProps = Context;

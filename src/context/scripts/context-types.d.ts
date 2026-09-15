/* Packages */
import type { QueryClient } from '@tanstack/react-query';
import type { Dispatch, ReactNode, SetStateAction } from 'react';

/* Type definitions */
type ContextValues = {
	content: ContentType;
	setContent: Dispatch<SetStateAction<ContentType>>;
	campaigns: {
		current: CampaignType;
		previous: CampaignType[];
	};
	queryClient: QueryClient;
	theme: ThemeType;
	utils: UtilsType;
	variables: VariablesType;
};

type Context = {
	children: ReactNode;
};

/* Export types */
export type ContextValuesType = ContextValues;

/* Export prop types */
export type ContextProps = Context;

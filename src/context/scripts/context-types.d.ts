/* Packages */
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

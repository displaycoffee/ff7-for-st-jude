/* React */
import { createContext } from 'react';
import { DefaultOptions, QueryClient, QueryClientProvider } from '@tanstack/react-query';

/* Local scripts */
import { ContextProps, ContextValuesType } from './scripts/context-types';
import { campaigns } from '../_config/scripts/campaigns';
import { theme } from '../_config/scripts/theme';
import { utils } from '../_config/scripts/utils';
import { variables } from '../_config/scripts/variables';

/* Query client for api */
const queryConfig: DefaultOptions = {
	queries: {
		gcTime: Infinity,
		retry: 2,
		staleTime: Infinity,
	},
};
const queryClient = new QueryClient({
	defaultOptions: queryConfig,
});

/* Create context */
export const Context = createContext({} as ContextValuesType);

/* Create Context.Provider wrapper */
export const ContextProvider = ({ children }: ContextProps) => {
	// Create state for app
	const content = {
		campaign: {
			fetched: false,
		},
		supporting: {
			fetched: false,
			values: [],
		},
		donations: {
			fetched: false,
			values: [],
		},
		rewards: {
			fetched: false,
			values: [],
		},
		targets: {
			fetched: false,
			values: [],
		},
	};

	// Set contact values
	const values: ContextValuesType = {
		campaigns,
		content: content,
		theme,
		utils,
		variables,
		queryClient,
	};

	return (
		<QueryClientProvider client={queryClient}>
			<Context.Provider value={values}>{children}</Context.Provider>
		</QueryClientProvider>
	);
};

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
		staleTime: Infinity,
		retryDelay: 500,
		retry: (failureCount: number, error: Error) => {
			const has401 = 'status' in error && error.status === 401 ? true : false;

			// Adding this for debugging... can possibly be removed later
			if (has401) {
				console.log(error, failureCount);
			}

			// Re-try if initial fetch gives a 401
			if (has401 && failureCount < 2) {
				return true;
			}
			return false;
		},
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

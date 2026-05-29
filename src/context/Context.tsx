/* Packages */
import { createContext, useState } from 'react';
import { DefaultOptions, QueryClient, QueryClientProvider } from '@tanstack/react-query';

/* Scripts */
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
		retryDelay: (attemptIndex: number) => (attemptIndex === 0 ? 200 : 1000),
		retry: (failureCount: number, error: RequestErrorType) => {
			const status = error?.status ? error.status : 9999;

			// Only retry for 401s (the intermittent issue)
			if (status === 401 && failureCount < 2) {
				console.warn(`Retry attempt ${failureCount + 1} for status: ${status}`);
				return true;
			}

			// Don't retry for 404s or other permanent errors
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
	const contentConfig: ContentType = {
		totals: {
			amountRaised: 3011.68,
			goal: 3000.0,
			totalRaised: 53881.81,
		},
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

	// Set content state
	const [content, setContent] = useState(contentConfig);

	// Set contact values
	const values: ContextValuesType = {
		content,
		setContent,
		campaigns,
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

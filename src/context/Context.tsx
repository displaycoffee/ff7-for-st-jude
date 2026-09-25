/* Packages */
import type { DefaultOptions } from '@tanstack/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createContext, useReducer, useState } from 'react';

/* Scripts */
import type { ContextProps, ContextValuesType } from './scripts/context-types';
import { content as contentUtils } from './scripts/content';
import { campaigns } from '../_core/scripts/campaigns';
import { theme } from '../_core/scripts/theme';
import { utils } from '../_core/scripts/utils';
import { variables } from '../_core/scripts/variables';

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

/* Create Context wrapper */
export const ContextProvider = ({ children }: ContextProps) => {
	// Set content state
	const [content, dispatch] = useReducer(contentUtils.reducer, contentUtils.initialState);

	// Set colors panel state (shared by the button in navigation and the panel in the container)
	const [isColorsOpen, setIsColorsOpen] = useState(false);

	// Set contact values
	const values: ContextValuesType = {
		content,
		dispatch,
		isColorsOpen,
		setIsColorsOpen,
		campaigns,
		theme,
		utils,
		variables,
		queryClient,
	};

	return (
		<QueryClientProvider client={queryClient}>
			<Context value={values}>{children}</Context>
		</QueryClientProvider>
	);
};

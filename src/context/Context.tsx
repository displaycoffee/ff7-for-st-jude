/* React */
import { createContext, useState } from 'react';
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
		staleTime: Infinity,
		gcTime: Infinity,
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
	let [content, setContent] = useState({
		campaign: false,
		supporting: false,
		donations: false,
		rewards: false,
		targets: false,
	});

	const values: ContextValuesType = {
		campaigns,
		theme,
		utils,
		variables,
		queryClient,
		content: content,
		setContent: setContent,
	};

	return (
		<QueryClientProvider client={queryClient}>
			<Context.Provider value={values}>{children}</Context.Provider>
		</QueryClientProvider>
	);
};

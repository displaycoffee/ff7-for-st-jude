/* React */
import { useEffect, useId, useState } from 'react';
import { QueryFunction, useQuery, useQueries } from '@tanstack/react-query';

/* Local scripts */
import { requests } from './requests';
import { utils } from './utils';

export const useFormattedId = () => {
	// Updates the format of useId hook
	const id = useId();
	return id.slice(1, -1).replace(/^_|_$/g, '').replace(/_/g, '-');
};

export const useReactQuery = (key: string, content: ContentType, current: CampaignType) => {
	// Get donations data if supporting is available and if not in cache or if totals have changed
	const { campaign, donations, supporting } = content;

	// Set initial variables
	let hasData = false;
	let requestData = false;
	let queryKey = [key, current] as QueryKeyType;

	// Update variables per key type
	if (key == 'campaign') {
		requestData = !campaign.fetched;
	} else if (key == 'donations') {
		hasData = supporting.fetched && supporting.values.length !== 0;
		requestData = hasData && !donations.fetched;
		queryKey = [key, current, supporting] as QueryKeyType;
	} else if (key == 'supporting') {
		requestData = !supporting.fetched;
	}

	// Create query request
	const {
		data: data,
		isPending: isPending,
		isSuccess: isSuccess,
		isFetched: isFetched,
	} = useQuery({
		queryKey: queryKey,
		queryFn: requests[key as keyof RequestsType] as QueryFunction,
		enabled: requestData,
	});

	// Set fetched data without modifications
	let fetchedData = data;

	if (key == 'supporting') {
		// Set initial supporting data
		const supportingData = data as SupportingType[];

		// Re-sort supporting data
		const sortedData =
			supportingData && supportingData.length !== 0 ? utils.sort(data as SortType[], 'integer', 'total_amount_raised', 'desc') : [];

		// Set fetched data after sorting
		fetchedData = sortedData as SupportingType[];
	}

	return [fetchedData, { fetched: isFetched, pending: isPending, success: isSuccess }];
};

export const useReactQueries = (key: string, content: ContentType) => {
	// Get data from multiple queries
	const { supporting } = content;
	const hasSupporting = supporting.fetched && supporting.values.length !== 0;
	const queryValues = hasSupporting ? supporting.values : [];

	const {
		data: data,
		isPending: isPending,
		isSuccess: isSuccess,
		isFetched: isFetched,
	} = useQueries({
		queries: queryValues.map((value, index) => ({
			queryKey: [key, value, index],
			queryFn: requests[key as keyof RequestsType] as QueryFunction,
		})),
		combine: (results) => {
			return {
				data: results.flatMap((result) => (result.data ? (result.data as []) : [])),
				isPending: results.map((result) => result.isPending),
				isSuccess: results.map((result) => result.isSuccess),
				isFetched: results.map((result) => result.isFetched),
			};
		},
	});

	// Helper function to check status
	const checkStatus = (statues: boolean[]) => statues.every((status) => status === statues[0]);

	// Check to see if every value in statuses are the same
	const checkPending = checkStatus(isPending);
	const checkSuccess = checkStatus(isSuccess);
	const checkFetched = checkStatus(isFetched);

	// Re-sort merged data
	const sortedData = data && data.length !== 0 ? utils.sort(data as SortType[], 'integer', 'milliseconds', 'asc') : [];
	return [sortedData, { fetched: checkFetched && isFetched[0], pending: checkPending && isPending[0], success: checkSuccess && isSuccess[0] }];
};

export const useRespond = (bp: number) => {
	const [match, setMatch] = useState(() => window.matchMedia(`(min-width: ${bp}px)`).matches);

	// Update match state on media change
	useEffect(() => {
		const mediaQuery = window.matchMedia(`(min-width: ${bp}px)`);
		const handler = (e: MediaQueryListEvent) => setMatch(e.matches);
		mediaQuery.addEventListener('change', handler);
		return () => mediaQuery.removeEventListener('change', handler);
	}, [bp]);

	return match;
};

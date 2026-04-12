/* React */
import { useEffect, useId, useState } from 'react';
import { QueryFunction, useQuery, useQueries } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';

/* Local scripts */
import { requests } from './requests';
import { utils } from './utils';

/* Variables for useBodyClass */
const bodyPrefix = 'page-';
const bodySelector = document.querySelector('body');
let previousPage = '';

export const useBodyClass = (defaultPrefix: string) => {
	const location = useLocation();

	useEffect(() => {
		if (!bodySelector) return;

		// Remove any previous body class
		bodySelector.classList.remove(`${bodyPrefix}${previousPage || defaultPrefix}`);

		// Update previous location path
		// Replace any body prefix, remove first slash, and replace any other slash with hyphen
		previousPage = location.pathname.replace(bodyPrefix, '').replace('/', '').replace(/\//g, '-');

		// Add new body class
		bodySelector.classList.add(`${bodyPrefix}${previousPage || defaultPrefix}`);
	}, [location, defaultPrefix]);

	return null;
};

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
		requestData = !campaign.fetched ? true : false;
	} else if (key == 'donations') {
		hasData = supporting.fetched && supporting.values.length !== 0 ? true : false;
		requestData = hasData && !donations.fetched ? true : false;
		queryKey = [key, current, supporting] as QueryKeyType;
	} else if (key == 'supporting') {
		requestData = !supporting.fetched ? true : false;
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
	const hasSupporting = supporting.fetched && supporting.values.length !== 0 ? true : false;
	const queryValues = hasSupporting ? supporting.values : [];

	const {
		data: data,
		pending: pending,
		success: success,
		fetched: fetched,
	} = useQueries({
		queries: queryValues.map((value, index) => ({
			queryKey: [key, value, index],
			queryFn: requests[key as keyof RequestsType] as QueryFunction,
		})),
		combine: (results) => {
			return {
				data: results.flatMap((result) => result.data as []),
				pending: results.map((result) => result.isPending),
				success: results.map((result) => result.isSuccess),
				fetched: results.map((result) => result.isFetched),
			};
		},
	});

	// Helper function to check status
	const checkStatus = (statues: boolean[]) => statues.every((status) => status === statues[0]);

	// Check to see if every value in statuses are the same
	const checkPending = checkStatus(pending);
	const checkSuccess = checkStatus(success);
	const checkFetched = checkStatus(fetched);

	// Re-sort merged data
	const sortedData = data && data.length !== 0 ? utils.sort(data as SortType[], 'integer', 'milliseconds', 'asc') : [];
	return [sortedData, { fetched: checkFetched && fetched[0], pending: checkPending && pending[0], success: checkSuccess && success[0] }];
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

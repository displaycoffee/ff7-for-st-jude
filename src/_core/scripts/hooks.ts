/* Packages */
import type { QueryFunction } from '@tanstack/react-query';
import { useQuery, useQueries } from '@tanstack/react-query';

/* Scripts */
import { requests } from './requests';
import { utils } from './utils';

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
		hasData = supporting.fetched;
		requestData = hasData && !donations.fetched;
		queryKey = [key, current, supporting] as QueryKeyType;
	} else if (key == 'supporting') {
		requestData = !supporting.fetched;
	}

	// Set query function
	const queryFn: QueryFunction<unknown, QueryKeyType> = requests[key as keyof RequestsType];

	// Create query request
	const {
		data: data,
		isPending: isPending,
		isSuccess: isSuccess,
		isFetched: isFetched,
	} = useQuery({
		queryKey: queryKey,
		queryFn: queryFn,
		enabled: requestData,
	});

	// Set fetched data without modifications
	let fetchedData = data;

	if (key == 'supporting') {
		// Set initial supporting data
		const supportingData = data as SupportingType[];

		// Re-sort supporting data
		const sortedData =
			supportingData && supportingData.length !== 0 ? utils.sort(supportingData, (item) => item.amounts.total_amount_raised, 'desc') : [];

		// Set fetched data after sorting
		fetchedData = sortedData;
	}

	return [fetchedData, { fetched: isFetched, pending: isPending, success: isSuccess }];
};

export const useReactQueries = (key: string, content: ContentType) => {
	// Get data from multiple queries
	const { supporting } = content;
	const hasSupporting = supporting.fetched && supporting.values.length !== 0;
	const queryValues = hasSupporting ? supporting.values : [];

	// Set query function
	const queryFn: QueryFunction<unknown> = requests[key as keyof RequestsType];

	const {
		data: data,
		isPending: isPending,
		isSuccess: isSuccess,
		isFetched: isFetched,
	} = useQueries({
		queries: queryValues.map((value, index) => ({
			queryKey: [key, value, index],
			queryFn: queryFn,
		})),
		combine: (results) => {
			return {
				data: results.flatMap((result) => (result.data ? (result.data as (MilestonesType | PollsType | RewardsType)[]) : [])),
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

	// Nothing to query yet if supporting hasn't loaded, and nothing to query at all if it loaded empty
	const waiting = !supporting.fetched;
	const noQueries = queryValues.length === 0;

	// Re-sort merged data by end date (milestones by amount instead, since they don't have an end date)
	const sortedData =
		data && data.length !== 0 ? utils.sort(data, (item) => (key == 'milestones' ? item.amounts.amount : item.milliseconds), 'asc') : [];
	return [
		sortedData,
		{
			fetched: !waiting && (noQueries || (checkFetched && isFetched[0])),
			pending: waiting || (!noQueries && checkPending && isPending[0]),
			success: !waiting && (noQueries || (checkSuccess && isSuccess[0])),
		},
	];
};

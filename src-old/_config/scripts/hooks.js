/* React */
import { useQuery, useQueries } from '@tanstack/react-query';

/* Local scripts */
import { requests } from './requests';
import { utils } from './utils';

export function useDonations(content, current) {
	// Get donations data if supporting is available and if not in cache or if totals have changed
	const { donations, supporting } = content;
	const key = 'donations';
	const hasSupporting = supporting && supporting.length !== 0 ? true : false;
	const requestData = hasSupporting && (!donations || (donations && utils.checkTotals(content))) ? true : false;
	const {
		data: data,
		isPending: isPending,
		isSuccess: isSuccess,
		isFetched: isFetched,
	} = useQuery({
		queryKey: [key, current, supporting],
		queryFn: requests.donations,
		enabled: requestData,
	});

	return [data, { pending: isPending, success: isSuccess, fetched: isFetched }];
}

export function useMultiQueries(content, key) {
	// Set request type
	let requestType = false;
	if (key == 'rewards') {
		requestType = requests.rewards;
	} else if (key == 'targets') {
		requestType = requests.targets;
	}

	// Get data from multiple queries
	const { supporting } = content;
	const hasSupporting = supporting && supporting.length !== 0 ? true : false;
	const {
		data: data,
		pending: pending,
		success: success,
		fetched: fetched,
	} = useQueries({
		queries:
			requestType && hasSupporting
				? supporting.map((result) => {
						return {
							queryKey: [key, result],
							queryFn: requestType,
						};
					})
				: [], // if supporting is undefined, an empty array will be returned
		combine: (results) => {
			return {
				data: results.map((result) => result.data),
				pending: results.some((result) => result.isPending),
				success: results.some((result) => result.isSuccess),
				fetched: results.some((result) => result.isFetched),
			};
		},
	});

	return [utils.merge(data), { pending: pending, success: success, fetched: fetched }];
}

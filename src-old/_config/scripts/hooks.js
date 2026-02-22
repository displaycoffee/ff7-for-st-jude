/* React */
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useQueries } from '@tanstack/react-query';

/* Local scripts */
import { requests } from './requests';
import { utils } from './utils';

/* Set pageCache to get previous page */
let pageCache = {
	previous: '',
};

export function useBodyClass(defaultPrefix) {
	const location = useLocation();
	const bodySelector = document.querySelector('body');
	const bodyPrefix = 'page-';
	const bodyDefault = defaultPrefix;

	useEffect(() => {
		// Remove any previous body class
		bodySelector.classList.remove(`${bodyPrefix}${pageCache.previous || bodyDefault}`);

		// Update previous location path
		// Replace any body prefix, remove first slash, and replace any other slash with hyphen
		pageCache.previous = location.pathname.replace(bodyPrefix, '').replace('/', '').replace(/\//g, '-');

		// Add new body class
		bodySelector.classList.add(`${bodyPrefix}${pageCache.previous || bodyDefault}`);
	}, [location]);

	return null;
}

export function useSupporting(content, current) {
	// Use query to get supporting campaigns
	const { supporting } = content;
	const key = 'supporting';
	const requestData = !supporting ? true : false;
	const {
		data: data,
		isPending: isPending,
		isSuccess: isSuccess,
		isFetched: isFetched,
	} = useQuery({
		queryKey: [key, current],
		queryFn: requests.supporting,
		enabled: requestData,
	});

	return [data, { pending: isPending, success: isSuccess, fetched: isFetched }];
}

export function useCampaign(content, current) {
	// Get campaign data if totals have changed or if not in cache
	const { campaign } = content;
	const key = 'campaign';
	const requestData = !campaign || (campaign && utils.checkTotals(content)) ? true : false;
	const {
		data: data,
		isPending: isPending,
		isSuccess: isSuccess,
		isFetched: isFetched,
	} = useQuery({
		queryKey: [key, current],
		queryFn: requests.campaign,
		enabled: requestData,
	});

	return [data, { pending: isPending, success: isSuccess, fetched: isFetched }];
}

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

export function useRespond(bp) {
	const rule = window.matchMedia(`(min-width: ${bp}px)`);
	let [match, setMatch] = useState(rule.matches);

	// Update match state on media change
	rule.onchange = (e) => {
		if (e.matches) {
			match = true;
		} else {
			match = false;
		}
		setMatch(match);
	};

	return match;
}

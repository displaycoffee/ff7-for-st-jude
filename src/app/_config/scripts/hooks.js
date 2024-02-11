/* React */
import { useState } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';

/* Local scripts */
import { requests } from './requests';
import { utils } from './utils';

export function useSupporting(content, current) {
	// Use query to get supporting campaigns
	const { supporting } = content;
	const key = 'supporting';
	const requestData = !supporting ? true : false;
	const { data: data, status: status } = useQuery({
		queryKey: [key, current],
		queryFn: requests.supporting,
		enabled: requestData,
	});

	return [data, status];
}

export function useCampaign(content, current) {
	// Get campaign data if totals have changed or if not in cache
	const { campaign } = content;
	const key = 'campaign';
	const requestData = !campaign || (campaign && utils.checkTotals(content)) ? true : false;
	const { data: data, status: status } = useQuery({
		queryKey: [key, current],
		queryFn: requests.campaign,
		enabled: requestData,
	});

	return [data, status];
}

export function useDonations(content, current) {
	// Get donations data if supporting is available and if not in cache or if totals have changed
	const { donations, supporting } = content;
	const key = 'donations';
	const hasSupporting = supporting && supporting.length !== 0 ? true : false;
	const requestData = hasSupporting && (!donations || (donations && utils.checkTotals(content))) ? true : false;
	const { data: data, status: status } = useQuery({
		queryKey: [key, current, supporting],
		queryFn: requests.donations,
		enabled: requestData,
	});

	return [data, status];
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
	const { data: data, status: status } = useQueries({
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
				data: results.map((result) => result.data).filter((result) => result),
				status: results
					.map((result, index) => {
						if (index == results.length - 1) {
							return result.status;
						}
					})
					.filter((result) => result)
					.pop(),
			};
		},
	});

	return [utils.merge(data), status];
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

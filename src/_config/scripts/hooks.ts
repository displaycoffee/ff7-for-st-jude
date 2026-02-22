/* React */
import { RefObject, useEffect, useRef, useState } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';

/* Local scripts */
import { requests } from './requests';
import { utils } from './utils';

/* Set pageCache to get previous page */
let pageCache = {
	previous: '',
};

export function useBodyClass(defaultPrefix: string) {
	const location = useLocation();
	const bodySelector = document.querySelector('body');
	const bodyPrefix = 'page-';
	const bodyDefault = defaultPrefix;

	if (bodySelector) {
		useEffect(() => {
			// Remove any previous body class
			bodySelector.classList.remove(`${bodyPrefix}${pageCache.previous || bodyDefault}`);

			// Update previous location path
			// Replace any body prefix, remove first slash, and replace any other slash with hyphen
			pageCache.previous = location.pathname.replace(bodyPrefix, '').replace('/', '').replace(/\//g, '-');

			// Add new body class
			bodySelector.classList.add(`${bodyPrefix}${pageCache.previous || bodyDefault}`);
		}, [location]);
	}

	return null;
}

export function useCampaign(content: ContentType, current: CampaignType) {
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

	return [data, { fetched: isFetched, pending: isPending, success: isSuccess }];
}

export const useClickOutside = (callback: Function) => {
	const clickRef: RefObject<HTMLDivElement | null> = useRef(null);

	// Determine if a click has been performed outside an element
	useEffect(() => {
		const handleClickOutside = (e: Event) => {
			if (clickRef.current && !clickRef.current.contains(e.target as Node)) {
				callback();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [clickRef, callback]);

	return clickRef;
};

export function useRespond(bp: number) {
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

export function useSupporting(content: ContentType, current: CampaignType) {
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

	return [data, { fetched: isFetched, pending: isPending, success: isSuccess }];
}

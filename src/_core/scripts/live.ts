/* Packages */
import type { QueryClient, QueryFunction, QueryKey } from '@tanstack/react-query';
import type { Dispatch } from 'react';
import { useCallback, useEffect, useRef } from 'react';

/* Scripts */
import { sortMerged, sortSupporting } from './hooks';
import { requests } from './requests';
import { utils } from './utils';
import { variables } from './variables';

/* Static variables */
const debounce = 1500; // Tiltify sends several events per donation, so wait for them to settle before refreshing

/* Refetch everything that has already loaded and update content in place, without going back to loading skeletons */
export const refreshContent = async (
	queryClient: QueryClient,
	content: ContentType,
	current: CampaignType,
	dispatch: Dispatch<ContentActionType>,
) => {
	// Content that hasn't loaded yet will fetch fresh data once its page mounts
	if (!content.campaign.fetched || !content.supporting.fetched) return;

	// Queries are cached forever, so staleTime: 0 forces a new request
	const fetchQuery = <T>(queryKey: QueryKey, queryFn: QueryFunction<T>) => queryClient.fetchQuery({ queryKey, queryFn, staleTime: 0 });

	const [campaignData, supportingData] = await Promise.all([
		fetchQuery(['campaign', current], requests.campaign),
		fetchQuery(['supporting', current], requests.supporting),
	]);

	// Matches what the reducer stores, so these query keys line up with the ones pages build from content
	const supporting = { fetched: true, values: sortSupporting(supportingData) };

	// Milestones, polls, and rewards are one query per supporting campaign, merged the same way useReactQueries does
	const fetchMerged = async <T extends MilestonesType | PollsType | RewardsType>(
		key: 'milestones' | 'polls' | 'rewards',
		queryFn: QueryFunction<T[]>,
	) => {
		const results = await Promise.all(supporting.values.map((value, index) => fetchQuery([key, value, index], queryFn)));
		return sortMerged(key, results.flat()) as T[];
	};

	// Fill the cache for the new keys before dispatching, so pages never render a key without data
	const [donationsData, milestonesData, pollsData, rewardsData] = await Promise.all([
		content.donations.fetched ? fetchQuery(['donations', current, supporting], requests.donations) : null,
		content.milestones.fetched ? fetchMerged('milestones', requests.milestones) : null,
		content.polls.fetched ? fetchMerged('polls', requests.polls) : null,
		content.rewards.fetched ? fetchMerged('rewards', requests.rewards) : null,
	]);

	dispatch({ type: 'supporting_loaded', values: supporting.values });
	if (utils.checkArray(Object.keys(campaignData))) dispatch({ type: 'campaign_loaded', campaign: campaignData });
	if (donationsData) dispatch({ type: 'donations_loaded', values: donationsData });
	if (milestonesData) dispatch({ type: 'milestones_loaded', values: milestonesData });
	if (pollsData) dispatch({ type: 'polls_loaded', values: pollsData });
	if (rewardsData) dispatch({ type: 'rewards_loaded', values: rewardsData });
};

/* Listen for Tiltify webhook events from the API and refresh content when something changes */
export const useLiveUpdates = (queryClient: QueryClient, content: ContentType, current: CampaignType, dispatch: Dispatch<ContentActionType>) => {
	// Keep the latest content in a ref so the connection doesn't reopen every time content changes
	const contentRef = useRef(content);
	useEffect(() => {
		contentRef.current = content;
	});

	// Only run one refresh at a time, and run once more if another was requested in the meantime
	const running = useRef(false);
	const queued = useRef(false);

	const refresh = useCallback(() => {
		if (running.current) {
			queued.current = true;
			return;
		}

		running.current = true;
		void (async () => {
			do {
				queued.current = false;

				try {
					await refreshContent(queryClient, contentRef.current, current, dispatch);
				} catch (error) {
					console.error('Error refreshing content:', error);
				}
			} while (queued.current);

			running.current = false;
		})();
	}, [queryClient, current, dispatch]);

	useEffect(() => {
		let timer: ReturnType<typeof setTimeout>;
		let connected = false;

		const queueRefresh = () => {
			clearTimeout(timer);
			timer = setTimeout(refresh, debounce);
		};

		// EventSource reconnects on its own if the connection drops
		const source = new EventSource(variables.api.events);
		source.addEventListener('update', queueRefresh);
		source.addEventListener('open', () => {
			// After a reconnect, refresh in case updates were missed while disconnected
			if (connected) queueRefresh();
			connected = true;
		});

		return () => {
			clearTimeout(timer);
			source.close();
		};
	}, [refresh]);

	return refresh;
};

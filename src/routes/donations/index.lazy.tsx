/* Packages */
import { createLazyFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

/* Scripts */
import { useReactQuery } from '../../_core/scripts/hooks';
import { useAppContext } from '../../context/scripts/context-hooks';

/* Components */
import { DonationsSection } from '../../components/donations-section/DonationsSection';

/* Static variables */
const timeout = false; // 60000 == one minute

export const Route = createLazyFileRoute('/donations/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaigns, utils, queryClient, content, dispatch } = useAppContext();
	const { supporting, campaign, donations } = content;
	const { current } = campaigns;

	// Use custom hook to get supporting campaigns
	const [supportingData, supportingStatus] = useReactQuery('supporting', content, current) as SupportingRequestType;

	// Use custom hook to get campaign
	const [campaignData] = useReactQuery('campaign', content, current) as CampaignRequestType;

	// Use custom hook to get donations
	const [donationsData, donationsStatus] = useReactQuery('donations', content, current) as DonationsRequestType;
	const donationsComplete = (!donationsStatus.pending && donationsStatus.success) || donationsStatus.fetched;

	useEffect(() => {
		// checkArray(data) would require a non-empty result, but a fresh campaign with no supporting
		// campaigns/donations yet legitimately returns an empty array - use each query's own success
		// status instead so that valid empty state still gets committed.
		const supportingUpdated = !supporting.fetched && supportingStatus.success && Array.isArray(supportingData);
		const campaignUpdated = !campaign.fetched && campaignData && utils.checkArray(Object.keys(campaignData));
		const donationsUpdated = !donations.fetched && donationsStatus.success && Array.isArray(donationsData);

		// Donations are only saved by the reducer once supporting campaigns and the campaign are available
		if (supportingUpdated) dispatch({ type: 'supporting_loaded', values: supportingData });
		if (campaignUpdated) dispatch({ type: 'campaign_loaded', campaign: campaignData });
		if (donationsUpdated) dispatch({ type: 'donations_loaded', values: donationsData });
	}, [
		utils,
		dispatch,
		supportingData,
		supportingStatus.success,
		supporting.fetched,
		campaignData,
		campaign.fetched,
		donationsData,
		donationsStatus.success,
		donations.fetched,
	]);

	useEffect(() => {
		if (timeout) {
			const interval = setInterval(() => {
				// Reset queries
				void queryClient.resetQueries({ queryKey: ['donations'] });

				// Reset and set content state
				dispatch({ type: 'content_reset', keys: ['donations'] });
			}, timeout);

			return () => {
				// Clear interval to prevent memory leaks
				clearInterval(interval);
			};
		}
	}, [queryClient, dispatch]);

	return <DonationsSection donations={donations} donationsComplete={donationsComplete} />;
}

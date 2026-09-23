/* Packages */
import type { Draft } from 'immer';
import { createLazyFileRoute } from '@tanstack/react-router';
import { produce } from 'immer';
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
	const { campaigns, utils, queryClient, content, setContent } = useAppContext();
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

		if (supportingUpdated || campaignUpdated || donationsUpdated) {
			setContent(
				produce((draft: Draft<ContentType>) => {
					// Update supporting
					if (supportingUpdated) {
						draft.supporting.fetched = true;
						draft.supporting.values = supportingData;
					}

					// Update campaign
					if (campaignUpdated) {
						draft.campaign = {
							...campaignData,
							fetched: true,
						};
					}

					if (draft.supporting.fetched && draft.campaign.fetched) {
						// Update donations
						if (donationsUpdated) {
							draft.donations.fetched = true;
							draft.donations.values = donationsData;
						}
					}
				}),
			);
		}
	}, [
		utils,
		setContent,
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
				setContent(
					produce((draft: Draft<ContentType>) => {
						draft.donations = { fetched: false, values: [] };
					}),
				);
			}, timeout);

			return () => {
				// Clear interval to prevent memory leaks
				clearInterval(interval);
			};
		}
	}, [queryClient, setContent]);

	return <DonationsSection donations={donations} donationsComplete={donationsComplete} />;
}

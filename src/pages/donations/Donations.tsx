/* Packages */
import { useEffect } from 'react';
import { produce, Draft } from 'immer';

/* Scripts */
import { useReactQuery } from '../../_config/scripts/hooks';
import { useAppContext } from '../../context/scripts/context-hooks';

/* Components */
import { DonationsSection } from '../../components/donations-section/DonationsSection';

/* Static variables */
const timeout = false; // 60000 == one minute

export const Donations = () => {
	const { campaigns, utils, queryClient, content, setContent } = useAppContext();
	const { supporting, campaign, donations } = content;
	const { current } = campaigns;

	// Use custom hook to get supporting campaigns
	const [supportingData] = useReactQuery('supporting', content, current) as SupportingRequestType;

	// Use custom hook to get campaign
	const [campaignData] = useReactQuery('campaign', content, current) as CampaignRequestType;

	// Use custom hook to get donations
	const [donationsData, donationsStatus] = useReactQuery('donations', content, current) as DonationsRequestType;
	const donationsComplete = (!donationsStatus.pending && donationsStatus.success) || donationsStatus.fetched;

	useEffect(() => {
		const supportingUpdated = !supporting.fetched && supportingData && utils.checkArray(supportingData);
		const campaignUpdated = !campaign.fetched && campaignData && utils.checkArray(Object.keys(campaignData));
		const donationsUpdated = !donations.fetched && donationsData && utils.checkArray(donationsData);

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
	}, [utils, setContent, supportingData, supporting.fetched, campaignData, campaign.fetched, donationsData, donations.fetched]);

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
};

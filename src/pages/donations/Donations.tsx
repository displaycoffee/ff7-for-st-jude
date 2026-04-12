/* React */
import { useContext, useEffect } from 'react';
import { produce, Draft } from 'immer';

/* Local scripts */
import { useReactQuery } from '../../_config/scripts/hooks';

/* Local components */
import { Context } from '../../context/Context';
import { Details, DetailsParagraph, DetailsLinks, DetailsNotFound } from '../../components/details/Details';
import { Skeleton } from '../../components/skeleton/Skeleton';

/* Static variables */
const timeout = false; // 60000 == one minute

export const Donations = () => {
	const context = useContext(Context);
	const { campaigns, utils, queryClient, content, setContent } = context;
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

	return (
		<Details header={'Donations'} hasRow={true} scrollLink={true}>
			<div className="row row-auto row-spacing-20 row-wrap">
				{donations.fetched && donations.values && donations.values.length !== 0
					? donations.values.map((donation) => {
							const { amount } = donation.amounts;

							return (
								<div className="column column-width-33" key={donation.key}>
									<div className="gradient-section">
										<p>
											<strong>Donation:</strong> {utils.formatCurrency(amount)} from <strong>{donation.from}</strong> to{' '}
											<DetailsLinks links={donation.links} wrapper={false} />
										</p>

										<DetailsParagraph label={'Comment'} content={donation.comment} />
									</div>
								</div>
							);
						})
					: null}

				{donationsComplete && donations.values.length === 0 ? (
					<DetailsNotFound type={'donations'} />
				) : (
					<Skeleton columns={15} perRow={3} paragraphs={2} />
				)}
			</div>
		</Details>
	);
};

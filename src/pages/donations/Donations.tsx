/* React */
import { useContext, useEffect } from 'react';

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
	let { campaigns, utils, queryClient, content } = context;
	let { supporting, campaign, donations } = content;
	const { current } = campaigns;

	// Use custom hook to get supporting campaigns
	const [supportingData, supportingStatus] = useReactQuery(content, current, 'supporting') as SupportingRequestType;
	const supportingComplete = (!supportingStatus.pending && supportingStatus.success) || supportingStatus.fetched ? true : false;

	// Use custom hook to get campaign
	const [campaignData, campaignStatus] = useReactQuery(content, current, 'campaign') as CampaignRequestType;
	const campaignComplete = (!campaignStatus.pending && campaignStatus.success) || campaignStatus.fetched ? true : false;

	// Set content for supporting
	if (supportingComplete && utils.checkArray(supportingData)) {
		supporting = { fetched: true, values: supportingData };
		content.supporting = supporting;
	}

	// Set content for campaign
	if (campaignComplete && campaignData && Object.keys(campaignData).length !== 0) {
		campaign = { ...campaignData, fetched: true };
		content.campaign = campaign;
	}

	// Use custom hook to get donations
	const [donationsData, donationsStatus] = useReactQuery(content, current, 'donations') as DonationsRequestType;
	const donationsComplete = (!donationsStatus.pending && donationsStatus.success) || donationsStatus.fetched ? true : false;

	// Set content state for dontations
	if (donationsComplete && utils.checkArray(donationsData)) {
		donations = { fetched: true, values: donationsData };
		content.donations = donations;
	}

	useEffect(() => {
		if (timeout) {
			const interval = setInterval(() => {
				// Reset and set content state
				content.donations = { fetched: false, values: [] };

				// Reset queries
				queryClient.resetQueries({ queryKey: ['donations'] });
			}, timeout);

			return () => {
				// Clear interval to prevent memory leaks
				clearInterval(interval);
			};
		}
	}, []);

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

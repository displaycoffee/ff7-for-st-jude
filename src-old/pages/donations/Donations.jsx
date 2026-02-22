/* React */
import { useContext, useEffect } from 'react';

/* Local scripts */
import { useCampaign, useDonations, useSupporting } from '../../_config/scripts/hooks';

/* Local components */
import { Context } from '../../context/Context';
import { Skeleton } from '../../components/skeleton/Skeleton';
import { Details, DetailsParagraph, DetailsLinks, DetailsNotFound } from '../../components/details/Details';

/* Set donations timeout (or false to disable) */
const timeout = false; // 60000 == one minute

export const Donations = () => {
	const context = useContext(Context);
	let { campaigns, utils, queryClient, content, setContent } = context;
	let { supporting, campaign, donations } = content;
	const { current } = campaigns;

	// Use custom hook to get supporting campaigns
	const [supportingData, supportingStatus] = useSupporting(content, current);
	const supportingComplete = (!supportingStatus.pending && supportingStatus.success) || supportingStatus.isFetched ? true : false;

	// Use custom hook to get campaign
	const [campaignData, campaignStatus] = useCampaign(content, current);
	const campaignComplete = (!campaignStatus.pending && campaignStatus.success) || campaignStatus.isFetched ? true : false;

	if (supportingComplete && campaignComplete) {
		// Update supporting
		supporting = utils.updateSupporting(supportingData);
		content.supporting = supporting;

		// Set team campaign (and add details)
		campaign = utils.updateCampaign(campaignData, campaigns);
		content.campaign = campaign;
	}

	// Use custom hook to get donations
	const [donationsData, donationsStatus] = useDonations(content, current);
	const dontationsComplete = (!donationsStatus.pending && donationsStatus.success) || donationsStatus.isFetched ? true : false;

	// Set donations
	if (dontationsComplete) {
		donations = utils.updateDonations(donationsData);
		content.donations = donations;
	}

	// Set content
	useEffect(() => {
		if (supportingComplete && campaignComplete && dontationsComplete) {
			setContent(content);
		}
	}, []);

	useEffect(() => {
		if (timeout) {
			const interval = setInterval(() => {
				// Reset and set content state
				content = { ...content, donations: false };
				setContent(content);

				// Reset queries
				queryClient.resetQueries({ queryKey: ['donations'] });
			}, timeout);

			return () => {
				clearInterval(interval);
			}; // Clear interval to prevent memory leaks
		}
	}, []);

	return (
		<>
			<Details header={'Donations'} hasRow={true} scrollLink={true}>
				<div className="row row-auto row-spacing-20 row-wrap">
					{donations
						? donations.map((donation) => {
								const { amount } = donation.amounts;

								return (
									<div className="column column-width-33" key={donation.id}>
										<div className="blue-section">
											{donation.amount ? (
												<p>
													<strong>Donation:</strong> {utils.formatCurrency(amount)} from{' '}
													<strong>{donation.donor_name}</strong> to <DetailsLinks links={donation?.links} wrapper={false} />
												</p>
											) : null}

											<DetailsParagraph label={'Comment'} content={donation?.donor_comment} />
										</div>
									</div>
								);
							})
						: null}

					{dontationsComplete && donations.length === 0 ? (
						<DetailsNotFound type={'donations'} />
					) : (
						<Skeleton columns={15} perRow={3} paragraphs={2} />
					)}
				</div>
			</Details>
		</>
	);
};

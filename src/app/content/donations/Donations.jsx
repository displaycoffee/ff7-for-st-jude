/* React */
import { useContext, useEffect } from 'react';

/* Local scripts */
import { useCampaign, useDonations, useSupporting } from '../../_config/scripts/hooks';

/* Local components */
import { Skeleton } from '../../shared/skeleton/Skeleton';
import { Context } from '../../entry/context/Context';
import { Details, DetailsParagraph, DetailsLinks, DetailsNotFound } from '../../shared/details/Details';

/* Set donations timeout (or false to disable) */
const timeout = false; // 60000 == one minute

export const Donations = () => {
	const context = useContext(Context);
	let { campaigns, utils, queryClient, content, setContent } = context;
	let { supporting, campaign, donations } = content;
	const { current } = campaigns;

	// Use custom hook to get supporting campaigns
	const [supportingData, supportingStatus] = useSupporting(content, current);

	// Use custom hook to get campaign
	const [campaignData, campaignStatus] = useCampaign(content, current);

	useEffect(() => {
		if (supportingStatus == 'success' && campaignStatus == 'success') {
			// Update supporting
			supporting = utils.updateSupporting(supportingData);

			// Set team campaign (and add details)
			campaign = utils.updateCampaign(campaignData, campaigns);

			// Set content state
			content = { ...content, supporting: supporting, campaign: campaign };
			setContent(content);
		}
	}, [supportingStatus, campaignStatus]);

	// Use custom hook to get donations
	const [donationsData, donationsStatus] = useDonations(content, current);

	useEffect(() => {
		if (donationsStatus == 'success') {
			// Set donations
			donations = utils.updateDonations(donationsData);

			// Set content state
			content = { ...content, donations: donations };
			setContent(content);
		}
	}, [donationsStatus]);

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
													<strong>Donation:</strong> ${amount.toFixed(2)} from {donation.donor_name} to{' '}
													<DetailsLinks links={donation?.links} wrapper={false} />
												</p>
											) : null}

											<DetailsParagraph label={'Comment'} content={donation?.donor_comment} />
										</div>
									</div>
								);
						  })
						: null}

					{donationsStatus == 'success' && donations.length === 0 ? (
						<DetailsNotFound type={'donations'} />
					) : (
						<Skeleton columns={15} perRow={3} paragraphs={2} />
					)}
				</div>
			</Details>
		</>
	);
};

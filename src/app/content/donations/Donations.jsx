/* React */
import { useContext, useState, useEffect } from 'react';

/* Local scripts */
import { useCampaign, useDonations, useSupporting } from '../../_config/scripts/hooks';

/* Local components */
import { Skeleton } from '../../shared/skeleton/Skeleton';
import { Context } from '../../entry/context/Context';
import { Details, DetailsParagraph, DetailsLinks, DetailsNotFound } from '../../shared/details/Details';

/* Set donations timeout (or false to disable) */
const timeout = false; // 60000 == one minute

export const Donations = (props) => {
	let { localCache } = props;
	const context = useContext(Context);
	const { campaigns, utils, queryClient } = context;
	const { current } = campaigns;

	// State variables
	let [supporting, setSupporting] = useState(false);
	let [campaign, setCampaign] = useState(false);
	let [donations, setDonations] = useState(false);

	// Use custom hook to get supporting campaigns
	const [supportingData, supportingStatus] = useSupporting(localCache, current);

	// Use custom hook to get campaign
	const [campaignData, campaignStatus] = useCampaign(localCache, current);

	useEffect(() => {
		if (supportingStatus == 'success' && campaignStatus == 'success') {
			// Update supporting
			localCache.supporting = utils.updateSupporting(supportingData, localCache);
			supporting = localCache.supporting;
			setSupporting(supporting);

			// Set team campaign (and add details)
			localCache.campaign = utils.updateCampaign(campaignData, localCache, campaigns);
			campaign = localCache.campaign;
			setCampaign(campaign);
		}
	}, [supportingStatus, campaignStatus]);

	// Use custom hook to get donations
	const [donationsData, donationsStatus] = useDonations(supporting, localCache, current);

	useEffect(() => {
		if (donationsStatus == 'success') {
			// Set donations
			localCache.donations = utils.checkArray(donationsData);
			localCache.donations = utils.sort(localCache.donations, 'integer', 'milliseconds', 'desc');
			donations = localCache.donations;
			setDonations(donations);
		}
	}, [donationsStatus]);

	useEffect(() => {
		if (timeout) {
			const interval = setInterval(() => {
				// Reset states
				localCache.donations = false;
				donations = localCache.donations;
				setDonations(donations);

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

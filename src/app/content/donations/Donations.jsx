/* React */
import { useContext, useState, useEffect } from 'react';

/* Local scripts */
import { requests } from '../../_config/scripts/requests';

/* Local components */
import { Skeleton } from '../../shared/skeleton/Skeleton';
import { Context } from '../../entry/context/Context';
import { Details, DetailsParagraph, DetailsLinks } from '../../shared/details/Details';

/* Set donations timeout (or false to disable) */
const timeout = false; // 60000 == one minute

/* Default object state for content details */
const defaultState = {
	data: false,
	loaded: false,
};

export const Donations = (props) => {
	let { localCache } = props;
	const context = useContext(Context);
	const { campaigns, utils } = context;

	// State variables
	let [supporting, setSupporting] = useState(false);
	let [campaign, setCampaign] = useState(false);
	let [donations, setDonations] = useState(defaultState);

	useEffect(() => {
		// Request campaign content on load
		requestDonations();
	}, []);

	async function requestDonations() {
		// Always get data of supporting campaigns to check if totals have changed
		localCache.supporting = await requests.supporting(campaigns.current);

		// Set supporting campaigns
		supporting = localCache.supporting;
		setSupporting(supporting);

		// Get campaign data if totals have changed or if not in cache
		const totalsChanged = (localCache.campaign && utils.checkTotals(localCache)) || !localCache.campaign ? true : false;
		if (totalsChanged) {
			localCache.campaign = await requests.campaign(campaigns.current);
		}

		// Set team campaign (and add details)
		campaign = utils.updateCampaign(localCache, campaigns);
		setCampaign(campaign);

		if (totalsChanged || (!totalsChanged && !localCache.donations)) {
			// Initially add donations into cache (these can be fetched from the team campaign)
			localCache.donations = await requests.donations(campaigns.current, supporting);
		}

		// Set donations
		localCache.donations = utils.checkArray(localCache.donations);
		localCache.donations = utils.sort(localCache.donations, 'integer', 'milliseconds', 'desc');
		donations = {
			data: localCache.donations,
			loaded: true,
		};
		setDonations(donations);
	}

	useEffect(() => {
		if (timeout) {
			const interval = setInterval(() => {
				// Partially reset localCache to get new details
				localCache.campaign = false;
				localCache.supporting = false;
				localCache.donations = false;

				// Reset states
				setDonations(defaultState);

				// Run requestDonations again
				requestDonations();
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
					{donations.data
						? donations.data.map((donation) => {
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

					{donations.loaded && donations.data.length === 0 ? (
						<ContentLoading type={'donations'} />
					) : (
						<Skeleton columns={6} perRow={3} paragraphs={2} />
					)}
				</div>
			</Details>
		</>
	);
};

export const ContentLoading = (props) => {
	const { type } = props;

	return (
		<div className="column column-width-100">
			<div className="blue-section">
				<p>No {type} found.</p>
			</div>
		</div>
	);
};

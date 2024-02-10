/* React */
import { useContext, useState, useEffect } from 'react';

/* Local styles */
import './styles/dashboard.scss';

/* Local scripts */
import { useCampaign, useDonations, useSupporting, useMultiQueries } from '../../_config/scripts/hooks';

/* Local components */
import { Skeleton } from '../../shared/skeleton/Skeleton';
import { Context } from '../../entry/context/Context';
import { Details, DetailsParagraph, DetailsLinks, DetailsNotFound } from '../../shared/details/Details';

export const Dashboard = (props) => {
	let { localCache } = props;
	const context = useContext(Context);
	const { campaigns, utils, queryClient, variables } = context;
	const { current } = campaigns;

	// State variables
	let [supporting, setSupporting] = useState(false);
	let [campaign, setCampaign] = useState(false);
	let [donations, setDonations] = useState(false);
	let [rewards, setRewards] = useState(false);
	let [targets, setTargets] = useState(false);

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

	// Use ustom hook to get rewards
	const [rewardsData, rewardsStatus] = useMultiQueries(supporting, 'rewards');

	// Use ustom hook to get targets
	const [targetsData, targetsStatus] = useMultiQueries(supporting, 'targets');

	useEffect(() => {
		if (donationsStatus == 'success') {
			// Set donations
			localCache.donations = utils.checkArray(donationsData);
			localCache.donations = utils.sort(localCache.donations, 'integer', 'milliseconds', 'desc');
			donations = localCache.donations;
			setDonations(donations);
		}

		if (rewardsStatus == 'success') {
			// Set rewards
			localCache.rewards = utils.checkArray(rewardsData);
			localCache.rewards = utils.sort(localCache.rewards, 'integer', 'milliseconds', 'asc');
			rewards = localCache.rewards;
			setRewards(rewards);
		}

		if (targetsStatus == 'success') {
			// Set targets
			localCache.targets = utils.checkArray(targetsData);
			localCache.targets = utils.sort(localCache.targets, 'integer', 'milliseconds', 'asc');
			targets = localCache.targets;
			setTargets(targets);
		}
	}, [donationsStatus, rewardsStatus, targetsStatus]);

	return (
		<>
			<nav className="floating">
				<div className="blue-section">
					<ul className="floating-list unstyled">
						<li className="floating-list-item">
							<button className="pointer unstyled a" onClick={(e) => utils.scrollTo(e, '#details-donations')} type="button">
								Donations
							</button>
						</li>

						<li className="floating-list-item">
							<button className="pointer unstyled a" onClick={(e) => utils.scrollTo(e, '#details-rewards')} type="button">
								Rewards
							</button>
						</li>

						<li className="floating-list-item">
							<button className="pointer unstyled a" onClick={(e) => utils.scrollTo(e, '#details-targets')} type="button">
								Targets
							</button>
						</li>

						<li className="floating-list-item">
							<button
								className="pointer unstyled a"
								onClick={(e) => {
									// Refresh content
									e.preventDefault();

									// Reset states
									localCache.donations = false;
									donations = localCache.donations;
									setDonations(donations);
									localCache.rewards = false;
									rewards = localCache.rewards;
									setRewards(rewards);
									localCache.targets = false;
									targets = localCache.targets;
									setTargets(targets);

									// Reset queries
									queryClient.resetQueries({ queryKey: ['donations'] });
									queryClient.resetQueries({ queryKey: ['rewards'] });
									queryClient.resetQueries({ queryKey: ['targets'] });
								}}
								type="button"
							>
								Refresh
							</button>
						</li>
					</ul>
				</div>
			</nav>

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

			<Details header={'Rewards'} hasRow={true} scrollLink={true}>
				<div className="row row-auto row-spacing-20 row-wrap">
					{rewards
						? rewards.map((reward) => {
								const { amount } = reward?.amounts ? reward.amounts : false;

								return reward ? (
									<div className="column column-width-33" key={reward.id}>
										<div className="blue-section">
											<DetailsParagraph label={'Reward'} content={reward?.name} />

											<DetailsParagraph label={'Description'} content={reward?.description} />

											<DetailsParagraph label={'Cost'} content={`$${amount.toFixed(2)}`} />

											{reward.date && !reward.date.includes(variables.placeholders.endDateReadable) && (
												<p>
													<strong>Ends:</strong> {reward.date}
												</p>
											)}

											<DetailsLinks links={reward?.links} />
										</div>
									</div>
								) : null;
						  })
						: null}

					{rewardsStatus == 'success' && rewards.length === 0 ? (
						<DetailsNotFound type={'rewards'} />
					) : (
						<Skeleton columns={6} perRow={3} paragraphs={6} />
					)}
				</div>
			</Details>

			<Details header={'Targets'} hasRow={true} scrollLink={true}>
				<div className="row row-auto row-spacing-20 row-wrap">
					{targets
						? targets.map((target) => {
								const { amount_raised, amount } = target?.amounts ? target.amounts : false;

								return target ? (
									<div className="column column-width-33" key={target.id}>
										<div className="blue-section">
											<DetailsParagraph label={'Target'} content={target?.name} />

											<DetailsParagraph label={'Description'} content={target?.description} />

											<DetailsParagraph
												label={'Raised'}
												content={`$${amount_raised.toFixed(2)} out of $${amount.toFixed(2)}`}
											/>

											{target.date && !target.date.includes(variables.placeholders.endDateReadable) && (
												<p>
													<strong>Ends:</strong> {target.date}
												</p>
											)}

											<DetailsLinks links={target?.links} />
										</div>
									</div>
								) : null;
						  })
						: null}

					{targetsStatus == 'success' && targets.length === 0 ? (
						<DetailsNotFound type={'targets'} />
					) : (
						<Skeleton columns={6} perRow={3} paragraphs={5} />
					)}
				</div>
			</Details>
		</>
	);
};

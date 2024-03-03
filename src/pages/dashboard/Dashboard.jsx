/* React */
import { useContext, useEffect } from 'react';

/* Local styles */
import './styles/dashboard.scss';

/* Local scripts */
import { useCampaign, useDonations, useSupporting, useMultiQueries } from '../../_config/scripts/hooks';

/* Local components */
import { Context } from '../../entry/context/Context';
import { Skeleton } from '../../components/skeleton/Skeleton';
import { Details, DetailsParagraph, DetailsLinks, DetailsNotFound } from '../../components/details/Details';

export const Dashboard = () => {
	const context = useContext(Context);
	let { campaigns, utils, queryClient, variables, content, setContent } = context;
	let { supporting, campaign, donations, rewards, targets } = content;
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

	// Use ustom hook to get rewards
	const [rewardsData, rewardsStatus] = useMultiQueries(content, 'rewards');

	// Use ustom hook to get targets
	const [targetsData, targetsStatus] = useMultiQueries(content, 'targets');

	useEffect(() => {
		if (donationsStatus == 'success') {
			// Set donations
			donations = utils.updateDonations(donationsData);
			content = { ...content, donations: donations };
		}
		if (rewardsStatus == 'success') {
			// Set rewards
			rewards = utils.checkArray(rewardsData);
			rewards = utils.sort(rewards, 'integer', 'milliseconds', 'asc');
			content = { ...content, rewards: rewards };
		}
		if (targetsStatus == 'success') {
			// Set targets
			targets = utils.checkArray(targetsData);
			targets = utils.sort(targets, 'integer', 'milliseconds', 'asc');
			content = { ...content, targets: targets };
		}

		if (donationsStatus == 'success' || rewardsStatus == 'success' || targetsStatus == 'success') {
			// Set content state
			setContent(content);
		}
	}, [donationsStatus, rewardsStatus, targetsStatus]);

	return (
		<>
			<nav className="floating">
				<div className="blue-section">
					<ul className="floating-list unstyled">
						<li className="floating-list-item">
							<button className="pointer unstyled a" onClick={(e) => utils.scrollTo(e, '#details-donations', 100)} type="button">
								Donations
							</button>
						</li>

						<li className="floating-list-item">
							<button className="pointer unstyled a" onClick={(e) => utils.scrollTo(e, '#details-rewards', 100)} type="button">
								Rewards
							</button>
						</li>

						<li className="floating-list-item">
							<button className="pointer unstyled a" onClick={(e) => utils.scrollTo(e, '#details-targets', 100)} type="button">
								Targets
							</button>
						</li>

						<li className="floating-list-item">
							<button
								className="pointer unstyled a"
								onClick={(e) => {
									// Refresh content
									e.preventDefault();

									// Reset and set content state
									content = { ...content, donations: false, rewards: false, targets: false };
									setContent(content);

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

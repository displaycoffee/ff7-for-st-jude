/* React */
import { useContext, useEffect } from 'react';

/* Local styles */
import './styles/dashboard.scss';

/* Local scripts */
import { useCampaign, useDonations, useSupporting, useMultiQueries } from '../../_config/scripts/hooks';

/* Local components */
import { Context } from '../../context/Context';
import { Skeleton } from '../../components/skeleton/Skeleton';
import { Details, DetailsParagraph, DetailsLinks, DetailsNotFound } from '../../components/details/Details';

export const Dashboard = () => {
	const context = useContext(Context);
	let { campaigns, utils, queryClient, variables, content, setContent } = context;
	let { supporting, campaign, donations, rewards, targets } = content;
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

	// Use custom hook to get rewards
	const [rewardsData, rewardsStatus] = useMultiQueries(content, 'rewards');
	const rewardsComplete = (!rewardsStatus.pending && rewardsStatus.success) || rewardsStatus.isFetched ? true : false;

	// Set rewards
	if (rewardsComplete) {
		rewards = utils.checkArray(rewardsData);
		rewards = utils.sort(rewards, 'integer', 'milliseconds', 'asc');
		content.rewards = rewards;
	}

	// Use custom hook to get targets
	const [targetsData, targetsStatus] = useMultiQueries(content, 'targets');
	const targetsComplete = (!targetsStatus.pending && targetsStatus.success) || targetsStatus.isFetched ? true : false;

	// Set targets
	if (targetsComplete) {
		targets = utils.checkArray(targetsData);
		targets = utils.sort(targets, 'integer', 'milliseconds', 'asc');
		content.targets = targets;
	}

	// Set content
	useEffect(() => {
		if (supportingComplete && campaignComplete && (dontationsComplete || rewardsComplete || targetsComplete)) {
			setContent(content);
		}
	}, []);
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
									content.donations = false;
									content.rewards = false;
									content.targets = false;
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

											<DetailsParagraph label={'Cost'} content={utils.formatCurrency(amount)} />

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

					{rewardsComplete && rewards.length === 0 ? (
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
												content={`${utils.formatCurrency(amount_raised)} out of ${utils.formatCurrency(amount)}`}
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

					{targetsComplete && targets.length === 0 ? (
						<DetailsNotFound type={'targets'} />
					) : (
						<Skeleton columns={6} perRow={3} paragraphs={5} />
					)}
				</div>
			</Details>
		</>
	);
};

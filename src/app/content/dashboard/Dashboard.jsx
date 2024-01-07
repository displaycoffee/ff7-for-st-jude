/* React */
import { useContext, useState, useEffect } from 'react';

/* Local styles */
import './styles/dashboard.scss';

/* Local scripts */
import { requests } from '../../_config/scripts/requests';

/* Local components */
import { Skeleton } from '../../shared/skeleton/Skeleton';
import { Context } from '../../entry/context/Context';
import { Details, DetailsParagraph, DetailsLinks } from '../../shared/details/Details';

export const Dashboard = (props) => {
	let { localCache } = props;
	const context = useContext(Context);
	const { campaigns, utils, variables } = context;

	// State variables
	let [supporting, setSupporting] = useState(false);
	let [donations, setDonations] = useState(false);
	let [rewards, setRewards] = useState(false);
	let [rewardsLoaded, setRewardsLoaded] = useState(false);
	let [targets, setTargets] = useState(false);
	let [targetsLoaded, setTargetsLoaded] = useState(false);

	useEffect(() => {
		// Request campaign content on load
		requestContent();
	}, []);

	async function requestContent() {
		if (!localCache.supporting) {
			// Get data of supporting campaigns
			localCache.supporting = await requests.supporting(campaigns.current);
		}

		// Set supporting campaigns
		supporting = localCache.supporting;
		setSupporting(supporting);

		// Initially add donations into cache (these can be fetched from the team campaign)
		localCache.donations = await requests.donations(campaigns.current, supporting);

		// Set donations
		localCache.donations = utils.checkArray(localCache.donations);
		donations = localCache.donations;
		setDonations(donations);

		// Reset cache for content (rewards and targets)
		localCache.rewards = false;
		localCache.targets = false;

		// Loop through supporting to fetch content
		for (const support in supporting) {
			const supportData = supporting[support];

			// Set fetch array
			const contentFetch = [requests.rewards(supportData), requests.targets(supportData)];

			// Fetch content using promise
			await Promise.all(contentFetch)
				.then(([rewardsResponse, targetsResponse]) => {
					return [rewardsResponse, targetsResponse];
				})
				.then(([rewardsJson, targetsJson]) => {
					if (!localCache.rewards) {
						localCache.rewards = {};
					}
					if (!localCache.rewards[supportData.id]) {
						localCache.rewards[supportData.id] = rewardsJson;
					}
					if (!localCache.targets) {
						localCache.targets = {};
					}
					if (!localCache.targets[supportData.id]) {
						localCache.targets[supportData.id] = targetsJson;
					}
				});
		}

		// Set rewards
		localCache.rewards = localCache.rewards ? utils.merge(utils.flatten(localCache.rewards)) : false;
		localCache.rewards = utils.checkArray(localCache.rewards);
		rewards = localCache.rewards;
		setRewards(rewards);

		// Set loaded rewards state
		rewardsLoaded = true;
		setRewardsLoaded(rewardsLoaded);

		// Set targets
		localCache.targets = localCache.targets ? utils.merge(utils.flatten(localCache.targets)) : false;
		localCache.targets = utils.checkArray(localCache.targets);
		targets = localCache.targets;
		setTargets(targets);

		// Set loaded targets state
		targetsLoaded = true;
		setTargetsLoaded(targetsLoaded);
	}

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
									setRewardsLoaded(false);
									setTargetsLoaded(false);
									requestContent();
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
					{localCache.donations
						? utils.sort(localCache.donations, 'integer', 'milliseconds', 'desc').map((donation) => {
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

					<Skeleton columns={6} perRow={3} paragraphs={2} />
				</div>
			</Details>

			<Details header={'Rewards'} hasRow={true} scrollLink={true}>
				<div className="row row-auto row-spacing-20 row-wrap">
					{localCache.rewards
						? utils.sort(localCache.rewards, 'integer', 'milliseconds', 'asc').map((reward) => {
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

					{rewardsLoaded && !localCache.rewards ? (
						<div className="column column-width-100">
							<div className="blue-section">
								<p>No rewards found.</p>
							</div>
						</div>
					) : (
						<Skeleton columns={6} perRow={3} paragraphs={6} />
					)}
				</div>
			</Details>

			<Details header={'Targets'} hasRow={true} scrollLink={true}>
				<div className="row row-auto row-spacing-20 row-wrap">
					{localCache.targets
						? utils.sort(localCache.targets, 'integer', 'milliseconds', 'asc').map((target) => {
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

					{targetsLoaded && !localCache.targets ? (
						<div className="column column-width-100">
							<div className="blue-section">
								<p>No targets found.</p>
							</div>
						</div>
					) : (
						<Skeleton columns={6} perRow={3} paragraphs={5} />
					)}
				</div>
			</Details>
		</>
	);
};

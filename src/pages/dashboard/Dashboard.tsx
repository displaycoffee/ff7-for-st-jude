/* React */
import { useContext } from 'react';

/* Local styles */
import './styles/dashboard.scss';

/* Local scripts */
import { useReactQuery, useReactQueries } from '../../_config/scripts/hooks';

/* Local components */
import { Context } from '../../context/Context';
import { Details, DetailsParagraph, DetailsLinks, DetailsNotFound } from '../../components/details/Details';
import { Skeleton } from '../../components/skeleton/Skeleton';

/* Static variables */
const truncateLimit = 75;
const scrollToOffset = 100;

export const Dashboard = () => {
	const context = useContext(Context);
	let { campaigns, utils, variables, queryClient, content } = context;
	let { supporting, campaign, donations, rewards, targets } = content;
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

	// Use custom hook to get rewards
	const [rewardsData, rewardsStatus] = useReactQueries(content, 'rewards') as RewardsRequestType;
	const rewardsComplete = (!rewardsStatus.pending && rewardsStatus.success) || rewardsStatus.fetched ? true : false;

	// Use custom hook to get targets
	const [targetsData, targetsStatus] = useReactQueries(content, 'targets') as TargetsRequestType;
	const targetsComplete = (!targetsStatus.pending && targetsStatus.success) || targetsStatus.fetched ? true : false;

	// Set content state for dontations
	if (donationsComplete && utils.checkArray(donationsData)) {
		donations = { fetched: true, values: donationsData };
		content.donations = donations;
	}

	// Set content state for rewards
	if (rewardsComplete && utils.checkArray(rewardsData)) {
		rewards = { fetched: true, values: rewardsData };
		content.rewards = rewards;
	}

	// Set content state for targets
	if (targetsComplete && utils.checkArray(targetsData)) {
		targets = { fetched: true, values: targetsData };
		content.targets = targets;
	}
	return (
		<>
			<nav className="floating">
				<div className="blue-section">
					<ul className="floating-list unstyled">
						<li className="floating-list-item">
							<button
								className="pointer unstyled a"
								onClick={(e) => utils.scrollTo(e, '#details-donations', scrollToOffset)}
								type="button"
							>
								Donations
							</button>
						</li>

						<li className="floating-list-item">
							<button
								className="pointer unstyled a"
								onClick={(e) => utils.scrollTo(e, '#details-rewards', scrollToOffset)}
								type="button"
							>
								Rewards
							</button>
						</li>

						<li className="floating-list-item">
							<button
								className="pointer unstyled a"
								onClick={(e) => utils.scrollTo(e, '#details-targets', scrollToOffset)}
								type="button"
							>
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
									content.donations = { fetched: false, values: [] };
									content.rewards = { fetched: false, values: [] };
									content.targets = { fetched: false, values: [] };

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
					{donations.fetched && donations.values && donations.values.length !== 0
						? donations.values.map((donation) => {
								const { amount } = donation.amounts;

								return (
									<div className="column column-width-33" key={donation.key}>
										<div className="blue-section">
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

			<Details header={'Rewards'} hasRow={true} scrollLink={true}>
				<div className="row row-auto row-spacing-20 row-wrap">
					{rewards.fetched && rewards.values && rewards.values.length !== 0
						? rewards.values.map((reward) => {
								const { amount } = reward.amounts;
								const ended = !reward.date.includes(variables.placeholders.endDateReadable as string);

								return (
									<div className="column column-width-33" key={reward.key}>
										<div className={`blue-section${reward.active ? '' : ' inactive'}`}>
											<DetailsParagraph label={'Reward'} content={reward.name} />

											<DetailsParagraph label={'Description'} content={utils.truncate(reward.description, truncateLimit)} />

											{reward.active ? (
												<>
													<DetailsParagraph label={'Cost'} content={utils.formatCurrency(amount)} />

													{!ended ? null : <DetailsParagraph label={'Ends'} content={reward.date} />}

													<DetailsLinks links={reward.links} />
												</>
											) : (
												<p>
													<em>This reward from "{reward.username}" is no longer active.</em>
												</p>
											)}
										</div>
									</div>
								);
							})
						: null}

					{rewardsComplete && rewards.values.length === 0 ? (
						<DetailsNotFound type={'rewards'} />
					) : (
						<Skeleton columns={6} perRow={3} paragraphs={6} />
					)}
				</div>
			</Details>

			<Details header={'Targets'} hasRow={true} scrollLink={true}>
				<div className="row row-auto row-spacing-20 row-wrap">
					{targets.fetched && targets.values && targets.values.length !== 0
						? targets.values.map((target) => {
								const { amount_raised, amount } = target.amounts;
								const ended = !target.date.includes(variables.placeholders.endDateReadable as string);

								return (
									<div className="column column-width-33" key={target.key}>
										<div className={`blue-section${target.active ? '' : ' inactive'}`}>
											<DetailsParagraph label={'Target'} content={target.name} />

											<DetailsParagraph label={'Description'} content={utils.truncate(target.description, truncateLimit)} />

											<DetailsParagraph
												label={'Raised'}
												content={`${utils.formatCurrency(amount_raised)} out of ${utils.formatCurrency(amount)}`}
											/>

											{target.active ? (
												<>
													{!ended ? null : <DetailsParagraph label={'Ends'} content={target.date} />}

													<DetailsLinks links={target.links} />
												</>
											) : (
												<p>
													<em>This target from "{target.username}" is no longer active.</em>
												</p>
											)}
										</div>
									</div>
								);
							})
						: null}

					{targetsComplete && targets.values.length === 0 ? (
						<DetailsNotFound type={'targets'} />
					) : (
						<Skeleton columns={6} perRow={3} paragraphs={5} />
					)}
				</div>
			</Details>
		</>
	);
};

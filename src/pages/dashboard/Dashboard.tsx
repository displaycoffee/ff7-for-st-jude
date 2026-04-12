/* React */
import { useContext, useEffect } from 'react';
import { produce, Draft } from 'immer';

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
	const { campaigns, utils, variables, queryClient, content, setContent } = context;
	const { supporting, campaign, donations, rewards, targets } = content;
	const { current } = campaigns;

	// Use custom hook to get supporting campaigns
	const [supportingData] = useReactQuery('supporting', content, current) as SupportingRequestType;

	// Use custom hook to get campaign
	const [campaignData] = useReactQuery('campaign', content, current) as CampaignRequestType;

	// Use custom hook to get donations
	const [donationsData, donationsStatus] = useReactQuery('donations', content, current) as DonationsRequestType;
	const donationsComplete = (!donationsStatus.pending && donationsStatus.success) || donationsStatus.fetched;

	// Use custom hook to get rewards
	const [rewardsData, rewardsStatus] = useReactQueries('rewards', content) as RewardsRequestType;
	const rewardsComplete = (!rewardsStatus.pending && rewardsStatus.success) || rewardsStatus.fetched;

	// Use custom hook to get targets
	const [targetsData, targetsStatus] = useReactQueries('targets', content) as TargetsRequestType;
	const targetsComplete = (!targetsStatus.pending && targetsStatus.success) || targetsStatus.fetched;

	useEffect(() => {
		const supportingUpdated = !supporting.fetched && supportingData && utils.checkArray(supportingData);
		const campaignUpdated = !campaign.fetched && campaignData && utils.checkArray(Object.keys(campaignData));
		const donationsUpdated = !donations.fetched && donationsData && utils.checkArray(donationsData);
		const rewardsUpdated = !rewards.fetched && rewardsStatus.fetched && utils.checkArray(rewardsData);
		const targetsUpdated = !targets.fetched && targetsStatus.fetched && utils.checkArray(targetsData);

		if (supportingUpdated || campaignUpdated || donationsUpdated || rewardsUpdated || targetsUpdated) {
			setContent(
				produce((draft: Draft<ContentType>) => {
					// Update supporting
					if (supportingUpdated) {
						draft.supporting.fetched = true;
						draft.supporting.values = supportingData;
					}

					// Update campaign
					if (campaignUpdated) {
						draft.campaign = {
							...campaignData,
							fetched: true,
						};
					}

					if (draft.supporting.fetched && draft.campaign.fetched) {
						// Update donations
						if (donationsUpdated) {
							draft.donations.fetched = true;
							draft.donations.values = donationsData;
						}

						// Update rewards
						if (rewardsUpdated) {
							draft.rewards.fetched = true;
							draft.rewards.values = rewardsData;
						}

						// Update targets
						if (targetsUpdated) {
							draft.targets.fetched = true;
							draft.targets.values = targetsData;
						}
					}
				}),
			);
		}
	}, [
		utils,
		setContent,
		supportingData,
		supporting.fetched,
		campaignData,
		campaign.fetched,
		donationsData,
		donations.fetched,
		rewardsData,
		rewards.fetched,
		rewardsStatus.fetched,
		targetsData,
		targets.fetched,
		targetsStatus.fetched,
	]);

	return (
		<>
			<nav className="floating">
				<div className="gradient-section">
					<ul className="floating-list unstyled">
						<li className="floating-list-item">
							<button
								className="pointer unstyled a"
								type="button"
								aria-label="Donations Button"
								onClick={(e) => utils.scrollTo(e, '#details-donations', scrollToOffset)}
							>
								Donations
							</button>
						</li>

						<li className="floating-list-item">
							<button
								className="pointer unstyled a"
								type="button"
								aria-label="Rewards Button"
								onClick={(e) => utils.scrollTo(e, '#details-rewards', scrollToOffset)}
							>
								Rewards
							</button>
						</li>

						<li className="floating-list-item">
							<button
								className="pointer unstyled a"
								type="button"
								aria-label="Targets Button"
								onClick={(e) => utils.scrollTo(e, '#details-targets', scrollToOffset)}
							>
								Targets
							</button>
						</li>

						<li className="floating-list-item">
							<button
								className="pointer unstyled a"
								type="button"
								aria-label="Refresh Button"
								onClick={(e) => {
									// Refresh content
									e.preventDefault();

									// Reset queries
									void queryClient.resetQueries({ queryKey: ['donations'] });
									void queryClient.resetQueries({ queryKey: ['rewards'] });
									void queryClient.resetQueries({ queryKey: ['targets'] });

									// Content config for reset
									const contentConfig = { fetched: false, values: [] };

									// Reset and set content state
									setContent(
										produce((draft: Draft<ContentType>) => {
											draft.donations = contentConfig;
											draft.rewards = contentConfig;
											draft.targets = contentConfig;
										}),
									);
								}}
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

			<Details header={'Rewards'} hasRow={true} scrollLink={true}>
				<div className="row row-auto row-spacing-20 row-wrap">
					{rewards.fetched && rewards.values && rewards.values.length !== 0
						? rewards.values.map((reward) => {
								const { amount } = reward.amounts;
								const ended = !reward.date.includes(variables.placeholders.endDateReadable as string);

								return (
									<div className="column column-width-33" key={reward.key}>
										<div className={`gradient-section${reward.active ? '' : ' inactive'}`}>
											<DetailsParagraph label={'Reward'} content={reward.name} />

											<DetailsParagraph label={'Description'} content={utils.truncate(reward.description, truncateLimit)} />

											{reward.active ? (
												<>
													<DetailsParagraph label={'Cost'} content={utils.formatCurrency(amount)} />

													{!ended ? null : <DetailsParagraph label={'Ends'} content={reward.date} />}

													<DetailsLinks links={reward.links} />
												</>
											) : (
												<p className="no-longer-active">
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
										<div className={`gradient-section${target.active ? '' : ' inactive'}`}>
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
												<p className="no-longer-active">
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

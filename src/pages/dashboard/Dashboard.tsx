/* Styles */
import './styles/dashboard.scss';

/* Packages */
import { useEffect } from 'react';
import { produce, Draft } from 'immer';

/* Scripts */
import { useReactQuery, useReactQueries } from '../../_config/scripts/hooks';
import { useAppContext } from '../../context/scripts/context-hooks';

/* Components */
import { List, Section, SectionParagraph, SectionLinks, SectionNotFound, Skeleton } from '../../components/blocks/Blocks';
import { Button, ButtonScroll } from '../../components/forms/Forms';
import { DonationsSection } from '../../components/donations-section/DonationsSection';
import { ErrorBoundary } from '../../components/error-boundary/ErrorBoundary';

/* Static variables */
const truncateLimit = 75;
const scrollToOffset = 100;
const refreshableTypes = ['donations', 'rewards', 'targets'] as const;

export const Dashboard = () => {
	const { campaigns, utils, variables, queryClient, content, setContent } = useAppContext();
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
			<nav className="floating" aria-label="Dashboard Section Navigation">
				<div className="gradient-section">
					<List className={'floating-list'} variant={'ul-unstyled'}>
						<li className="floating-list-item">
							<ButtonScroll offset={scrollToOffset} target={'#section-donations'} label="Donations" />
						</li>

						<li className="floating-list-item">
							<ButtonScroll offset={scrollToOffset} target={'#section-rewards'} label="Rewards" />
						</li>

						<li className="floating-list-item">
							<ButtonScroll offset={scrollToOffset} target={'#section-targets'} label="Targets" />
						</li>

						<li className="floating-list-item">
							<Button
								label="Refresh"
								variant="link"
								onClick={(e) => {
									// Refresh content
									e.preventDefault();

									// Reset queries for each refreshable data type
									refreshableTypes.forEach((type) => {
										void queryClient.resetQueries({ queryKey: [type] });
									});

									// Reset content state for each refreshable data type
									setContent(
										produce((draft: Draft<ContentType>) => {
											refreshableTypes.forEach((type) => {
												draft[type] = { fetched: false, values: [] };
											});
										}),
									);
								}}
							/>
						</li>
					</List>
				</div>
			</nav>

			<DonationsSection donations={donations} donationsComplete={donationsComplete} />

			<ErrorBoundary message="Something went wrong loading rewards.">
				<Section title={'Rewards'} hasRow={true}>
					<p className="sr-only" role="status">
						{!rewardsComplete ? 'Loading rewards...' : utils.checkArray(rewards.values) ? 'Rewards loaded.' : ''}
					</p>

					<div className="row row-auto row-spacing-20 row-wrap">
						{rewards.fetched && utils.checkArray(rewards.values)
							? rewards.values.map((reward) => {
									const { amount } = reward.amounts;
									const ended = !reward.date.includes(variables.placeholders.endDateReadable);

									return (
										<div className="column column-width-33" key={reward.key}>
											<div className={`gradient-section${reward.active ? '' : ' inactive'}`}>
												<SectionParagraph label={'Reward'} content={reward.name} />

												<SectionParagraph label={'Description'} content={utils.truncate(reward.description, truncateLimit)} />

												{reward.active ? (
													<>
														<SectionParagraph label={'Cost'} content={utils.formatCurrency(amount)} />

														{!ended ? null : <SectionParagraph label={'Ends'} content={reward.date} />}

														<SectionLinks links={reward.links} />
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

						{!rewardsComplete ? (
							<Skeleton columns={6} perRow={3} paragraphs={6} />
						) : rewards.values.length === 0 ? (
							<SectionNotFound type={'rewards'} />
						) : null}
					</div>
				</Section>
			</ErrorBoundary>

			<ErrorBoundary message="Something went wrong loading targets.">
				<Section title={'Targets'} hasRow={true}>
					<p className="sr-only" role="status">
						{!targetsComplete ? 'Loading targets...' : utils.checkArray(targets.values) ? 'Targets loaded.' : ''}
					</p>

					<div className="row row-auto row-spacing-20 row-wrap">
						{targets.fetched && utils.checkArray(targets.values)
							? targets.values.map((target) => {
									const { amount_raised, amount } = target.amounts;
									const ended = !target.date.includes(variables.placeholders.endDateReadable);

									return (
										<div className="column column-width-33" key={target.key}>
											<div className={`gradient-section${target.active ? '' : ' inactive'}`}>
												<SectionParagraph label={'Target'} content={target.name} />

												<SectionParagraph label={'Description'} content={utils.truncate(target.description, truncateLimit)} />

												<SectionParagraph
													label={'Raised'}
													content={`${utils.formatCurrency(amount_raised)} out of ${utils.formatCurrency(amount)}`}
												/>

												{target.active ? (
													<>
														{!ended ? null : <SectionParagraph label={'Ends'} content={target.date} />}

														<SectionLinks links={target.links} />
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

						{!targetsComplete ? (
							<Skeleton columns={6} perRow={3} paragraphs={5} />
						) : targets.values.length === 0 ? (
							<SectionNotFound type={'targets'} />
						) : null}
					</div>
				</Section>
			</ErrorBoundary>
		</>
	);
};

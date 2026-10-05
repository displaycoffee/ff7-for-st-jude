/* Styles */
import './styles/dashboard.scss';

/* Packages */
import { createLazyFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

/* Scripts */
import { useReactQuery, useReactQueries } from '@/_core/scripts/hooks';
import { useAppContext } from '@/context/scripts/context-hooks';

/* Components */
import { PageTitle } from '@/components/page-title/PageTitle';
import { List, Section, SectionParagraph, SectionLinks, SectionNotFound, Skeleton } from '@/components/blocks/Blocks';
import { Button, ButtonScroll } from '@/components/forms/Forms';
import { DonationsSection } from '@/components/donations-section/DonationsSection';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';

/* Page title */
const title = 'Dashboard';

/* Static variables */
const truncateLimit = 75;
const scrollToOffset = 100;
const refreshableTypes = ['donations', 'milestones', 'polls', 'rewards'] as const;

export const Route = createLazyFileRoute('/dashboard/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { campaigns, utils, variables, queryClient, content, dispatch } = useAppContext();
	const { supporting, campaign, donations, milestones, polls, rewards } = content;
	const { current } = campaigns;

	// Use custom hook to get supporting campaigns
	const [supportingData, supportingStatus] = useReactQuery('supporting', content, current) as SupportingRequestType;

	// Everything below depends on supporting campaigns, so if that request failed they'll never be requested
	const supportingFailed = supportingStatus.fetched && !supportingStatus.success;

	// Use custom hook to get campaign
	const [campaignData] = useReactQuery('campaign', content, current) as CampaignRequestType;

	// Use custom hook to get donations
	const [donationsData, donationsStatus] = useReactQuery('donations', content, current) as DonationsRequestType;
	const donationsComplete = (!donationsStatus.pending && donationsStatus.success) || donationsStatus.fetched || supportingFailed;

	// Use custom hook to get milestones
	const [milestonesData, milestonesStatus] = useReactQueries('milestones', content) as MilestonesRequestType;
	const milestonesComplete = (!milestonesStatus.pending && milestonesStatus.success) || milestonesStatus.fetched || supportingFailed;

	// Use custom hook to get polls
	const [pollsData, pollsStatus] = useReactQueries('polls', content) as PollsRequestType;
	const pollsComplete = (!pollsStatus.pending && pollsStatus.success) || pollsStatus.fetched || supportingFailed;

	// Use custom hook to get rewards
	const [rewardsData, rewardsStatus] = useReactQueries('rewards', content) as RewardsRequestType;
	const rewardsComplete = (!rewardsStatus.pending && rewardsStatus.success) || rewardsStatus.fetched || supportingFailed;

	useEffect(() => {
		// checkArray(data) would require a non-empty result, but a fresh campaign with no supporting
		// campaigns joined yet legitimately returns empty arrays for all of these - use each query's
		// own success status instead so that valid empty state still gets committed.
		const supportingUpdated = !supporting.fetched && supportingStatus.success && Array.isArray(supportingData);
		const campaignUpdated = !campaign.fetched && campaignData && utils.checkArray(Object.keys(campaignData));
		const donationsUpdated = !donations.fetched && donationsStatus.success && Array.isArray(donationsData);
		const milestonesUpdated = !milestones.fetched && milestonesStatus.success && Array.isArray(milestonesData);
		const pollsUpdated = !polls.fetched && pollsStatus.success && Array.isArray(pollsData);
		const rewardsUpdated = !rewards.fetched && rewardsStatus.success && Array.isArray(rewardsData);

		// Donations, milestones, polls and rewards are only saved by the reducer once supporting campaigns and the campaign are available
		if (supportingUpdated) dispatch({ type: 'supporting_loaded', values: supportingData });
		if (campaignUpdated) dispatch({ type: 'campaign_loaded', campaign: campaignData });
		if (donationsUpdated) dispatch({ type: 'donations_loaded', values: donationsData });
		if (milestonesUpdated) dispatch({ type: 'milestones_loaded', values: milestonesData });
		if (pollsUpdated) dispatch({ type: 'polls_loaded', values: pollsData });
		if (rewardsUpdated) dispatch({ type: 'rewards_loaded', values: rewardsData });
	}, [
		utils,
		dispatch,
		supportingData,
		supportingStatus.success,
		supporting.fetched,
		campaignData,
		campaign.fetched,
		donationsData,
		donationsStatus.success,
		donations.fetched,
		milestonesData,
		milestones.fetched,
		milestonesStatus.success,
		pollsData,
		polls.fetched,
		pollsStatus.success,
		rewardsData,
		rewards.fetched,
		rewardsStatus.success,
	]);

	return (
		<>
			<PageTitle title={title} />

			<nav className="floating" aria-label="Dashboard Section Navigation">
				<div className="gradient-section">
					<List className={'floating-list'} variant={'ul-unstyled'}>
						<li className="floating-list-item">
							<ButtonScroll offset={scrollToOffset} target={'#section-donations'} label="Donations" />
						</li>

						<li className="floating-list-item">
							<ButtonScroll offset={scrollToOffset} target={'#section-milestones'} label="Milestones" />
						</li>

						<li className="floating-list-item">
							<ButtonScroll offset={scrollToOffset} target={'#section-polls'} label="Polls" />
						</li>

						<li className="floating-list-item">
							<ButtonScroll offset={scrollToOffset} target={'#section-rewards'} label="Rewards" />
						</li>

						<li className="floating-list-item">
							<Button
								label={'Refresh'}
								variant={'link'}
								onClick={(e) => {
									// Refresh content
									e.preventDefault();

									// Reset queries for each refreshable data type
									refreshableTypes.forEach((type) => {
										void queryClient.resetQueries({ queryKey: [type] });
									});

									// Reset content state for each refreshable data type
									dispatch({ type: 'content_reset', keys: [...refreshableTypes] });
								}}
							/>
						</li>
					</List>
				</div>
			</nav>

			<DonationsSection donations={donations} donationsComplete={donationsComplete} />

			<ErrorBoundary message={<p>Something went wrong loading milestones.</p>}>
				<Section title={'Milestones'} hasRow={true}>
					<p className="sr-only" role="status">
						{!milestonesComplete ? 'Loading milestones...' : utils.checkArray(milestones.values) ? 'Milestones loaded.' : ''}
					</p>

					<div className="row row-auto row-spacing-20 row-wrap">
						{milestones.fetched && utils.checkArray(milestones.values)
							? milestones.values.map((milestone) => {
									const { amount } = milestone.amounts;

									return (
										<div className="column column-width-33" key={milestone.key}>
											<div className={`gradient-section${milestone.active ? '' : ' inactive'}`}>
												<SectionParagraph label={'Milestone'} content={milestone.name} />

												{milestone.active ? (
													<>
														<SectionParagraph label={'Goal'} content={utils.formatCurrency(amount)} />

														<SectionParagraph label={'Ends'} content={milestone.date} />

														<SectionLinks links={milestone.links} />
													</>
												) : (
													<p className="no-longer-active">
														<em>This milestone is no longer active.</em>
													</p>
												)}
											</div>
										</div>
									);
								})
							: null}

						{!milestonesComplete ? (
							<Skeleton columns={6} perRow={3} paragraphs={6} />
						) : milestones.values.length === 0 ? (
							<SectionNotFound type={'milestones'} />
						) : null}
					</div>
				</Section>
			</ErrorBoundary>

			<ErrorBoundary message={<p>Something went wrong loading polls.</p>}>
				<Section title={'Polls'} hasRow={true}>
					<p className="sr-only" role="status">
						{!pollsComplete ? 'Loading polls...' : utils.checkArray(polls.values) ? 'Polls loaded.' : ''}
					</p>

					<div className="row row-auto row-spacing-20 row-wrap">
						{polls.fetched && utils.checkArray(polls.values)
							? polls.values.map((poll) => {
									const { amount_raised, goal } = poll.amounts;
									const ended = !poll.date.includes(variables.placeholders.endDateReadable);

									return (
										<div className="column column-width-33" key={poll.key}>
											<div className={`gradient-section${poll.active ? '' : ' inactive'}`}>
												<SectionParagraph label={'Poll'} content={poll.name} />

												<SectionParagraph
													label={'Raised'}
													content={`${utils.formatCurrency(amount_raised)}${goal > 0 ? ` out of ${utils.formatCurrency(goal)}` : ''}`}
												/>

												{poll.active ? (
													<>
														{!ended ? null : <SectionParagraph label={'Ends'} content={poll.date} />}

														<SectionLinks links={poll.links} />
													</>
												) : (
													<p className="no-longer-active">
														<em>This poll is no longer active.</em>
													</p>
												)}
											</div>
										</div>
									);
								})
							: null}

						{!pollsComplete ? (
							<Skeleton columns={6} perRow={3} paragraphs={5} />
						) : polls.values.length === 0 ? (
							<SectionNotFound type={'polls'} />
						) : null}
					</div>
				</Section>
			</ErrorBoundary>

			<ErrorBoundary message={<p>Something went wrong loading rewards.</p>}>
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
														<em>
															{reward.upcoming && reward.starts
																? `This reward starts ${utils.getDate(reward.starts)}.`
																: `This reward is no longer active.`}
														</em>
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
		</>
	);
}

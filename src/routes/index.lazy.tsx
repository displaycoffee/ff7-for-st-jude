/* Styles */
import './index/styles/index.scss';

/* Packages */
import { createLazyFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

/* Scripts */
import type { PreviousSortType, PreviousSortOptionsType } from './index/scripts/index-types';
import { useReactQuery } from '@/_core/scripts/hooks';
import { useAppContext } from '@/context/scripts/context-hooks';

/* Components */
import { LinkExternal, Section, SectionNotFound, SectionParagraph, SectionLinks, Skeleton } from '@/components/blocks/Blocks';
import { Button } from '@/components/forms/Forms';
import { Icon } from '@/components/icons/Icons';

/* Ways to sort previous campaigns */
/* Note: campaigns sort by number since the id is a random uuid */
const previousSortOptions: PreviousSortOptionsType = [
	{ by: 'number', label: 'Campaign' },
	{ by: 'amount', label: 'Amount' },
];

export const Route = createLazyFileRoute('/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { content, dispatch, campaigns, utils, variables } = useAppContext();
	const { supporting, campaign, totals } = content;
	const { current, previous } = campaigns;

	// Sort previous campaigns, newest first by default (the order they're listed in)
	const [previousSort, setPreviousSort] = useState<PreviousSortType>({ by: 'number', direction: 'desc' });
	const sortedPrevious = utils.sort(
		previous,
		(item) => (previousSort.by == 'number' ? item.number : item.amounts.total_amount_raised),
		previousSort.direction,
	);

	// Clicking the active sort flips its direction, clicking another sort switches to it (highest first)
	const handlePreviousSort = (by: PreviousSortType['by']) => {
		setPreviousSort((currentSort) => ({
			by: by,
			direction: currentSort.by == by && currentSort.direction == 'desc' ? 'asc' : 'desc',
		}));
	};

	// Use custom hook to get supporting campaigns
	const [supportingData, supportingStatus] = useReactQuery('supporting', content, current) as SupportingRequestType;
	const supportingComplete = (!supportingStatus.pending && supportingStatus.success) || supportingStatus.fetched;

	// Use custom hook to get campaign
	const [campaignData] = useReactQuery('campaign', content, current) as CampaignRequestType;

	useEffect(() => {
		const supportingUpdated = !supporting.fetched && supportingStatus.success && Array.isArray(supportingData);
		const campaignUpdated = !campaign.fetched && campaignData && utils.checkArray(Object.keys(campaignData));

		// Totals are worked out by the reducer whenever supporting campaigns and the campaign are loaded
		if (supportingUpdated) dispatch({ type: 'supporting_loaded', values: supportingData });
		if (campaignUpdated) dispatch({ type: 'campaign_loaded', campaign: campaignData });
	}, [utils, dispatch, supportingData, supportingStatus.success, supporting.fetched, campaignData, campaign.fetched]);

	return (
		<>
			<Section title={'Information'} hasScroll={false}>
				<p>
					Welcome to the {variables.site.name} speedrun event! Since December 2020, these events have been held twice per year, typically
					the last weekend of June and the 2nd weekend of December. The event is part of{' '}
					<LinkExternal href={'//www.stjude.org/get-involved/other-ways/video-game-charity-event.html'}>St. Jude PLAY LIVE</LinkExternal>,
					an organization for gamers to support <LinkExternal href={'//www.stjude.org'}>St. Jude Children's Research Hospital</LinkExternal>
					.
				</p>
				<p>
					We call this a race but it is important to know that the goal is not necessarily to finish first. The primary goals are to raise
					money for kids in need and have fun doing it. Using donation incentives to make the run more fun to watch may cost time but can
					help raise more money.
				</p>
				<p>
					In total, we have raised <strong>{utils.formatCurrency(totals.totalRaised)}</strong>.
				</p>
				<p className="mission-statement">
					The mission of St. Jude Children's Research Hospital is to advance cures, and means of prevention, for pediatric catastrophic
					diseases through research and treatment. Consistent with the vision of our founder Danny Thomas, no child is denied treatment
					based on race, religion or a family's ability to pay.
				</p>
			</Section>

			<Section title={'Current Campaign'} hasScroll={false}>
				<SectionParagraph label={'Name'} content={current.name} />

				<SectionParagraph label={'Date'} content={current.date} />

				<div className="level-bar-raised flex-nowrap">
					<strong>Raised:</strong>
					<div className="level-bar">
						<div className="level-bar-label">
							{utils.formatCurrency(totals.amountRaised)} out of {utils.formatCurrency(totals.goal)}
						</div>

						<div className="level-bar-outof">
							<div
								className="level-bar-progress"
								style={{
									width: totals.amountRaised && totals.goal ? `${(totals.amountRaised / totals.goal) * 100}%` : `0%`,
								}}
							></div>

							<div className="level-bar-shadow"></div>
						</div>
					</div>
				</div>

				<SectionLinks links={current.links} />
			</Section>

			<Section title={'Supporting Campaigns'} hasRow={true} hasScroll={false}>
				<div className="row row-auto row-spacing-20 row-wrap">
					{supporting.fetched && utils.checkArray(supporting.values)
						? supporting.values.map((support) => {
								const { total_amount_raised } = support.amounts;

								return (
									<div className="column column-width-50" key={support.key}>
										<div className="gradient-section">
											<SectionParagraph label={'Participant'} content={support.username} />

											<SectionParagraph label={'Campaign'} content={support.name} />

											<SectionParagraph label={'Raised'} content={utils.formatCurrency(total_amount_raised)} />

											<SectionLinks links={support.links} />
										</div>
									</div>
								);
							})
						: null}

					{!supportingComplete ? (
						<Skeleton columns={8} perRow={2} paragraphs={4} />
					) : supporting.values.length === 0 ? (
						<SectionNotFound type={'campaigns'} />
					) : null}
				</div>
			</Section>

			<Section title={'Previous Campaigns'} hasRow={true} hasScroll={false}>
				<div className="previous-sort">
					<span className="previous-sort-label" id="previous-sort-label">
						Sort by:
					</span>

					{previousSortOptions.map((option) => {
						const isActive = previousSort.by == option.by;
						const direction = previousSort.direction == 'asc' ? 'ascending' : 'descending';

						return (
							<Button
								key={option.by}
								className={`button-${direction}${isActive ? ' button-active' : ''}`}
								label={isActive ? `${option.label}, ${direction}` : option.label}
								hideLabel={true}
								variant={'link'}
								aria-describedby="previous-sort-label"
								aria-pressed={isActive}
								onClick={() => handlePreviousSort(option.by)}
							>
								<span className="button-label">{option.label}</span>
								<Icon id={'angle-down'} />
							</Button>
						);
					})}
				</div>

				<div className="row row-auto row-spacing-20 row-wrap">
					{sortedPrevious.map((campaign) => {
						const { total_amount_raised } = campaign.amounts;

						return (
							<div className="column column-width-50" key={campaign.key}>
								<div className="gradient-section">
									<SectionParagraph label={'Campaign'} content={campaign.name} />

									<SectionParagraph label={'Ends'} content={campaign.date} />

									<SectionParagraph label={'Raised'} content={utils.formatCurrency(total_amount_raised)} />

									<SectionLinks links={campaign.links} />
								</div>
							</div>
						);
					})}
				</div>
			</Section>
		</>
	);
}

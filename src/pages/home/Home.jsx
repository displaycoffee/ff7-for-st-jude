/* React */
import { useContext, useState, useEffect } from 'react';

/* Local styles */
import './styles/home.scss';

/* Local scripts */
import { useCampaign, useSupporting } from '../../_config/scripts/hooks';

/* Local components */
import { Context } from '../../entry/context/Context';
import { Details, DetailsParagraph, DetailsLinks } from '../../components/details/Details';
import { Skeleton } from '../../components/skeleton/Skeleton';

export const Home = () => {
	const context = useContext(Context);
	let { campaigns, utils, content, setContent } = context;
	let { supporting, campaign } = content;
	let { current, previous } = campaigns;

	// State variables
	let [amountRaised, setAmountRaised] = useState(0);
	let [goal, setGoal] = useState(0);
	let [totalRaised, setTotalRaised] = useState(0);

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

			// Set variables for progress bar
			amountRaised =
				campaign?.amounts?.total_amount_raised && campaign.amounts.total_amount_raised !== false ? campaign.amounts.total_amount_raised : 0;
			setAmountRaised(amountRaised);
			goal = campaign?.amounts?.goal && campaign.amounts.goal !== false ? campaign.amounts.goal : 0;
			setGoal(goal);

			// Reset totalRaised and get amount raised from all campaigns
			totalRaised = 0;
			previous.forEach((campaign) => {
				totalRaised += campaign.amounts.total_amount_raised;
			});
			if (amountRaised) {
				totalRaised += amountRaised;
			}
			setTotalRaised(totalRaised);
		}
	}, [supportingStatus, campaignStatus]);

	return (
		<>
			<Details header={'Information'}>
				<p>
					Welcome to the biannual FF7 for St. Jude speedrun event! Since December 2020, these events have been held twice per year,
					typically the last weekend of June and the 2nd weekend of December. The event is part of{' '}
					<a href="//www.stjude.org/get-involved/other-ways/video-game-charity-event.html" target="_blank" rel="noreferrer">
						St. Jude PLAY LIVE
					</a>
					, an organization for gamers to support{' '}
					<a href="//www.stjude.org" target="_blank" rel="noreferrer">
						St. Jude Children's Research Hospital
					</a>
					.
				</p>

				<p>
					We call this a race but it is important to know that the goal is not necessarily to finish first. The primary goals are to raise
					money for kids in need and have fun doing it. Using donation incentives to make the run more fun to watch may cost time but can
					help raise more money.
				</p>

				<p>
					In total, we have raised <strong>${totalRaised.toFixed(2)}</strong>.
				</p>

				<p className="mission-statement">
					The mission of St. Jude Children's Research Hospital is to advance cures, and means of prevention, for pediatric catastrophic
					diseases through research and treatment. Consistent with the vision of our founder Danny Thomas, no child is denied treatment
					based on race, religion or a family's ability to pay.
				</p>
			</Details>

			<Details header={'Current Campaign'}>
				<DetailsParagraph label={'Name'} content={current?.name} />

				<DetailsParagraph label={'Date'} content={current?.date} />

				<div className="level-bar-raised flex-nowrap">
					<strong>Raised:</strong>
					<div className="level-bar">
						<div className="level-bar-label">
							${amountRaised ? amountRaised.toFixed(2) : 'xxx.xx'} out of ${goal ? goal.toFixed(2) : 'xxxx.xx'}
						</div>

						<div className="level-bar-outof">
							<div
								className="level-bar-progress"
								style={{
									width: amountRaised && goal ? `${(amountRaised / goal) * 100}%` : `0%`,
								}}
							></div>

							<div className="level-bar-shadow"></div>
						</div>
					</div>
				</div>

				<DetailsLinks links={current?.links} />
			</Details>

			<Details header={'Supporting Campaigns'} hasRow={true}>
				<div className="row row-auto row-spacing-20 row-wrap">
					{supporting
						? supporting.map((support) => {
								const { total_amount_raised } = support.amounts;

								return (
									<div className="column column-width-50" key={support.id}>
										<div className="blue-section">
											<DetailsParagraph label={'Campaign'} content={support?.name} />

											<DetailsParagraph label={'Raised'} content={`$${total_amount_raised.toFixed(2)}`} />

											<DetailsLinks links={support?.links} />
										</div>
									</div>
								);
						  })
						: null}

					<Skeleton columns={8} perRow={2} paragraphs={4} />
				</div>
			</Details>

			<Details header={'Previous Campaigns'} hasRow={true}>
				<div className="row row-auto row-spacing-20 row-wrap">
					{previous.map((campaign) => {
						const { total_amount_raised } = campaign.amounts;

						return (
							<div className="column column-width-50" key={campaign.id}>
								<div className="blue-section">
									<DetailsParagraph label={'Campaign'} content={campaign?.name} />

									<DetailsParagraph label={'Ends'} content={campaign?.date} />

									<DetailsParagraph label={'Raised'} content={`$${total_amount_raised.toFixed(2)}`} />

									<DetailsLinks links={campaign?.links} />
								</div>
							</div>
						);
					})}
				</div>
			</Details>
		</>
	);
};

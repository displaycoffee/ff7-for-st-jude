/* React */
import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';

/* Local styles */
import './styles/index.scss';

/* Local scripts */
import { requests } from '../../_config/scripts/requests';

/* Local components */
import { Context } from '../../entry/context/Context';
import { Details, DetailsParagraph, DetailsLinks } from '../../shared/details/Details';
import { Skeleton } from '../../shared/skeleton/Skeleton';

export const Index = (props) => {
	let { requestParams } = props;
	const context = useContext(Context);
	const { campaigns } = context;
	let { current, previous } = campaigns;

	// Use query to get campaign data
	const { data: campaignQuery } = useQuery({
		queryKey: ['campaign', requestParams, current],
		queryFn: requests.campaign,
		enabled: !requestParams.campaign,
	});
	const campaignResults = campaignQuery && Object.keys(campaignQuery).length !== 0 ? campaignQuery : requestParams.campaign;
	current.amounts = campaignResults ? campaignResults.amounts : false;

	// Use query to get supporting campaigns
	const { data: supportingQuery } = useQuery({
		queryKey: ['supporting', requestParams, current],
		queryFn: requests.supporting,
		enabled: !requestParams.supporting,
	});
	const supportingResults = supportingQuery && supportingQuery.length !== 0 ? supportingQuery : requestParams.supporting;

	// Set variables for progress bar
	const amountRaised = campaignResults && current?.amounts?.total_amount_raised !== false ? current.amounts.total_amount_raised : false;
	const goal = campaignResults && current?.amounts?.goal !== false ? current.amounts.goal : false;

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
					{supportingResults
						? supportingResults.map((supporting) => {
								const { total_amount_raised } = supporting.amounts;

								return (
									<div className="column column-width-50" key={supporting.id}>
										<div className="blue-section">
											<DetailsParagraph label={'Campaign'} content={supporting?.name} />

											<DetailsParagraph label={'Raised'} content={`$${total_amount_raised.toFixed(2)}`} />

											<DetailsLinks links={supporting?.links} />
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

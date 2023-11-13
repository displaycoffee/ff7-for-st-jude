/* React */
import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';

/* Local styles */
import './styles/index.scss';

/* Local scripts */
import { requests } from '../../_config/scripts/requests';

/* Local components */
import { Context } from '../../entry/context/Context';
import { Details, DetailsLinks } from '../../shared/details/Details';

export const Index = (props) => {
	let { requestParams } = props;
	const context = useContext(Context);
	const { campaigns } = context;
	let { current, previous } = campaigns;

	// Use query to get and show campaign data
	// const campaignQuery = useQuery(['campaign', requestParams, current.id], requests.campaign);
	// const campaignResults = campaignQuery?.data ? campaignQuery.data : false;
	// current.amounts = campaignResults ? campaignResults.amounts : false;
	const campaignResults = false;

	// Use query to get and supporting campaigns
	// const supportingQuery = useQuery(['supporting', requestParams, current.id], requests.supporting);
	// const supportingResults = supportingQuery?.data ? supportingQuery.data : false;
	const supportingResults = false;

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

			{campaignResults ? (
				<Details header={'Current Campaign'}>
					{current.name && (
						<p>
							<strong>Name:</strong> {current.name}
						</p>
					)}

					{current.date && (
						<p>
							<strong>Date:</strong> {current.date}
						</p>
					)}

					{campaignResults && current.amounts && current.amounts.total_amount_raised !== false && current.amounts.goal !== false ? (
						<div className="level-bar-raised flex-nowrap">
							<strong>Raised:</strong>
							<div className="level-bar">
								<div className="level-bar-label">
									${current.amounts.total_amount_raised.toFixed(2)} out of ${current.amounts.goal.toFixed(2)}
								</div>

								<div className="level-bar-outof">
									<div
										className="level-bar-progress"
										style={{
											width: `${(current.amounts.total_amount_raised / current.amounts.goal) * 100}%`,
										}}
									></div>

									<div className="level-bar-shadow"></div>
								</div>
							</div>
						</div>
					) : null}

					<DetailsLinks links={current.links} />
				</Details>
			) : null}

			{supportingResults ? (
				<Details header={'Supporting Campaigns'} hasRow={true}>
					<div className="row row-auto row-spacing-20 row-wrap">
						{supportingResults.map((supporting) => {
							const { total_amount_raised } = supporting.amounts;

							return (
								<div className="column column-width-50" key={supporting.id}>
									<div className="blue-section">
										<p>
											<strong>Campaign:</strong> {supporting.name}
										</p>

										<p>
											<strong>Raised:</strong> ${total_amount_raised.toFixed(2)}
										</p>

										<DetailsLinks links={supporting.links} />
									</div>
								</div>
							);
						})}
					</div>
				</Details>
			) : null}

			<Details header={'Previous Campaigns'} hasRow={true}>
				<div className="row row-auto row-spacing-20 row-wrap">
					{previous.map((campaign) => {
						const { total_amount_raised } = campaign.amounts;

						return (
							<div className="column column-width-50" key={campaign.id}>
								<div className="blue-section">
									<p>
										<strong>Campaign:</strong> {campaign.name}
									</p>

									<p>
										<strong>Ends:</strong> {campaign.date}
									</p>

									<p>
										<strong>Raised:</strong> ${total_amount_raised.toFixed(2)}
									</p>

									{campaign.links && campaign.links.length != 0 && (
										<div className="detail-links">
											{campaign.links.map((link) => (
												<a href={link.url} target="_blank" rel="noreferrer" key={link.url}>
													{link.label}
												</a>
											))}
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>
			</Details>
		</>
	);
};

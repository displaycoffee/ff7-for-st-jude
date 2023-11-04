/* Local styles */
import './styles/index.scss';

/* Local scripts */
import { campaigns } from './scripts/campaigns';

/* Local components */
import { Details } from '../../shared/details/Details';

export const Index = () => {
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
				<p>Coming soon.</p>
			</Details>

			<Details header={'Supporting Campaigns'}>
				<p>Coming soon.</p>
			</Details>

			<Details header={'Previous Campaigns'} hasRow={true}>
				<div className="row row-20 row-wrap row-auto">
					{campaigns.previous.map((campaign) => {
						const { total_amount_raised } = campaign.amounts;

						return (
							<div className="column column-full column-half" key={campaign.id}>
								<div className="blue-bg">
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

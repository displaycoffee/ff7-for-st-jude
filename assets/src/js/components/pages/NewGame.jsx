/* local component imports */
import { Header } from '../elements/Header';
import { Navigation } from '../elements/Navigation';
import { Details } from '../elements/Details';

export const NewGame = (props) => {
	let { supporting, campaign, previous, buttonClick, utils, theme } = props;

	// setup navigation links
	const navigationLinks = [
		{
			label: 'Participant Guide',
			attributes: {
				href: 'https://docs.google.com/document/d/1ggjNslCvkzGdsjmWvkJriRNMgvVjSfbsCG-FTPUpBuw',
				target: '_blank',
			},
		},
		{
			label: 'Signup Sheet',
			attributes: {
				href: 'https://docs.google.com/spreadsheets/d/1_P65Vui4GYhFB2YII8p6bbcKTGWerqa2u838LiHwuxQ',
				target: '_blank',
			},
		},
		{
			label: 'Commentary Stream',
			attributes: {
				href: 'https://twitch.tv/MonetaryDragon',
				target: '_blank',
			},
		},
	];

	return (
		<>
			<Header buttonClick={buttonClick} />

			<section className="detail detail-information">
				<h3 className="detail-title">Information</h3>

				<div className="detail-row flex-wrap">
					<div className="detail-column detail-column-whole detail-column-0">
						<div className="detail-column-inner">
							<p>
								Welcome to the biannual FF7 for St. Jude speedrun event! Since December 2020, these events have been held twice per
								year, typically the last weekend of June and the 2nd weekend of December. The event is part of{' '}
								<a href="https://www.stjude.org/get-involved/other-ways/video-game-charity-event.html" target="_blank">
									St. Jude PLAY LIVE
								</a>
								, an organization for gamers to support{' '}
								<a href="https://www.stjude.org" target="_blank">
									St. Jude Children's Research Hospital
								</a>
								.
							</p>

							<p>
								We call this a race but it is important to know that the goal is not necessarily to finish first. The primary goals
								are to raise money for kids in need and have fun doing it. Using donation incentives to make the run more fun to watch
								may cost time but can help raise more money.
							</p>

							<p className="mission-statement">
								The mission of St. Jude Children's Research Hospital is to advance cures, and means of prevention, for pediatric
								catastrophic diseases through research and treatment. Consistent with the vision of our founder Danny Thomas, no child
								is denied treatment based on race, religion or a family's ability to pay.
							</p>
						</div>
					</div>
				</div>
			</section>

			<Navigation links={navigationLinks} />

			<Details settings={theme.details.campaign} details={campaign} utils={utils} />

			<Details settings={theme.details.supporting} details={supporting} utils={utils} />

			<Details settings={theme.details.previous} details={previous} utils={utils} />
		</>
	);
};

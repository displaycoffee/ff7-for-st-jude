/* local component imports */
import Header from '../elements/Header';
import Navigation from '../elements/Navigation';
import Campaign from '../content/Campaign';
import Supporting from '../content/Supporting';

const NewGame = (props) => {
	let { supporting, campaign, buttonClick, utils } = props;

	// setup navigation links
	const navigationLinks = [
		{
			label: 'Participant Guide',
			attributes: {
				href: '//docs.google.com/document/d/1ggjNslCvkzGdsjmWvkJriRNMgvVjSfbsCG-FTPUpBuw',
				target: '_blank',
			},
		},
		{
			label: 'Signup Sheet',
			attributes: {
				href: '//docs.google.com/spreadsheets/d/1_P65Vui4GYhFB2YII8p6bbcKTGWerqa2u838LiHwuxQ',
				target: '_blank',
			},
		},
		{
			label: 'Commentary Stream',
			attributes: {
				href: '//twitch.tv/MonetaryDragon',
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
								<a href="//www.stjude.org/get-involved/other-ways/video-game-charity-event.html" target="_blank">
									St. Jude PLAY LIVE
								</a>
								, an organization for gamers to support{' '}
								<a href="//www.stjude.org" target="_blank">
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

			<Campaign campaign={campaign} utils={utils} />

			{supporting && <Supporting supporting={supporting} utils={utils} />}
		</>
	);
};

export default NewGame;

/* React */
import { Link } from 'react-router-dom';

/* Local components */
import { Details } from '../../shared/details/Details';

export const ParticipantGuide = () => {
	return (
		<>
			<Details header={'Top 5 Important Things'} scrollLink={true}>
				<ul>
					<li>Create a Tiltify campaign that supports the team campaign and create donation incentives.</li>
					<li>Promote the event to viewers, family, friends, and coworkers.</li>
					<li>Create bot commands such as !donate, !stjude, and !commentary.</li>
					<li>Start stream at least 20 minutes before the race and ensure you have 360p as a quality option.</li>
					<li>
						Set up an account with{' '}
						<a href="//racetime.gg" target="_blank" rel="noreferrer">
							racetime.gg
						</a>{' '}
						and join the race through{' '}
						<a href="//livesplit.org" target="_blank" rel="noreferrer">
							LiveSplit
						</a>{' '}
						(or browser) before it starts.
					</li>
				</ul>
			</Details>

			<Details header={'Important Links'} scrollLink={true}>
				<ul>
					<li>
						<strong>Tiltify Team:</strong>{' '}
						<a href="//tiltify.com/+ff7-for-st-jude/profile" target="_blank" rel="noreferrer">
							tiltify.com/+ff7-for-st-jude/profile
						</a>
					</li>
					<li>
						<strong>Coffee and Toast Discord:</strong>{' '}
						<a href="//discord.gg/jb38ssbnt" target="_blank" rel="noreferrer">
							discord.gg/jb38ssbnt
						</a>
					</li>
					<li>
						<strong>Official FF7 Discord:</strong>{' '}
						<a href="//discord.gg/U7PjxqbRBj2" target="_blank" rel="noreferrer">
							discord.gg/U7PjxqbRBj2
						</a>
					</li>
					<li>
						<strong>MonetaryDragon's twitch channel (commentary stream):</strong>{' '}
						<a href="//twitch.tv/MonetaryDragon" target="_blank" rel="noreferrer">
							twitch.tv/MonetaryDragon
						</a>
					</li>
					<li>
						<strong>Racetime:</strong>{' '}
						<a href="//racetime.gg" target="_blank" rel="noreferrer">
							racetime.gg
						</a>
					</li>
					<li>
						<strong>St. Jude Children's Research Hospital:</strong>{' '}
						<a href="//www.stjude.org" target="_blank" rel="noreferrer">
							stjude.org
						</a>
					</li>
					<li>
						<strong>St. Jude PLAY LIVE:</strong>{' '}
						<a href="//www.stjude.org/get-involved/other-ways/video-game-charity-event.html" target="_blank" rel="noreferrer">
							stjude.org/get-involved/other-ways/video-game-charity-event.html
						</a>
					</li>
					<li>
						<strong>St. Jude PLAY LIVE Discord:</strong>{' '}
						<a href="//discord.gg/stjudeplaylive" target="_blank" rel="noreferrer">
							discord.gg/stjudeplaylive
						</a>
					</li>
				</ul>
			</Details>

			<Details header={'Creating Your Tiltify Campaign'} scrollLink={true}>
				<p>
					This event uses Tiltify to manage donations through a team campaign. The team can be seen at{' '}
					<a href="//tiltify.com/+ff7-for-st-jude/profile" target="_blank" rel="noreferrer">
						tiltify.com/+ff7-for-st-jude/profile
					</a>{' '}
					which shows the active campaign near the top of the page. You do not need to be a member of the team to support the campaign.
					Participants will create individual campaigns that support the team campaign.
				</p>
				<ol>
					<li>
						Browse to{' '}
						<a href="//tiltify.com" target="_blank" rel="noreferrer">
							tiltify.com
						</a>{' '}
						and log in using your twitch account.
					</li>
					<li>
						Browse to{' '}
						<a href="//tiltify.com/+ff7-for-st-jude/profile" target="_blank" rel="noreferrer">
							tiltify.com/+ff7-for-st-jude/profile
						</a>{' '}
						and click "View Campaign" for the active campaign near the top of the page.
					</li>
					<li>Click "Support Campaign".</li>
					<li>
						Enter a campaign name. <strong>For example:</strong> "Toast_Matt's FF7 for St. Jude #7".
					</li>
					<li>Customize the campaign description if desired.</li>
					<li>Click "Next" and choose Livestream &gt; Twitch and enter your twitch channel's username.</li>
					<li>
						Click "Next" and set a campaign goal. This goal does not affect anything including prizes. It is just to encourage donations
						to reach goals. You can raise your goal at any time but cannot lower it! It's best to set it to achievable amounts and raise
						the goal each time it's reached during the event.
					</li>
					<li>
						Enter your address, click "Continue", and enter your phone number and t-shirt size.
						<ul>
							<li>
								St. Jude PLAY LIVE sends prize packages out after the event. You might get a t-shirt and/or hoodie. Also a bunch of
								other random stuff.
							</li>
						</ul>
					</li>
					<li>Click "Create", but don't publish yet.</li>
					<li>
						Your campaign dashboard will open. From here you can manage all aspects of your campaign including incentives which are a big
						part of the campaign.
					</li>
					<li>
						Once you've completed your campaign you can publish it from the "Overview" tab. This will allow people to donate. Once
						published, you cannot change some details such as name and description. You can unpublish your campaign but only if no
						donations have been made yet.
					</li>
				</ol>
			</Details>

			<Details header={'Incentives'} scrollLink={true}>
				<p>To manage donation incentives, log into your campaign dashboard and click the "Incentives" tab.</p>
				<ul>
					<li>
						<strong>Rewards</strong> are for a single donation (e.g. $20 to name a character).
					</li>
					<li>
						<strong>Targets</strong> are group incentives met if one or more people donate enough (e.g. $50 to cast Bahamut on Diamond
						Weapon).
					</li>
					<li>
						<strong>Polls</strong> have multiple options people can donate to (e.g. Omnislash vs. Counter Attack).
					</li>
				</ul>
				<p>
					Any given donation can be applied toward a reward, target,{' '}
					<strong>
						<em>AND</em>
					</strong>{' '}
					poll. For example if someone donates $20 they may choose a $20 reward to name Cloud, put $20 toward using Omnislash, and the same
					$20 toward a poll to date Tifa instead of Aerith.
				</p>
				<p>Below are examples of incentives.</p>
				<h5>Rewards</h5>
				<ul>
					<li>Name a character</li>
					<li>Get an optional character (Vincent and/or Yuffie) and name it</li>
					<li>Spin your chair</li>
					<li>Flush the Shinra toilet</li>
					<li>Eat a Bamboozled jelly bean</li>
				</ul>
				<h5>Targets</h5>
				<ul>
					<li>Get a special Gold Saucer date</li>
					<li>Do a special boss strat</li>
					<li>Don't do a skip</li>
					<li>Do part of the game blindfolded</li>
				</ul>
				<h5>Polls</h5>
				<ul>
					<li>Omnislash vs. Counter Attack on Sephiroth</li>
					<li>Best girl</li>
				</ul>
				<h5>Tips for how to price rewards and targets</h5>
				<ul>
					<li>You can charge more than you think you can.</li>
					<li>People often have a donation amount in mind before seeing incentives.</li>
					<li>Don't expect all of your incentives to be redeemed.</li>
				</ul>
			</Details>

			<Details header={'Stream Setup'} scrollLink={true}>
				<p>
					There are a few things you can add to your stream to help the event. Custom bot commands provide important information to viewers
					such as donation links. Stream overlays and alerts keep your viewers up-to-date on your total amount raised, recent donations, and
					recent incentive redemptions.
				</p>
				<p>
					Tiltify provides a default overlay with alerts. You can access this from your Tiltify campaign dashboard in the "Overlays" tab.
					You can use the default overlay and customize it to suit your stream. After saving your changes, copy the overlay url and add it
					as a "Browser Source" in OBS.
				</p>
				<h5>Common Commands</h5>
				<ul>
					<li>
						<strong>!donate</strong> - Link to your campaign
					</li>
					<li>
						<strong>!race, !event</strong> - Info about St. Jude, the race category, and the commentary stream
					</li>
					<li>
						<strong>!commentary</strong> - Link to commentary stream
					</li>
					<li>
						<strong>!stjude</strong> - Info about St. Jude. I recommend using their official mission statement found{' '}
						<Link to="/" alt="Home" title="Home">
							at the top of the home page
						</Link>
					</li>
				</ul>
				<p>It's also a good idea to include these commands in your stream title!</p>
			</Details>

			<Details header={'Commentary Stream'} scrollLink={true}>
				<p>
					MonetaryDragon and AceZephyr host commentary for the event on MonetaryDragon's twitch channel. Typically several other people join
					the commentary for some or all of the event. They restream up to 8 of the participants' streams at a time typically prioritized
					either by expected completion time or by platform (prioritizing PSX Disc). The runs being restreamed are at the discretion of the
					commentators and may be prioritized differently. As restreamed runs end, their spot on the commentary stream is replaced with
					another runner chosen by the commentators, typically the next run they expect to complete.
				</p>
				<p>There are a few things you need to know for the commentary stream:</p>
				<ul>
					<li>Start your stream at least 20 minutes before the event's start time.</li>
					<li>Make sure 360p is a quality option for your stream. Restart your stream until it is available.</li>
				</ul>
			</Details>

			<Details header={'Promoting the Event'} scrollLink={true}>
				<p>
					Before the event, be sure to let your family, friends, and stream viewers know you're participating! Tell them about the event and
					your incentives to get them excited to watch and/or donate.
				</p>
				<p>
					In streams leading up to the event you can mention the event and use bot commands to provide details. You can also encourage
					people to redeem early rewards such as naming Cloud or Barret.
				</p>
				<p>
					Ask the company you work for if they will match donations for the event. For example a business may match up to $100 meaning if
					the campaign raises $100 or more, they will donate $100. It is also common for businesses to do a percentage based match such as
					20% up to $100 which would mean if $100 is raised, they would donate $20 but if $500 or more is raised, they would donate $100.
				</p>
			</Details>

			<Details header={'Checklist'} scrollLink={true}>
				<h5>Before the day of the event</h5>
				<ol>
					<li>Create your Tiltify campaign, create incentives, publish your campaign, activate incentives.</li>
					<li>
						Create bot commands and timers with links to your campaign page and the commentary stream (
						<a href="//twitch.tv/monetarydragon" target="_blank" rel="noreferrer">
							twitch.tv/monetarydragon
						</a>
						).
					</li>
					<li>Set up donation alerts and overlays.</li>
					<li>Sign up for racetime.gg.</li>
					<li>
						Advertise the event to family and friends! Encourage people to redeem early incentives like naming Cloud and Barret before the
						event.
					</li>
				</ol>
				<h5>Day of the event</h5>
				<ol>
					<li>
						Keep an eye on the <strong>#ff7-for-st-jude</strong> channel in the{' '}
						<a href="//discord.gg/jb38ssbnt" target="_blank" rel="noreferrer">
							Coffee and Toast discord
						</a>
						.
					</li>
					<li>Start your stream at least 20 minutes before the event starts.</li>
					<li>Restart your stream until you get resolution quality options (360p must be available).</li>
					<li>Join the racetime.gg race in LiveSplit and click "I'm ready" when you're ready.</li>
					<li>Wait on the "New Game" screen and move cursor until the race starts.</li>
				</ol>
			</Details>
		</>
	);
};

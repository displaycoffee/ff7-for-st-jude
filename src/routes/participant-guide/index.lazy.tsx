/* Styles */
import './styles/participant-guide.scss';

/* Packages */
import { createLazyFileRoute, Link } from '@tanstack/react-router';

/* Scripts */
import { useAppContext } from '@/context/scripts/context-hooks';

/* Components */
import { PageTitle } from '@/components/page-title/PageTitle';
import { LinkExternal, List, Section } from '@/components/blocks/Blocks';
import { ButtonScroll } from '@/components/forms/Forms';

/* Page title */
const title = 'Participant Guide';

export const Route = createLazyFileRoute('/participant-guide/')({
	component: RouteComponent,
});

function RouteComponent() {
	const { utils, variables } = useAppContext();

	return (
		<>
			<PageTitle title={title} />

			<Section title={'Top 5 Important Things'}>
				<List>
					<li>Create a Tiltify campaign that supports the team campaign and create donation incentives.</li>
					<li>Promote the event to viewers, family, friends, and coworkers.</li>
					{/* <li>Create bot commands such as !donate, !stjude, and !commentary.</li> */}
					<li>Create bot commands such as !donate and !stjude.</li>
					<li>Start stream at least 20 minutes before the race and ensure you have 360p as a quality option.</li>
					<li>
						Set up an account with <LinkExternal href={'//racetime.gg'}>racetime.gg</LinkExternal> and join the race through{' '}
						<LinkExternal href={'//livesplit.org'}>LiveSplit</LinkExternal> (or browser) before it starts.
					</li>
				</List>
			</Section>

			<Section title={'Checklist'}>
				<h3>Before the day of the event</h3>

				<List variant={'ol'}>
					<li>Create your Tiltify campaign, create incentives, publish your campaign, and activate incentives.</li>
					<li>Create bot commands and timers with links to your campaign page.</li>
					{/* <li>
						Create bot commands and timers with links to your campaign page and the commentary stream (
						<LinkExternal href={'//twitch.tv/monetarydragon'}>twitch.tv/monetarydragon</LinkExternal>
						).
					</li> */}
					<li>Set up donation alerts and overlays.</li>
					<li>Sign up for racetime.gg.</li>
					<li>
						Advertise the event to family and friends! Encourage people to redeem early incentives like naming Cloud and Barret before the
						event.
					</li>
				</List>

				<h3>Day of the event</h3>

				<List variant={'ol'}>
					<li>
						Keep an eye on the <strong>#upcoming-events</strong> channel in the{' '}
						<LinkExternal href={'//discord.ff7speedruns.com'}>Official FF7 Discord</LinkExternal>.
					</li>
					<li>Start your stream at least 20 minutes before the event starts.</li>
					<li>Join the racetime.gg race in LiveSplit and click "I'm ready" when you're ready.</li>
					<li>Wait on the "New Game" screen and move cursor until the race starts.</li>
				</List>
			</Section>

			<Section title={'Important Links'}>
				<List>
					<li>
						<strong>Tiltify Team:</strong>{' '}
						<LinkExternal href={'//tiltify.com/+ff7-for-st-jude/profile'}>tiltify.com/+ff7-for-st-jude/profile</LinkExternal>
					</li>
					<li>
						<strong>Official FF7 Discord:</strong>{' '}
						<LinkExternal href={'//discord.ff7speedruns.com'}>discord.ff7speedruns.com</LinkExternal>
					</li>
					{/* <li>
						<strong>MonetaryDragon's twitch channel (commentary stream):</strong>{' '}
						<LinkExternal href={'//twitch.tv/MonetaryDragon'}>twitch.tv/MonetaryDragon</LinkExternal>
					</li> */}
					<li>
						<strong>Racetime:</strong> <LinkExternal href={'//racetime.gg'}>racetime.gg</LinkExternal>
					</li>
					<li>
						<strong>St. Jude Children's Research Hospital:</strong> <LinkExternal href={'//www.stjude.org'}>stjude.org</LinkExternal>
					</li>
					<li>
						<strong>St. Jude PLAY LIVE:</strong>{' '}
						<LinkExternal href={'//www.stjude.org/get-involved/other-ways/video-game-charity-event.html'}>
							stjude.org/get-involved/other-ways/video-game-charity-event.html
						</LinkExternal>
					</li>
					<li>
						<strong>St. Jude PLAY LIVE Discord:</strong>{' '}
						<LinkExternal href={'//discord.gg/stjudeplaylive'}>discord.gg/stjudeplaylive</LinkExternal>
					</li>
				</List>
			</Section>

			<Section title={'Creating Your Tiltify Campaign'}>
				<p>
					This event uses Tiltify to manage donations through a team campaign. The team can be seen at{' '}
					<LinkExternal href={'//tiltify.com/+ff7-for-st-jude/profile'}>tiltify.com/+ff7-for-st-jude/profile</LinkExternal> which shows the
					active campaign near the top of the page. You do not need to be a member of the team to support the campaign. Participants will
					create individual campaigns that support the team campaign.
				</p>

				<List variant={'ol'}>
					<li>
						Browse to <LinkExternal href={'//app.tiltify.com'}>app.tiltify.com</LinkExternal> and log in using your twitch account.
					</li>
					<li>
						Then in the same or new browser tab, go to{' '}
						<LinkExternal href={variables.urls.campaign}>
							{variables.urls.campaign.replace('https://', '').replace('//', '')}
						</LinkExternal>{' '}
						and click the "Start fundraising" button.
					</li>
					<li>"Charity details" are already selected, so click "Build your own campaign".</li>
					<li>
						Enter your campaign goal. See below section on "
						<ButtonScroll target={`#section-${utils.handleize('Goals & Milestones')}`} label={'Goals & Milestones'} />" for more
						information.
					</li>
					<li>
						Enter a campaign name. <strong>For example:</strong> "cornfed's {variables.site.name} #10". There will be a series of
						questions to go through next.
						<List>
							<li>
								<strong>Question:</strong> Where are most of your donors located?
								<br />
								<strong>Answer:</strong> Online
							</li>
							<li>
								<strong>Question:</strong> Let's talk support: who's most likely to donate to your campaign?
								<br />
								<strong>Answer:</strong> Both
							</li>
							<li>
								<strong>Question:</strong> How will you connect with donors?
								<br />
								<strong>Answer:</strong> Live Streaming
							</li>
							<li>
								<strong>Question:</strong> What streaming platforms do you use?
								<br />
								<strong>Answer:</strong> Choose "Twitch" and enter your twitch channel's username.
							</li>
						</List>
					</li>
					<li>
						Tiltify will provide default "Rewards". These are optional and it's encouraged to make your own rewards that fit the theme of
						the game. You can find <ButtonScroll target={`#section-${utils.handleize('Incentives')}`} label={'examples below'} />.
					</li>
					<li>Choose the incentives you want to add. Most campaigns will setup "Rewards" and "Polls".</li>
					<li>Select "No" for "Allow other fundraisers to support you".</li>
					<li>
						A mini-preview of your campaign will be shown. You can "Save draft" or "View your page". If you don't need to preview the
						page, go ahead and click "Save draft". On the next page, there will be a red colored box at the top that says "Finish setup".
						Click this button.
					</li>
					<li>
						You will be asked to register with St. Jude PLAY LIVE. Click "Add address" and after using the address, enter your phone
						number, birthday, t-shirt fit, and t-shirt size. Take note of the toggle at the bottom that asks if you want to receive emails
						and mail from "St. Jude Children's Research Hospital".
						<List>
							<li>
								St. Jude PLAY LIVE sends prize packages out after the event. You might get a t-shirt and/or hoodie. Also, a bunch of
								other random stuff.
							</li>
						</List>
					</li>
					<li>
						Once registered, you can take your campaign live by clicking "Publish campaign". This will allow people to donate. When a
						campaign is live, you cannot change certain details such as name and description. You can unpublish your campaign, but only if
						no donations have been made.
					</li>
					<li>"Rewards" and "Polls" can be managed under "Incentives". After setting them up, don't forget to toggle the item "Active".</li>
				</List>
			</Section>

			<Section title={'Incentives'}>
				<p>To manage donation incentives, log into your campaign dashboard and click the "Incentives" tab.</p>

				<List>
					<li>
						<strong>Rewards</strong> - Claimable items that can go towards a single donation (e.g. $20 to name a character).
					</li>
					<li>
						<strong>Polls</strong> - Allows your viewers to donate towards an option they believe should win (e.g. Omnislash vs. Counter
						Attack).
					</li>
				</List>

				<p>
					Any given donation can be applied toward a reward{' '}
					<strong>
						<em>AND</em>
					</strong>{' '}
					poll. For example, if someone donates $20, they may choose a $10 reward to name Cloud and put the remaining $10 toward a poll to
					date Tifa instead of Aerith.
				</p>

				<h3>Reward examples</h3>

				<List>
					<li>Name a character.</li>
					<li>Get an optional character (Vincent and/or Yuffie) and name it.</li>
					<li>Spin your chair.</li>
					<li>Flush the Shinra toilet.</li>
					<li>Eat a Bamboozled jelly bean.</li>
				</List>

				<h3>Poll examples</h3>

				<List>
					<li>Omnislash vs. Counter Attack on Sephiroth.</li>
					<li>Best girl.</li>
				</List>

				<h3>Tips for how to price rewards and polls</h3>

				<List>
					<li>You can charge more than you think you can.</li>
					<li>People often have a donation amount in mind before seeing incentives.</li>
					<li>Don't expect all of your incentives to be redeemed.</li>
				</List>
			</Section>

			<Section title={'Goals & Milestones'}>
				<p>To manage your campaign goal and milestones, log into your campaign dashboard and click the "Setup" tab.</p>

				<List>
					<li>
						<strong>Goal</strong> - Your overall campaign goal. This goal does not affect anything including prizes. It is just to
						encourage donations to reach goals. You can raise your goal at any time, but cannot lower it! It is best to set it to
						achievable amounts and raise the goal each time it is reached during the event.
					</li>
					<li>
						<strong>Milestones</strong> - Allows you to break down your larger campaign goal into achievable sub-goals. Milestones help
						you gain momentum as you climb to the top of your fundraising goal.
					</li>
				</List>

				<h3>Milestone examples</h3>

				<List>
					<li>Sing "Melodies of Life" from Final Fantasy IX at $420.69.</li>
					<li>Shave your head to look like Palmer at $2000.</li>
				</List>
			</Section>

			<Section title={'Stream Setup'}>
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

				<h3>Common Commands</h3>

				<List>
					<li>
						<strong>!donate</strong> - Link to your campaign
					</li>
					<li>
						<strong>!race, !event</strong> - Info about St. Jude and the race category
					</li>
					{/* <li>
						<strong>!race, !event</strong> - Info about St. Jude, the race category, and the commentary stream
					</li> */}
					{/* <li>
						<strong>!commentary</strong> - Link to commentary stream
					</li> */}
					<li>
						<strong>!stjude</strong> - Info about St. Jude. I recommend using their official mission statement found{' '}
						<Link to={'/'}>at the top of the home page</Link>
					</li>
				</List>

				<p>It's also a good idea to include these commands in your stream title!</p>
			</Section>

			<Section title={'Commentary Stream'}>
				<p>
					<strong>TBD.</strong>
				</p>
				{/* <p>
					MonetaryDragon and AceZephyr host commentary for the event on MonetaryDragon's twitch channel. Typically several other people join
					the commentary for some or all of the event. They restream up to 8 of the participants' streams at a time typically prioritized
					either by expected completion time or by platform (prioritizing PSX Disc). The runs being restreamed are at the discretion of the
					commentators and may be prioritized differently. As restreamed runs end, their spot on the commentary stream is replaced with
					another runner chosen by the commentators, typically the next run they expect to complete.
				</p>

				<p>There are a few things you need to know for the commentary stream:</p>

				<List>
					<li>Start your stream at least 20 minutes before the event's start time.</li>
					<li>Make sure 360p is a quality option for your stream. Restart your stream until it is available.</li>
				</List> */}
			</Section>

			<Section title={'Promoting the Event'}>
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
			</Section>
		</>
	);
}

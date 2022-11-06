/* react imports */
import { useState, useEffect } from 'react';

/* local script imports */
import { tiltify } from '../scripts/tiltify';
import { utils } from '../scripts/utils';

/* local component imports */
import Campaign from './Campaign';
import Donations from './Donations';
import Rewards from './Rewards';
import Challenges from './Challenges';

/* setup cache of campaigns */
const localCache = {
	supporting: {},
	campaign: {},
	donations: {},
	rewards: {},
	challenges: {}
};

const Index = () => {
	// react variables
	let [supporting, setSupporting] = useState({});
	let [campaign, setCampaign] = useState({});
	let [donations, setDonations] = useState({});
	let [rewards, setRewards] = useState({});
	let [challenges, setChallenges] = useState({});

	useEffect(() => {
		requestCampaigns();
	}, []);

	async function requestCampaigns() {
		// get data of supporting campaigns
		const supportingResponse = await fetch(`${tiltify.api}${tiltify.campaign}/supporting-campaigns`, tiltify.fetchParams);
		const supportingJson = await supportingResponse.json();

		if (supportingJson && supportingJson.data) {
			if (Object.keys(localCache.campaign).length > 0) {
				const campaignAmount = utils.values.getTotal(localCache.campaign.amountRaised, supportingJson.data, 'amountRaised');

				// only request campaign from api if amount has changed and add into localCache
				if (utils.values.convertDecimal(campaignAmount) != utils.values.convertDecimal(localCache.campaign.totalAmountRaised)) {
					localCache.campaign = await tiltify.request.campaign();
				}
			} else {
				// initially add campaignConfig into localCache
				localCache.campaign = await tiltify.request.campaign();
			}

			// loop through supportingJson to add supporting campaigns
			for (let i = 0; i < supportingJson.data.length; i++) {
				const data = supportingJson.data[i];
				const id = data.id;

				if (!localCache.supporting[id]) {
					// add supporting campaigns to localCache
					data.username = data.user.username;
					data.campaign = `${data.user.url}/${data.slug}`;
					data.twitch = data?.livestream?.type == 'twitch' ? `https://${data.livestream.type}.tv/${data.livestream.channel}` : false;
					localCache.supporting[id] = data;
				}
			}

			// set base campaign
			campaign = localCache.campaign;
			setCampaign(campaign);

			// set supporting campaigns
			supporting = localCache.supporting;
			setSupporting(supporting);

			// loop through supportingJson to fetch content
			for (let j = 0; j < supportingJson.data.length; j++) {
				const data = supportingJson.data[j];
				const id = data.id;

				if (localCache.donations[id]) {
					// get totalAmount from localCache.donations to see if we should request content again
					const totalAmount = utils.values.getTotal(0, localCache.donations[id], 'amount');

					// only request content from api if amount has changed and add into localCache
					if (utils.values.convertDecimal(totalAmount) != utils.values.convertDecimal(data.amountRaised)) {
						const content = await tiltify.request.content(id);
						localCache.donations[id] = content.donations;
						localCache.rewards[id] = content.rewards;
						localCache.challenges[id] = content.challenges;
					}
				} else {
					// initially add content into localCache
					const content = await tiltify.request.content(id);
					localCache.donations[id] = content.donations;
					localCache.rewards[id] = content.rewards;
					localCache.challenges[id] = content.challenges;
				}
			}

			// set donations
			donations = localCache.donations;
			setDonations(donations);

			// set rewards
			rewards = localCache.rewards;
			setRewards(rewards);

			// set challenges
			challenges = localCache.challenges;
			setChallenges(challenges);
		}
	}

	// make button spin
	const addSpin = () => {
		const button = document.querySelector('.header-button');
		const spin = 'spinning';
		const spinComplete = 'spinning-complete';

		setTimeout(() => {
			button.classList.add(spin);
			setTimeout(() => {
				button.classList.remove(spin);
				button.classList.add(spinComplete);
				setTimeout(() => {
					button.classList.remove(spinComplete);
				}, 2500);
			}, 1500);
		});
	}

	return (
		<div className="wrapper">
			<main id="top" className="layout">
				<header className="header flex-wrap flex-align-center">
					<h1 className="header-title">{(campaign && campaign.name) ? campaign.name : 'FF7 No-Slots for St. Jude'}</h1>

					<button className="header-button pointer" type="button" onClick={e => {
						e.preventDefault();
						addSpin();
						requestCampaigns();
					}}>
						<span className="header-button-label-01">I'll try spinning.</span>
						<span className="header-button-label-02">That's a good trick.</span>
					</button>
				</header>

				<Campaign campaign={campaign} utils={utils} />

				<nav className="navigation">
					<a
						onClick={(e) => utils.scrollTo(e, 'donations')}
						className="pointer">
						Donations
					</a>&nbsp;-&nbsp;
					<a
						onClick={(e) => utils.scrollTo(e, 'rewards')}
						className="pointer">
						Rewards
					</a>&nbsp;-&nbsp;
					<a
						onClick={(e) => utils.scrollTo(e, 'challenges')}
						className="pointer">
						Challenges
					</a>
				</nav>

				<Donations supporting={supporting} donations={donations} utils={utils} />

				<Rewards supporting={supporting} rewards={rewards} utils={utils} />

				<Challenges supporting={supporting} challenges={challenges} utils={utils} />
			</main>
		</div>
	);
};

export default Index;

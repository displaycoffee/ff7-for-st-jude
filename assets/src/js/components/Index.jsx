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
	campaign : {},
	donations : {},
	rewards : {},
	challenges : {}
};

const Index = () => {
	// react variables
	let [campaign, setCampaign] = useState({});
	let [donations, setDonations] = useState({});
	let [rewards, setRewards] = useState({});
	let [challenges, setChallenges] = useState({});

	useEffect(() => {
		requestCampaigns();
	}, []);

	async function requestCampaigns() {
		// get data of supporting campaigns
		const supportingResponse = await fetch(`https://tiltify.com/api/v3/campaigns/${tiltify.campaign}/supporting-campaigns`, tiltify.fetchParams);
		const supportingJson = await supportingResponse.json();

		if (supportingJson && supportingJson.data) {
			// initial configs to set responses later
			let campaignConfig = {};
			let donationsConfig = {};
			let rewardsConfig = {};
			let challengesConfig = {};
			
			if (Object.keys(localCache.campaign).length > 0) {
				// get campaignAmount from supportingJson to see if we should request the campaign again
				let campaignAmount = utils.values.getTotal(localCache.campaign.amountRaised, supportingJson.data, 'amountRaised');

				if (campaignAmount != localCache.campaign.totalAmountRaised) {
					// request campaignConfig from api if amount has changed
					campaignConfig = await tiltify.request.campaign();
				} else {
					// get campaignConfig from cache instead
					campaignConfig = localCache.campaign;
				}
			} else {
				// set initial campaignConfig from response
				campaignConfig = await tiltify.request.campaign();
				
				// add campaignConfig into localCache
				localCache.campaign = campaignConfig;			
			}

			// push data to supporting campaigns to include in donations
			supportingJson.data.push(campaignConfig);

			// set state for base campaign
			campaign = campaignConfig;
			setCampaign(campaign);	

			// loop through supportingJson to fetch donations
			for (let i = 0; i < supportingJson.data.length; i++) {
				let currentData = supportingJson.data[i];
				let currentId = currentData.id;
				
				if (localCache.donations[currentId]) {
					// get totalAmount from localCache.donations to see if we should request configs again
					let totalAmount = utils.values.getTotal(0, localCache.donations[currentId], 'amount');

					if (totalAmount != currentData.amountRaised) {
						// request configs from api if amount has changed
						donationsConfig[currentId] = await tiltify.request.donations(currentId, currentData);
						rewardsConfig[currentId] = await tiltify.request.rewards(currentId, currentData);
						challengesConfig[currentId] = await tiltify.request.challenges(currentId, currentData);
					} else {
						// get configs from cache instead
						donationsConfig[currentId] = localCache.donations[currentId];
						rewardsConfig[currentId] = localCache.rewards[currentId];
						challengesConfig[currentId] = localCache.challenges[currentId];
					}
				} else {					
					// set initial configs from response
					donationsConfig[currentId] = await tiltify.request.donations(currentId, currentData);
					rewardsConfig[currentId] = await tiltify.request.rewards(currentId, currentData);
					challengesConfig[currentId] = await tiltify.request.challenges(currentId, currentData);
					
					// add configs into localCache
					localCache.donations[currentId] = donationsConfig[currentId];
					localCache.rewards[currentId] = rewardsConfig[currentId];
					localCache.challenges[currentId] = challengesConfig[currentId];
				}
			}
			
			// set donations
			donations = donationsConfig;
			setDonations(donations);

			// set rewards
			rewards = rewardsConfig;
			setRewards(rewards);

			// set challenges
			challenges = challengesConfig;
			setChallenges(challenges);
		}
	}

	return (
		<div className="wrapper">
			<main id="top" className="layout">
				<header className="header flex-wrap flex-align-center">
					<h1 className="header-title">{(campaign && campaign.name) ? campaign.name : 'FF7 No-Slots for St. Jude'}</h1>

					<button className="header-button pointer" type="button" onClick={e => {
						e.preventDefault();
						requestCampaigns();
					}}>
						I'll try spinning. That's a good trick.
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

				<Donations donations={donations} utils={utils} />

				<Rewards rewards={rewards} utils={utils} />

				<Challenges challenges={challenges} utils={utils} />				
			</main>
		</div>
	);
};

export default Index;

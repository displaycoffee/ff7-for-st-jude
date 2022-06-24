/* react imports */
import { useState, useEffect } from 'react';

/* local script imports */
import { tiltify } from '../scripts/tiltify';
import { utils } from '../scripts/utils';

/* local component imports */
import Campaign from './Campaign';
import Donations from './Donations';
import Rewards from './Rewards';

/* setup cache of campaigns */ 
const localCache = {
	campaign : {},
	donations : {}
};

const Index = () => {
	// react variables
	let [campaign, setCampaign] = useState({});
	let [donations, setDonations] = useState({});
	let [rewards, setRewards] = useState({});

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
					// get donationAmount from localCache.donations to see if we should request donations again
					let donationAmount = utils.values.getTotal(0, localCache.donations[currentId], 'amount');

					if (donationAmount != currentData.amountRaised) {
						// request donationsConfig from api if amount has changed
						donationsConfig[currentId] = await tiltify.request.donations(currentId, currentData);
					} else {
						// get donationsConfig from cache instead
						donationsConfig[currentId] = localCache.donations[currentId];
					}
				} else {					
					// set initial donationsConfig from response
					donationsConfig[currentId] = await tiltify.request.donations(currentId, currentData);
					
					// add donationsConfig into localCache
					localCache.donations[currentId] = donationsConfig[currentId];
				}

				// set initial rewardsConfig from response (no localCache for rewards :()
				rewardsConfig[currentId] = await tiltify.request.rewards(currentId, currentData);
			}
			
			// set donations
			donations = donationsConfig;
			setDonations(donations);

			// set rewards
			rewards = rewardsConfig;
			setRewards(rewards);
		}
	}

	return (
		<div className="wrapper">
			<h1>{(campaign && campaign.name) ? campaign.name : 'FF7 No-Slots for St. Jude'}</h1>

			<main className="layout">
				<button type="button" onClick={e => {
					e.preventDefault();
					requestCampaigns();
				}}>
					I'll try spinning. That's a good trick.
				</button>

				{campaign && (
					<Campaign campaign={campaign} />
				)}

				{donations && (
					<Donations donations={donations} utils={utils} />
				)}

				{rewards && (
					<Rewards rewards={rewards} utils={utils} />
				)}				
			</main>
		</div>
	);
};

export default Index;

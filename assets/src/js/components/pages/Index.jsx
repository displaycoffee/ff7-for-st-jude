/* react imports */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

/* local script imports */
import { getToken } from '../../scripts/auth';
import { tiltify } from '../../scripts/tiltify';
import { utils } from '../../scripts/utils';
import { theme } from '../../scripts/theme';

/* local component imports */
import { Navigation } from '../elements/Navigation';
import { NewGame } from './NewGame';
import { Continue } from './Continue';

/* setup cache of campaigns */
let localCache = {
	supporting: {},
	campaign: {},
	donations: {},
	rewards: {},
	challenges: {},
};

export const Index = () => {
	// state variables
	let [campaign, setCampaign] = useState(false);
	let [supporting, setSupporting] = useState(false);

	useEffect(() => {
		requestCampaigns();
	}, []);

	async function requestCampaigns() {
		// get token for auth
		const token = await getToken();

		// get data of supporting campaigns
		const supportingResponse = await fetch(`${tiltify.api}${tiltify.campaign}/supporting_campaigns`, tiltify.fetchParams(token));
		const supportingJson = await supportingResponse.json();
		console.log(supportingJson);
		// if (supportingJson && supportingJson.data) {
		// 	if (Object.keys(localCache.campaign).length > 0) {
		// 		const campaignAmount = utils.values.getTotal(localCache.campaign.amountRaised, supportingJson.data, 'amountRaised');
		// 		// only request campaign from api if amount has changed and add into localCache
		// 		if (utils.values.convertDecimal(campaignAmount) != utils.values.convertDecimal(localCache.campaign.totalAmountRaised)) {
		// 			localCache.campaign = await tiltify.request.campaign();
		// 		}
		// 	} else {
		// 		// initially add campaignConfig into localCache
		// 		localCache.campaign = await tiltify.request.campaign();
		// 	}
		// 	// loop through supportingJson to add supporting campaigns
		// 	for (let i = 0; i < supportingJson.data.length; i++) {
		// 		const data = supportingJson.data[i];
		// 		const id = data.id;
		// 		if (!localCache.supporting[id]) {
		// 			// add supporting campaigns to localCache
		// 			data.campaignId = utils.values.toNumber(data.id);
		// 			data.isBase = false;
		// 			data.username = data.user.username.trim();
		// 			data.campaign = `${data.user.url}/${data.slug}`;
		// 			data.links = [
		// 				{
		// 					label: `Support ${data.username}`,
		// 					url: data.campaign,
		// 				},
		// 			];
		// 			if (data?.livestream?.type == 'twitch') {
		// 				data.links.unshift({
		// 					label: 'Watch stream',
		// 					url: `https://${data.livestream.type}.tv/${data.livestream.channel}`,
		// 				});
		// 			}
		// 			localCache.supporting[id] = data;
		// 		}
		// 	}
		// 	// set base campaign (and add details)
		// 	const campaignUrl = `${localCache.campaign.url}/${localCache.campaign.slug}`;
		// 	localCache.campaign.date = 'December 10, 2022';
		// 	localCache.campaign.links = [
		// 		{
		// 			label: campaignUrl.replace('https://', ''),
		// 			url: campaignUrl,
		// 		},
		// 	];
		// 	campaign = [localCache.campaign];
		// 	setCampaign(campaign);
		// 	// add base campaign to localCache.supporting
		// 	let baseCampaign = campaign[0];
		// 	baseCampaign.isBase = true;
		// 	baseCampaign.username = baseCampaign.user.username.trim();
		// 	baseCampaign.campaign = baseCampaign.user.url;
		// 	localCache.supporting[baseCampaign.id] = baseCampaign;
		// 	// set supporting campaigns
		// 	supporting = localCache.supporting;
		// 	setSupporting(supporting);
		// }
	}

	// setup navigation links
	const navigationLinks = [
		{
			label: 'NEW GAME',
			attributes: {
				to: '/',
			},
		},
		{
			label: 'Continue?',
			attributes: {
				to: '/continue',
			},
		},
	];

	// determine basename for route
	let basename = '';
	if (window.location.pathname.includes('/ff7-st-jude')) {
		basename = '/ff7-st-jude';
	}

	return (
		<div className="wrapper">
			<main id="top" className="layout">
				<Router basename={basename}>
					<Navigation links={navigationLinks} navClass={'navigation-top'} />

					<Routes>
						<Route
							path="/continue"
							element={
								supporting ? (
									<Continue
										supporting={supporting}
										campaign={campaign}
										localCache={localCache}
										tiltify={tiltify}
										utils={utils}
										theme={theme}
									/>
								) : null
							}
						/>

						<Route
							path="/"
							element={
								<NewGame
									supporting={supporting}
									campaign={campaign}
									previous={tiltify.campaigns}
									buttonClick={requestCampaigns}
									utils={utils}
									theme={theme}
								/>
							}
						/>
					</Routes>
				</Router>

				<section className="credits">
					Created by{' '}
					<a href="https://github.com/displaycoffee" target="_blank">
						displaycoffee
					</a>
					.
				</section>
			</main>
		</div>
	);
};

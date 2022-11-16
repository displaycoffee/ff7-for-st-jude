/* react imports */
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

/* local script imports */
import { tiltify } from '../../scripts/tiltify';
import { utils } from '../../scripts/utils';

/* local component imports */
import Navigation from '../elements/Navigation';
import NewGame from './NewGame';
import Continue from './Continue';

/* setup cache of campaigns */
let localCache = {
	supporting: {},
	campaign: {},
	donations: {},
	rewards: {},
	challenges: {},
};

const Index = () => {
	// state variables
	let [campaign, setCampaign] = useState(false);
	let [supporting, setSupporting] = useState(false);

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
					data.campaignId = data.id;
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
		}
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

	return (
		<div className="wrapper">
			<main id="top" className="layout">
				<Router>
					<Navigation links={navigationLinks} />

					<Routes>
						<Route
							path="/continue"
							element={
								supporting ? <Continue supporting={supporting} campaign={campaign} localCache={localCache} utils={utils} /> : null
							}
						/>

						<Route
							path="/"
							element={<NewGame supporting={supporting} campaign={campaign} buttonClick={requestCampaigns} utils={utils} />}
						/>
					</Routes>
				</Router>
			</main>
		</div>
	);
};

export default Index;

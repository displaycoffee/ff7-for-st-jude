/* react imports */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';

/* local script imports */
import { config } from '../../scripts/config';

/* local component imports */
import { Continue } from './Continue';
import { NewGame } from './NewGame';
import { Navigation } from '../elements/Navigation';

/* setup cache of campaigns */
let localCache = {
	campaign: {},
	challenges: {},
	donations: {},
	rewards: {},
	supporting: {},
	token: {},
};

export const Index = () => {
	const { campaigns, navigation, requests, utils, variables } = config;

	// state variables
	let [token, setToken] = useState(false);
	let [campaign, setCampaign] = useState(false);
	let [supporting, setSupporting] = useState(false);

	useEffect(() => {
		requestCampaigns();
	}, []);

	async function requestCampaigns() {
		// get token for auth
		const tokenDetails = await requests.token();
		localCache.token = tokenDetails;
		token = localCache.token;
		setToken(token);

		// set id of current campaign
		const id = campaigns.current.id;

		// get data of supporting campaigns
		localCache.supporting = await requests.supporting(id, localCache.token.token);

		if (localCache.supporting) {
			if (Object.keys(localCache.campaign).length > 0) {
				const campaignTotal = utils.values.getTotal(localCache.campaign.amounts.amount_raised, localCache.supporting, 'amount_raised');

				// only request campaign from api if amount has changed and add into localCache
				if (campaignTotal != localCache.campaign.amounts.total_amount_raised) {
					localCache.campaign = await requests.campaign(id, localCache.token.token);
				}
			} else {
				// initially add campaignConfig into localCache
				localCache.campaign = await requests.campaign(id, localCache.token.token);
			}

			// set team campaign (and add details)
			localCache.campaign.date = campaigns.current.date;
			localCache.campaign.links = campaigns.current.links;
			campaign = [localCache.campaign];
			setCampaign(campaign);

			// set supporting campaigns
			supporting = localCache.supporting;
			setSupporting(supporting);
		}
	}

	return (
		<div className="wrapper">
			<main id="top" className="layout">
				<Router basename={variables.paths.base}>
					<Navigation links={navigation.index} navClass={'navigation-top'} />

					<Routes>
						<Route
							path="/continue"
							element={
								supporting ? <Continue campaign={campaign} config={config} localCache={localCache} supporting={supporting} /> : null
							}
						/>

						<Route
							path="/"
							element={
								<NewGame
									buttonClick={requestCampaigns}
									campaign={campaign}
									config={config}
									previous={campaigns.previous}
									supporting={supporting}
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

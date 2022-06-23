/* react imports */
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

/* local script imports */
import { tiltify } from '../scripts/tiltify';
import { utils } from '../scripts/utils';

/* local component imports */
import Campaign from './Campaign';
import Donations from './Donations';

/* setup cache of campaigns */ 
const localCache = {};

const Index = () => {
	// react variables
	let [campaign, setCampaign] = useState({});
	let [donations, setDonations] = useState({});

	useEffect(() => {
		requestCampaigns();
	}, []);

	async function requestCampaigns() {
		// get data of supporting campaigns
		const supportingResponse = await fetch(tiltify.api.supporting(tiltify.campaign), tiltify.fetchParams);
		const supportingJson = await supportingResponse.json();

		if (supportingJson && supportingJson.data) {
			// initial lists to set responses later
			let donationsList = {};

			// get data of base campaign to include donations
			const campaignResponse = await fetch(tiltify.api.campaign(tiltify.campaign), tiltify.fetchParams);
			const campaignJson = await campaignResponse.json();	

			if (campaignJson && campaignJson.data) {
				// update user data of campaign
				campaignJson.data.url = campaignJson.data.team.url;
				campaignJson.data.user = {
					username : campaignJson.data.name,
					url : campaignJson.data.team.url
				};

				// push data to supporting campaigns
				supportingJson.data.push(campaignJson.data);

				// set state for base campaign
				campaign = campaignJson.data;
				setCampaign(campaign);		
			}

			for (let i = 0; i < supportingJson.data.length; i++) {
				let currentData = supportingJson.data[i];
				let currentId = currentData.id;
				
				if (!localCache[currentId]) {
					// add supporting campaign data into cache
					localCache[currentId] = currentData;

					// request donations from api
					donationsList[currentId] = await requestDonations(currentId, currentData);
				} else {
					if (localCache[currentId].amountRaised != currentData.amountRaised) {
						// request donations from api if amount has changed
						donationsList[currentId] = await requestDonations(currentId, currentData);
					}
				}
			}

			// set donations
			donations = donationsList;
			setDonations(donations);
		}

		async function requestDonations(id,  data) {
			const donationsResponse = await fetch(tiltify.api.donations(id), tiltify.fetchParams);		
			const donationsJson = await donationsResponse.json();
			if (donationsJson && donationsJson.data) {
				// add user data to donation
				donationsJson.data = donationsJson.data.map((donation) => {
					donation.slug = data.slug;
					donation.user = data.user;
					return donation;
				});
				return donationsJson.data;
			}
		}
	}

	return (
		<div className="wrapper">
			<h1>{(campaign && campaign.name) ? campaign.name : 'FF7 No-Slots for St. Jude'}</h1>

			<main className="layout">
				{campaign && (
					<Campaign campaign={campaign} />
				)}
				
				{donations && (
					<Donations donations={donations} utils={utils} />
				)}
			</main>
		</div>
	);
};

export default Index;

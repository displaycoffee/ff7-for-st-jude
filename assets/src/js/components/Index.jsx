/* react imports */
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

/* local imports */
import  { tiltify } from '../scripts/tiltify';

/* setup cache of campaigns */ 
const localCache = {};

const Index = () => {
	// react variables
	let [donations, setDonations] = useState([]);

	useEffect(() => {
		requestCampaigns();
	}, []);

	async function requestCampaigns() {
		const supportingResponse = await fetch(tiltify.api.supporting(tiltify.campaign), tiltify.fetchParams);
		const supportingJson = await supportingResponse.json();

		if (supportingJson && supportingJson.data) {
			supportingJson.data.forEach((data) => {
				// add supporting campaign data into cache
				localCache[data.id] = data;
			});

			// request donations from api
			requestDonations(supportingJson.data);
		}
		
		// notes: data.amountRaised for donations
		
		console.log(localCache)
	}
	
	async function requestDonations(data) {
		for (let i = 0; i < data.length; i++) {
			let current = data[i];
			const response = await fetch(tiltify.api.donations(current.id), tiltify.fetchParams);		
			const json = await response.json().data;
			if (json && json.data && localCache[current.id]) {
				localCache[current.id].donations = json.data;
			}
		}
	}		
		
	return (
		<div className="wrapper">
			<main className="layout">
				hello
			</main>
		</div>
	);
};

export default Index;

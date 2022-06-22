/* react imports */
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

/* local imports */ 
import secret from '../../../../secret.txt';

const Index = () => {
	// react variables
	let [loading, setLoading] = useState(true);
	let [campaigns, setCampaigns] = useState([]);

	useEffect(() => {
		requestCampaigns();
	}, []);

	async function requestCampaigns() {
		const response = await fetch(`https://tiltify.com/api/v3/campaigns/169251/supporting-campaigns`, {
			method: 'GET',
			headers: {
				'Authorization' : 'Bearer ' + secret,
				'Content-Type' : 'application/json'
			}
		});

		const json = await response.json();
		setCampaigns(json.data);
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

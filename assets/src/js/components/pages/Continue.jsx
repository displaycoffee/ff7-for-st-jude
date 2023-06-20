/* react imports */
import { useState, useEffect } from 'react';

/* local component imports */
import { Header } from '../elements/Header';
import { Navigation } from '../elements/Navigation';
import { Details } from '../elements/Details';

export const Continue = (props) => {
	let { campaign, config, localCache, supporting } = props;
	const { navigation, requests, theme, utils } = config;

	// state variables
	let [donations, setDonations] = useState(false);
	let [rewards, setRewards] = useState(false);
	let [targets, setTargets] = useState(false);

	useEffect(() => {
		requestContent();
	}, []);

	async function requestContent() {
		// initially add donations into cache (these can be fetched from the team campaign)
		localCache.donations = await requests.donations(localCache.token.token, campaign, supporting);

		// loop through supporting to fetch content
		for (const support in supporting) {
			const supportData = supporting[support];
			const id = supportData.id;

			// initially add content (rewards and targets) into localCache
			const content = await requests.content(id, localCache.token.token, supportData);
			localCache.rewards[id] = content.rewards;
			localCache.targets[id] = content.targets;
		}

		// set donations
		donations = localCache.donations;
		setDonations(donations);

		// set rewards
		rewards = localCache.rewards;
		setRewards(rewards);

		// set targets
		targets = localCache.targets;
		setTargets(targets);
	}

	return (
		<>
			<Header buttonClick={requestContent} />

			<Details details={campaign} settings={theme.details.campaign} utils={utils} />

			<Navigation links={navigation.continue} />

			<Details details={donations} settings={theme.details.donations} utils={utils} />

			<Details details={rewards} settings={theme.details.rewards} utils={utils} />

			<Details details={targets} settings={theme.details.targets} utils={utils} />
		</>
	);
};

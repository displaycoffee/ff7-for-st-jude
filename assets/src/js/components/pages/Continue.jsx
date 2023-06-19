/* react imports */
import { useState, useEffect } from 'react';

/* local component imports */
import { Header } from '../elements/Header';
import { Navigation } from '../elements/Navigation';
import { Details } from '../elements/Details';

export const Continue = (props) => {
	let { campaign, config, localCache, supporting } = props;
	const { campaigns, navigation, requests, theme, utils, variables } = config;

	// state variables
	let [donations, setDonations] = useState(false);
	let [rewards, setRewards] = useState(false);
	let [challenges, setChallenges] = useState(false);

	useEffect(() => {
		requestContent();
	}, []);

	async function requestContent() {
		// initially add donations into cache (these can be fetched from the team campaign)
		localCache.donations = await requests.donations(localCache.token.token, campaign, supporting);

		// // loop through supporting to fetch content
		// for (const support in supporting) {
		// 	const data = supporting[support];
		// 	const id = data.id;

		// 	if (localCache.donations[id]) {
		// 		// const donationAmount = utils.values.getTotal(0, localCache.donations[id], 'amount');
		// 		// const donationsChanged = utils.values.convertDecimal(donationAmount) != utils.values.convertDecimal(data_raised);
		// 		// // only request donations from api if amount has changed
		// 		// // rewards and challenges always requested (there's no good way to tell if these have changed)
		// 		// const content = await requests.content(
		// 		// 	id,
		// 		// 	data.isBase,
		// 		// 	localCache.token.token,
		// 		// 	supporting,
		// 		// 	donationsChanged,
		// 		// 	localCache.donations[id]
		// 		// );
		// 		// localCache.donations[id] = content.donations;
		// 		// localCache.rewards[id] = content.rewards;
		// 		// localCache.challenges[id] = content.challenges;
		// 	} else {
		// 		// // initially add content into localCache
		// 		// const content = await requests.content(id, data.isBase, localCache.token.token, supporting, true, []);
		// 		// //localCache.donations[id] = content.donations;
		// 		// localCache.rewards[id] = content.rewards;
		// 		// localCache.challenges[id] = content.challenges;
		// 	}
		// }
		// set donations
		donations = localCache.donations;
		setDonations(donations);

		// set rewards
		// rewards = localCache.rewards;
		// setRewards(rewards);
		// // set challenges
		// challenges = localCache.challenges;
		// setChallenges(challenges);
	}

	return (
		<>
			<Header buttonClick={requestContent} />

			<Details details={campaign} settings={theme.details.campaign} utils={utils} />

			<Navigation links={navigation.continue} />

			<Details details={donations} settings={theme.details.donations} utils={utils} />
			{/* 
			<Details test={'rewards'} settings={theme.details.rewards} details={rewards} utils={utils} />

			<Details test={'challenges'} settings={theme.details.challenges} details={challenges} utils={utils} /> */}
		</>
	);
};

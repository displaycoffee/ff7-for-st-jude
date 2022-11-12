/* react imports */
import { useState, useEffect } from 'react';

/* local script imports */
import { tiltify } from '../../scripts/tiltify';

/* local component imports */
import Header from '../layout/Header';
import Navigation from '../layout/Navigation';
import Campaign from './Campaign';
import Donations from './Donations';
import Rewards from './Rewards';
import Challenges from './Challenges';

const Continue = (props) => {
	let { localCache, supporting, campaign, utils } = props;

	// state variables
	let [donations, setDonations] = useState(false);
	let [rewards, setRewards] = useState(false);
	let [challenges, setChallenges] = useState(false);

	useEffect(() => {
		requestContent();
	}, []);

	async function requestContent() {
		// loop through supporting to fetch content
		for (const support in supporting) {
			const data = supporting[support];
			const id = support;

			if (localCache.donations[id]) {
				const donationAmount = utils.values.getTotal(0, localCache.donations[id], 'amount');

				// only request content from api if amount has changed and add into localCache
				if (utils.values.convertDecimal(donationAmount) != utils.values.convertDecimal(data.amountRaised)) {
					const content = await tiltify.request.content(id);
					localCache.donations[id] = content.donations;
					localCache.rewards[id] = content.rewards;
					localCache.challenges[id] = content.challenges;
				}
			} else {
				// initially add content into localCache
				const content = await tiltify.request.content(id);
				localCache.donations[id] = content.donations;
				localCache.rewards[id] = content.rewards;
				localCache.challenges[id] = content.challenges;
			}
		}

		// set donations
		donations = localCache.donations;
		setDonations(donations);

		// set rewards
		rewards = localCache.rewards;
		setRewards(rewards);

		// set challenges
		challenges = localCache.challenges;
		setChallenges(challenges);
	}

	// setup navigation links
	const navigationLinks = [
		{
			label: 'Donations',
			attributes: {
				onClick: (e) => utils.scrollTo(e, 'donations'),
				className: 'pointer',
			},
		},
		{
			label: 'Rewards',
			attributes: {
				onClick: (e) => utils.scrollTo(e, 'rewards'),
				className: 'pointer',
			},
		},
		{
			label: 'Challenges',
			attributes: {
				onClick: (e) => utils.scrollTo(e, 'challenges'),
				className: 'pointer',
			},
		},
	];

	return (
		<>
			<Header buttonClick={requestContent} />

			<Campaign campaign={campaign} utils={utils} />

			<Navigation links={navigationLinks} />

			<Donations supporting={supporting} donations={donations} utils={utils} />

			<Rewards supporting={supporting} rewards={rewards} utils={utils} />

			<Challenges supporting={supporting} challenges={challenges} utils={utils} />
		</>
	);
};

export default Continue;

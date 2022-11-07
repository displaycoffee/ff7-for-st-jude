/* react imports */
import { useState, useEffect } from 'react';

/* local script imports */
import { tiltify } from '../../scripts/tiltify';

/* local component imports */
import Header from '../layout/Header';
import Donations from '../content/Donations';
import Rewards from '../content/Rewards';
import Challenges from '../content/Challenges';

const Content = (props) => {
	let { localCache, utils } = props;

	// state variables
	let [donations, setDonations] = useState(false);
	let [rewards, setRewards] = useState(false);
	let [challenges, setChallenges] = useState(false);

	useEffect(() => {
		requestContent();
	}, []);

	async function requestContent() {
		// loop through supporting to fetch content
		for (const support in localCache.supporting) {
			const data = localCache.supporting[support];
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

	return (
		<>
			<Header localCache={localCache} buttonClick={requestContent} utils={utils} />

			<nav className="navigation">
				<a
					onClick={(e) => utils.scrollTo(e, 'donations')}
					className="pointer">
					Donations
				</a>&nbsp;-&nbsp;
				<a
					onClick={(e) => utils.scrollTo(e, 'rewards')}
					className="pointer">
					Rewards
				</a>&nbsp;-&nbsp;
				<a
					onClick={(e) => utils.scrollTo(e, 'challenges')}
					className="pointer">
					Challenges
				</a>
			</nav>

			<Donations supporting={localCache.supporting} donations={donations} utils={utils} />

			<Rewards supporting={localCache.supporting} rewards={rewards} utils={utils} />

			<Challenges supporting={localCache.supporting} challenges={challenges} utils={utils} />
		</>
	);
};

export default Content;

/* react imports */
import { useState, useEffect } from 'react';

/* local component imports */
import { Header } from '../elements/Header';
import { Navigation } from '../elements/Navigation';
import { Details } from '../elements/Details';

export const Continue = (props) => {
	let { localCache, supporting, campaign, tiltify, utils, theme } = props;

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
				const donationsChanged = utils.values.convertDecimal(donationAmount) != utils.values.convertDecimal(data.amount_raised);

				// only request donations from api if amount has changed
				// rewards and challenges always requested (there's no good way to tell if these have changed)
				const content = await tiltify.request.content(id, supporting, donationsChanged, localCache.donations[id]);
				localCache.donations[id] = content.donations;
				localCache.rewards[id] = content.rewards;
				localCache.challenges[id] = content.challenges;
			} else {
				// initially add content into localCache
				const content = await tiltify.request.content(id, supporting, true, []);
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
				onClick: (e) => utils.scrollTo(e, 'detail-donations'),
				className: 'pointer',
			},
		},
		{
			label: 'Rewards',
			attributes: {
				onClick: (e) => utils.scrollTo(e, 'detail-rewards'),
				className: 'pointer',
			},
		},
		{
			label: 'Challenges',
			attributes: {
				onClick: (e) => utils.scrollTo(e, 'detail-challenges'),
				className: 'pointer',
			},
		},
	];

	return (
		<>
			<Header buttonClick={requestContent} />

			<Details settings={theme.details.campaign} details={campaign} utils={utils} />

			<Navigation links={navigationLinks} />

			<Details settings={theme.details.donations} details={donations} utils={utils} />

			<Details settings={theme.details.rewards} details={rewards} utils={utils} />

			<Details settings={theme.details.challenges} details={challenges} utils={utils} />
		</>
	);
};

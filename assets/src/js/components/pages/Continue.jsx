/* react imports */
import { useState, useEffect } from 'react';

/* local script imports */
import { tiltify } from '../../scripts/tiltify';

/* local component imports */
import Header from '../elements/Header';
import Navigation from '../elements/Navigation';
import Details from '../elements/Details';

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

	// campaign details
	const campaignDetails = {
		content: {
			details: campaign,
			header: 'Current campaign',
			name: 'Campaign',
		},
		sort: false,
		layout: {
			columns: 'whole',
		},
		skeleton: {
			columns: 1,
			paragraphs: 5,
		},
	};

	// donation details
	const donationsDetails = {
		content: {
			details: donations,
			header: 'Donations',
			name: 'Donation',
		},
		sort: {
			field: 'completedAt',
			direction: 'desc',
		},
		layout: {
			columns: 'third',
		},
		skeleton: {
			columns: 12,
			paragraphs: 2,
		},
	};

	// rewards details
	const rewardsDetails = {
		content: {
			details: rewards,
			header: 'Rewards ending soon',
			name: 'Reward',
			linkLabel: 'Redeem at',
		},
		sort: {
			field: 'endsAt',
			direction: 'asc',
		},
		layout: {
			columns: 'third',
		},
		skeleton: {
			columns: 12,
			paragraphs: 5,
		},
	};

	// challenges details
	const challengesDetails = {
		content: {
			details: challenges,
			header: 'Challenges ending soon',
			name: 'Challenge',
			linkLabel: 'Participate at',
		},
		sort: {
			field: 'endsAt',
			direction: 'asc',
		},
		layout: {
			columns: 'third',
		},
		skeleton: {
			columns: 12,
			paragraphs: 4,
		},
	};

	return (
		<>
			<Header buttonClick={requestContent} />

			<Details details={campaignDetails} supporting={supporting} utils={utils} />

			<Navigation links={navigationLinks} />

			<Details details={donationsDetails} supporting={supporting} utils={utils} />

			<Details details={rewardsDetails} supporting={supporting} utils={utils} />

			<Details details={challengesDetails} supporting={supporting} utils={utils} />
		</>
	);
};

export default Continue;

/* React */
import { useContext, useState, useEffect } from 'react';

/* Local styles */
import './styles/home.scss';

/* Local scripts */
//import { useCampaign, useSupporting } from '../../_config/scripts/hooks';

/* Local components */
import { Context } from '../../context/Context';
import { Details, DetailsParagraph, DetailsLinks } from '../../components/details/Details';
import { Skeleton } from '../../components/skeleton/Skeleton';

export const Home = () => {
	const context = useContext(Context);
	let { campaigns, utils, queryClient, content, setContent } = context;
	let { supporting, campaign } = content;
	let { current, previous } = campaigns;
	let retryLimit = 3;

	// State variables
	let [supportingCount, setSupportingCount] = useState(0);
	let [campaignCount, setCampaignCount] = useState(0);
	let [amountRaised, setAmountRaised] = useState(0);
	let [goal, setGoal] = useState(0);
	let [totalRaised, setTotalRaised] = useState(0);

	return (
		<>
			<p>this is an index page.</p>

			<ul>
				<li>Item 1</li>
				<li>Item 2</li>
				<li>Item 3</li>
				<li>Item 4</li>
			</ul>

			<ul className="unstyled">
				<li>Item 1</li>
				<li>Item 2</li>
				<li>Item 3</li>
				<li>Item 4</li>
			</ul>

			<ol>
				<li>Item 1</li>
				<li>Item 2</li>
				<li>Item 3</li>
				<li>Item 4</li>
			</ol>

			<ol className="unstyled">
				<li>Item 1</li>
				<li>Item 2</li>
				<li>Item 3</li>
				<li>Item 4</li>
			</ol>
		</>
	);
};

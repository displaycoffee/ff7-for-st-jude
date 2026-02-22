/* React */
import { useContext, useState, useEffect } from 'react';

/* Local styles */
import './styles/home.scss';

/* Local scripts */
import { useCampaign, useSupporting } from '../../_config/scripts/hooks';

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

	// Use custom hook to get supporting campaigns
	const [supportingData, supportingStatus] = useSupporting(content, current) as RequestType;
	const supportingComplete = (!supportingStatus.pending && supportingStatus.success) || supportingStatus.fetched ? true : false;

	// If there is no supporting data, reset and try again
	useEffect(() => {
		if (!supportingData && supportingCount < retryLimit) {
			// Set supporting count retries
			supportingCount += 1;
			setSupportingCount(supportingCount);

			// Reset and set content state
			content = { ...content, supporting: false };
			setContent(content);

			// Reset queries
			queryClient.resetQueries({ queryKey: ['supporting'] });
		}
	}, [supportingData]);

	// Use custom hook to get campaign
	const [campaignData, campaignStatus] = useCampaign(content, current) as RequestType;
	const campaignComplete = (!campaignStatus.pending && campaignStatus.success) || campaignStatus.fetched ? true : false;

	// If there is no campaign data, reset and try again
	useEffect(() => {
		if (!campaignData && campaignCount < retryLimit) {
			// Set campaign count retries
			campaignCount += 1;
			setCampaignCount(campaignCount);

			// Reset and set content state
			content = { ...content, campaign: false };
			setContent(content);

			// Reset queries
			queryClient.resetQueries({ queryKey: ['campaign'] });
		}
	}, [campaignData]);

	if (supportingComplete && campaignComplete) {
		// Update supporting
		supporting = utils.updateSupporting(supportingData);
		content.supporting = supporting;

		// Set team campaign (and add details)
		campaign = utils.updateCampaign(campaignData, campaigns);
		content.campaign = campaign;

		// Set variables for progress bar
		amountRaised =
			campaign?.amounts?.total_amount_raised && campaign.amounts.total_amount_raised !== false ? campaign.amounts.total_amount_raised : 0;
		goal = campaign?.amounts?.goal && campaign.amounts.goal !== false ? campaign.amounts.goal : 0;

		// Reset totalRaised and get amount raised from all campaigns
		totalRaised = 0;
		previous.forEach((campaign) => {
			totalRaised += campaign.amounts.total_amount_raised;
		});
		if (amountRaised) {
			totalRaised += amountRaised;
		}
	}

	useEffect(() => {
		if (supportingComplete && campaignComplete) {
			// Set content
			setContent(content);

			// Set amounts and totals
			setAmountRaised(amountRaised);
			setGoal(goal);
			setTotalRaised(totalRaised);
		}
	}, []);

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

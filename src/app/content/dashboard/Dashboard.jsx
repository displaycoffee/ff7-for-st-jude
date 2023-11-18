/* React */
import { useContext } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';

/* Local styles */
import './styles/index.scss';

/* Local scripts */
import { requests } from '../../_config/scripts/requests';

/* Local components */
import { Context } from '../../entry/context/Context';
import { Details } from '../../shared/details/Details';

export const Dashboard = (props) => {
	let { requestParams } = props;
	const context = useContext(Context);
	const { campaigns } = context;
	let { current } = campaigns;

	// Use query to get supporting campaigns
	const { data: supportingQuery } = useQuery({
		queryKey: ['supporting', requestParams, current.id],
		queryFn: requests.supporting,
	});
	const supportingResults = supportingQuery && supportingQuery.length !== 0 ? supportingQuery : false;

	// Use query to get donations
	const { data: donationQuery } = useQuery({
		queryKey: ['donations', requestParams, current.id, supportingResults],
		queryFn: requests.donations,
		enabled: !!supportingResults, // don't fetch until supportingResults is complete
	});
	const donationResults = donationQuery && donationQuery.length !== 0 ? donationQuery : false;

	// const donationsQueries = useQueries({
	// 	queries:
	// 		supportingResults && supportingResults.length !== 0
	// 			? supportingResults.map((result) => {
	// 					return {
	// 						queryKey: ['donations', requestParams, result.id, current.id, supportingResults],
	// 						queryFn: requests.donations,
	// 					};
	// 			  })
	// 			: [], // if users is undefined, an empty array will be returned
	// });
	// const donationsResults = donationsQueries?.data ? donationsQueries.data : false;
	// console.log(donationsQueries[0]?.data);

	return <>dashboard</>;
};

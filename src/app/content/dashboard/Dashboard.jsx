/* React */
import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';

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
	let { current, previous } = campaigns;

	// // Use query to get and show results
	// const campaignQuery = useQuery(['campaign', requestParams, current.id], requests.campaign);
	// const campaignResults = campaignQuery?.data ? campaignQuery.data : false;
	// current.amounts = campaignResults ? campaignResults.amounts : false;

	return <>dashboard</>;
};

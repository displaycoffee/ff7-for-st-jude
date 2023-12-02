/* React */
import { useContext } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';

/* Local scripts */
import { requests } from '../../_config/scripts/requests';

/* Local components */
import { Skeleton } from '../../shared/skeleton/Skeleton';
import { Context } from '../../entry/context/Context';
import { Details, DetailsParagraph, DetailsLinks } from '../../shared/details/Details';

export const Dashboard = (props) => {
	let { requestParams } = props;
	const context = useContext(Context);
	const { campaigns, utils, variables } = context;
	let { current } = campaigns;

	// use query to get supporting campaigns
	const { data: supportingQuery } = useQuery({
		queryKey: ['supporting', requestParams, current],
		queryFn: requests.supporting,
	});
	const supportingResults = supportingQuery && supportingQuery.length !== 0 ? supportingQuery : false;

	// use query to get donations
	const { data: donationsQuery } = useQuery({
		queryKey: ['donations', requestParams, current, supportingResults],
		queryFn: requests.donations,
		enabled: !!supportingResults, // don't fetch until supportingResults is complete
	});
	const donationsResults = donationsQuery && donationsQuery.length !== 0 ? donationsQuery : false;

	// use query to get rewards
	const rewardsQuery = useQueries({
		queries: supportingResults
			? supportingResults.map((result) => {
					return {
						queryKey: ['rewards', requestParams, result],
						queryFn: requests.rewards,
					};
			  })
			: [], // if supportingResults is undefined, an empty array will be returned
	});
	const rewardsResults = rewardsQuery && rewardsQuery.length !== 0 ? utils.filterData(rewardsQuery) : false;

	// use query to get targets
	const targetsQuery = useQueries({
		queries: supportingResults
			? supportingResults.map((result) => {
					return {
						queryKey: ['targets', requestParams, result],
						queryFn: requests.targets,
					};
			  })
			: [], // if supportingResults is undefined, an empty array will be returned
	});
	const targetsResults = targetsQuery && targetsQuery.length !== 0 ? utils.filterData(targetsQuery) : false;

	return (
		<>
			<Details header={'Donations'} hasRow={true} scrollLink={true}>
				<div className="row row-auto row-spacing-20 row-wrap">
					{donationsResults
						? donationsResults.map((donation) => {
								const { amount } = donation.amounts;

								return (
									<div className="column column-width-33" key={donation.id}>
										<div className="blue-section">
											{donation.amount ? (
												<p>
													<strong>Donation:</strong> ${amount.toFixed(2)} from {donation.donor_name} to{' '}
													<DetailsLinks links={donation?.links} wrapper={false} />
												</p>
											) : null}

											<DetailsParagraph label={'Comment'} content={donation?.donor_comment} />
										</div>
									</div>
								);
						  })
						: null}

					<Skeleton columns={6} perRow={3} paragraphs={2} />
				</div>
			</Details>

			<Details header={'Rewards'} hasRow={true} scrollLink={true}>
				<div className="row row-auto row-spacing-20 row-wrap">
					{rewardsResults
						? rewardsResults.map((reward) => {
								const { amount } = reward?.amounts ? reward.amounts : false;

								return reward ? (
									<div className="column column-width-33" key={reward.id}>
										<div className="blue-section">
											<DetailsParagraph label={'Reward'} content={reward?.name} />

											<DetailsParagraph label={'Description'} content={reward?.description} />

											<DetailsParagraph label={'Cost'} content={`$${amount.toFixed(2)}`} />

											{reward.date && !reward.date.includes(variables.placeholders.endDateReadable) && (
												<p>
													<strong>Ends:</strong> {reward.date}
												</p>
											)}

											<DetailsLinks links={reward?.links} />
										</div>
									</div>
								) : null;
						  })
						: null}

					<Skeleton columns={6} perRow={3} paragraphs={6} />
				</div>
			</Details>

			<Details header={'Targets'} hasRow={true} scrollLink={true}>
				<div className="row row-auto row-spacing-20 row-wrap">
					{targetsResults
						? targetsResults.map((target) => {
								const { amount_raised, amount } = target?.amounts ? target.amounts : false;

								return target ? (
									<div className="column column-width-33" key={target.id}>
										<div className="blue-section">
											<DetailsParagraph label={'Target'} content={target?.name} />

											<DetailsParagraph label={'Description'} content={target?.description} />

											<DetailsParagraph
												label={'Raised'}
												content={`$${amount_raised.toFixed(2)} out of $${amount.toFixed(2)}`}
											/>

											{target.date && !target.date.includes(variables.placeholders.endDateReadable) && (
												<p>
													<strong>Ends:</strong> {target.date}
												</p>
											)}

											<DetailsLinks links={target?.links} />
										</div>
									</div>
								) : null;
						  })
						: null}

					<Skeleton columns={6} perRow={3} paragraphs={5} />
				</div>
			</Details>
		</>
	);
};

/* React */
import { useContext } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';

/* Local styles */
import './styles/dashboard.scss';

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
	const { data: supportingQuery, refetch: supportingRefetch } = useQuery({
		queryKey: ['supporting', requestParams, current],
		queryFn: requests.supporting,
		enabled: !requestParams.supporting,
	});
	const hasSupporting = supportingQuery && supportingQuery.length !== 0 ? true : false;
	const supportingResults = hasSupporting ? supportingQuery : requestParams.supporting;

	// use query to get donations
	const { data: donationsQuery, refetch: donationRefetch } = useQuery({
		queryKey: ['donations', requestParams, current, supportingResults],
		queryFn: requests.donations,
		enabled: !!supportingResults && !requestParams.donations, // don't fetch until supportingResults is complete
	});
	const hasDonations = donationsQuery && donationsQuery.length !== 0 ? true : false;
	const donationsResults = hasDonations ? donationsQuery : requestParams.donations;

	// use query to get rewards
	const { data: rewardsQuery } = useQueries({
		queries:
			supportingResults && !requestParams.rewards
				? supportingResults.map((result) => {
						return {
							queryKey: ['rewards', requestParams, result],
							queryFn: requests.rewards,
							enabled: !requestParams.rewards[result.id],
						};
				  })
				: [], // if supportingResults is undefined, an empty array will be returned
	});
	const hasRewards = rewardsQuery && Object.keys(rewardsQuery).length !== 0 ? true : false;
	const rewardsResults = hasRewards ? utils.filterData(rewardsQuery) : utils.merge(utils.flatten(requestParams.rewards));

	// use query to get targets
	const { data: targetsQuery } = useQueries({
		queries:
			supportingResults && !requestParams.targets
				? supportingResults.map((result) => {
						return {
							queryKey: ['targets', requestParams, result],
							queryFn: requests.targets,
							enabled: !requestParams.targets[result.id],
						};
				  })
				: [], // if supportingResults is undefined, an empty array will be returned
	});
	const hasTargets = targetsQuery && Object.keys(targetsQuery).length !== 0 ? true : false;
	const targetsResults = hasTargets ? utils.filterData(targetsQuery) : utils.merge(utils.flatten(requestParams.targets));

	// scroll to section function
	const scrollToSection = (e, selector) => {
		e.preventDefault();
		document.querySelector(selector).scrollIntoView({
			behavior: 'smooth',
		});
	};

	return (
		<>
			<nav className="floating">
				<div className="blue-section">
					<ul className="floating-list unstyled">
						<li className="floating-list-item">
							<button className="pointer unstyled a" onClick={(e) => scrollToSection(e, '#details-donations')} type="button">
								Donations
							</button>
						</li>

						<li className="floating-list-item">
							<button className="pointer unstyled a" onClick={(e) => scrollToSection(e, '#details-rewards')} type="button">
								Rewards
							</button>
						</li>

						<li className="floating-list-item">
							<button className="pointer unstyled a" onClick={(e) => scrollToSection(e, '#details-targets')} type="button">
								Targets
							</button>
						</li>

						<li className="floating-list-item">
							<button
								className="pointer unstyled a"
								onClick={(e) => {
									// refresh content
									e.preventDefault();
									supportingRefetch();
									donationRefetch();
								}}
								type="button"
							>
								Refresh
							</button>
						</li>
					</ul>
				</div>
			</nav>

			<Details header={'Donations'} hasRow={true} scrollLink={true}>
				<div className="row row-auto row-spacing-20 row-wrap">
					{donationsResults
						? utils.sort(donationsResults, 'integer', 'milliseconds', 'desc').map((donation) => {
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
						? utils.sort(rewardsResults, 'integer', 'milliseconds', 'asc').map((reward) => {
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
						? utils.sort(targetsResults, 'integer', 'milliseconds', 'asc').map((target) => {
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

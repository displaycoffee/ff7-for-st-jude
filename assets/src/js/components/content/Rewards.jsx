/* local component imports */
import Skeleton from '../elements/Skeleton';
import UserLink from '../elements/UserLink';

const Rewards = (props) => {
	let { supporting, rewards, utils } = props;
	const rewardsSize = utils.size(rewards);

	// flatten, merge, and re-sort rewards
	const rewardsFlattened = utils.flatten(rewards);
	const rewardsMerged = utils.merge(rewardsFlattened);
	utils.values.sort(rewardsMerged, 'integer', 'endsAt', 'asc');

	return (
		<section id="detail-rewards" className="detail detail-rewards">
			<h3 className="detail-title">Rewards ending soon</h3>

			<div className={`detail-row${rewardsSize ? ' detail-row-loaded' : ''} flex-wrap`}>
				<Skeleton columns={12} perRow={'third'} paragraphs={5} />

				{rewardsSize
					? rewardsMerged.map((reward, index) => {
							return (
								<div className={`detail-column detail-column-third detail-column-${index}`} key={reward.id}>
									<div className="detail-column-inner">
										<p>
											<strong>Reward:</strong> {reward.name}
										</p>

										{reward.description && (
											<p>
												<strong>Description:</strong> {reward.description}
											</p>
										)}

										<p>
											<strong>Cost:</strong> ${reward.amount.toFixed(2)}
										</p>

										<p>
											<strong>Ends:</strong> {utils.values.getTime(reward.endsAt)}
										</p>

										<div className="detail-links">
											<UserLink wrapper={true} campaign={supporting[reward.campaignId]} label={'Redeem at'} />
										</div>
									</div>
								</div>
							);
					  })
					: null}
			</div>

			<a onClick={(e) => utils.scrollTo(e, 'top')} className="to-top pointer">
				^ Back to top
			</a>
		</section>
	);
};

export default Rewards;
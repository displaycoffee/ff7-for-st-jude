/* local component imports */
import Skeleton from './Skeleton';

const Rewards = (props) => {
	let { rewards, utils } = props;
	const rewardsSize = utils.size(rewards);

	// flatten, merge, and re-sort rewards
	const rewardsFlattened = utils.flatten(rewards);
	const rewardsMerged = utils.merge(rewardsFlattened);
	utils.values.sort(rewardsMerged, 'integer', 'endsAt', 'asc');
	
	return (
		<section id="rewards" className="detail detail-rewards">	
			<h3 className="detail-title">Rewards ending soon</h3>

			<div className={`detail-row${rewardsSize ? ' detail-row-loaded' : ''} flex-wrap`}>
				<Skeleton columns={12} paragraphs={5} />

				{rewardsSize ? (
					rewardsMerged.map((reward) => {
						return (
							<div className="detail-column" key={reward.id}>
								<div className="detail-column-inner">
									<p><strong>Reward:</strong> {reward.name}</p>
									{reward.description && (
										<p><strong>Description:</strong> {reward.description}</p>
									)}
									<p><strong>Cost:</strong> ${reward.amount.toFixed(2)}</p>
									<p><strong>Ends:</strong> {utils.values.getTime(reward.endsAt)}</p>
									<p><a href={reward.user.campaign} target="_blank">Redeem at {reward.user.username}</a></p>
								</div>
							</div>
						)
					})
				) : (null)}
			</div>

			<a 
				onClick={(e) => utils.scrollTo(e, 'top')} 
				className="to-top pointer">
				^ Back to top
			</a>
		</section>
	);
};

export default Rewards;

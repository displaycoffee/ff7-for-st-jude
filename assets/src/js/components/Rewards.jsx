const Rewards = (props) => {
	let { rewards, utils } = props;

	// flatten, merge, and re-sort rewards
	const rewardsFlattened = utils.flatten(rewards);
	const rewardsMerged = utils.merge(rewardsFlattened);
	utils.values.sort(rewardsMerged, 'integer', 'endsAt', 'asc');
	
	return (
		(rewardsMerged && rewardsMerged.length > 0) && (
			<>
				<h3>Rewards Ending Soon</h3>

				{rewardsMerged.map((reward) => {
					return (
						<div key={reward.id}>
							<strong>Name:</strong> {reward.name}<br />
							{reward.description && (
								<><strong>Description:</strong> {reward.description}<br /></>
							)}
							<strong>Cost:</strong> ${reward.amount.toFixed(2)}<br />
							<strong>Campaign:</strong> {reward.user.campaign}<br />
							<strong>Runner:</strong> {reward.user.username} -- {reward.user.url}<br /><br />
						</div>
					)
				})}
			</>
		)
	);
};

export default Rewards;

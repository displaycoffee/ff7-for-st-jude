/* local component imports */
import Skeleton from './Skeleton';

const Challenges = (props) => {
	let { challenges, utils } = props;
	const challengesSize = utils.size(challenges);

	// flatten, merge, and re-sort challenge
	const challengesFlattened = utils.flatten(challenges);
	const challengesMerged = utils.merge(challengesFlattened);
	utils.values.sort(challengesMerged, 'integer', 'endsAt', 'asc');
	
	return (
		<section id="challenges" className="detail detail-challenges">	
			<h3 className="detail-title">Challenges ending soon</h3>

			<div className={`detail-row${challengesSize ? ' detail-row-loaded' : ''} flex-wrap`}>
				<Skeleton columns={12} paragraphs={4} />

				{challengesSize ? (
					challengesMerged.map((challenge) => {
						return (
							<div className="detail-column" key={challenge.id}>
								<div className="detail-column-inner">
									<p><strong>Challenge:</strong> {challenge.name}</p>
									<p><strong>Cost:</strong> ${challenge.amount.toFixed(2)}</p>
									<p><strong>Ends:</strong> {utils.values.getTime(challenge.endsAt)}</p>
									<p><a href={challenge.user.campaign} target="_blank">Participate at {challenge.user.username}</a></p>
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

export default Challenges;

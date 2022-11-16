/* local component imports */
import Skeleton from '../elements/Skeleton';
import UserLink from '../elements/UserLink';

const Challenges = (props) => {
	let { supporting, challenges, utils } = props;
	const challengesSize = utils.size(challenges);

	// flatten, merge, and re-sort challenge
	const challengesFlattened = utils.flatten(challenges);
	const challengesMerged = utils.merge(challengesFlattened);
	utils.values.sort(challengesMerged, 'integer', 'endsAt', 'asc');

	return (
		<section id="detail-challenges" className="detail detail-challenges">
			<h3 className="detail-title">Challenges ending soon</h3>

			<div className={`detail-row${challengesSize ? ' detail-row-loaded' : ''} flex-wrap`}>
				<Skeleton columns={12} perRow={'quarter'} paragraphs={4} />

				{challengesSize
					? challengesMerged.map((challenge, index) => {
							return (
								<div className={`detail-column detail-column-quarter detail-column-${index}`} key={challenge.id}>
									<div className="detail-column-inner">
										<p>
											<strong>Challenge:</strong> {challenge.name}
										</p>

										<p>
											<strong>Raised:</strong> ${challenge.totalAmountRaised.toFixed(2)} out of ${challenge.amount.toFixed(2)}
										</p>

										<p>
											<strong>Ends:</strong> {utils.values.getTime(challenge.endsAt)}
										</p>

										<div className="detail-links">
											<UserLink wrapper={true} campaign={supporting[challenge.campaignId]} label={'Participate at'} />
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

export default Challenges;

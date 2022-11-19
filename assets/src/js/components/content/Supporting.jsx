/* local component imports */
import Skeleton from '../elements/Skeleton';
import UserLink from '../elements/UserLink';

const Supporting = (props) => {
	let { supporting, utils } = props;
	const supportingSize = utils.size(supporting);

	// flatten, merge, and re-sort challenge
	const supportingFlattened = utils.flatten(supporting);
	const supportingMerged = utils.merge(supportingFlattened);
	utils.values.sort(supportingMerged, 'integer', 'totalAmountRaised', 'desc');

	return (
		<section className="detail detail-supporting">
			<h3 className="detail-title">Supporting campaigns</h3>

			<div className={`detail-row${supportingSize ? ' detail-row-loaded' : ''} flex-wrap`}>
				<Skeleton columns={8} perRow={'half'} paragraphs={4} />

				{supportingSize
					? supportingMerged.map((support, index) => {
							return (
								<div className={`detail-column detail-column-half detail-column-${index}`} key={support.id}>
									<div className="detail-column-inner">
										<p>
											<strong>Campaign:</strong> {support.name}
										</p>

										<p>
											<strong>Raised:</strong> ${support.totalAmountRaised.toFixed(2)}
										</p>

										<div className="detail-links">
											{support.twitch && (
												<p>
													<a href={support.twitch} target="_blank">
														Watch stream
													</a>
												</p>
											)}

											<UserLink wrapper={true} campaign={supporting[support.campaignId]} label={'Support'} />
										</div>
									</div>
								</div>
							);
					  })
					: null}
			</div>
		</section>
	);
};

export default Supporting;

/* local component imports */
import Skeleton from '../elements/Skeleton';

const Campaign = (props) => {
	let { campaign, utils } = props;
	const campaignUrl = `${campaign.url}/${campaign.slug}`;
	const campaignSize = utils.size(campaign);

	return (
		<section className="detail detail-campaign">
			<h3 className="detail-title">Current campaign</h3>

			<div className={`detail-row${campaignSize ? ' detail-row-loaded' : ''} flex-wrap`}>
				<Skeleton columns={1} perRow={'whole'} paragraphs={5} />

				{campaignSize ? (
					<div className="detail-column detail-column-whole detail-column-0">
						<div className="detail-column-inner">
							<p>
								<strong>Campaign:</strong> {campaign.name}
							</p>

							<p>
								<strong>Date:</strong> December 10, 2022
							</p>

							<div className="p">
								<strong>Raised:</strong>
								{` `}
								<div className="level-bar">
									<div className="level-bar-label">
										${campaign.totalAmountRaised.toFixed(2)} out of ${campaign.fundraiserGoalAmount.toFixed(2)}
									</div>

									<div className="level-bar-outof">
										<div
											className="level-bar-progress"
											style={{
												width: `${(campaign.totalAmountRaised / campaign.fundraiserGoalAmount) * 100}%`,
											}}
										></div>

										<div className="level-bar-shadow"></div>
									</div>
								</div>
							</div>

							<p>
								<strong>About:</strong> {campaign.description}
							</p>

							<div className="detail-links">
								<p>
									<a href={campaignUrl} target="_blank">
										{campaignUrl.replace('https://', '')}
									</a>
								</p>
							</div>
						</div>
					</div>
				) : null}
			</div>
		</section>
	);
};

export default Campaign;

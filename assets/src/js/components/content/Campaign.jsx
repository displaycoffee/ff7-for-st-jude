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
				<Skeleton columns={1} perRow={'whole'} paragraphs={4} />

				{campaignSize ? (
					<div className="detail-column detail-column-whole detail-column-0">
						<div className="detail-column-inner">
							<p>
								<strong>Name:</strong> {campaign.name}
							</p>

							<p>
								<strong>Raised:</strong> ${campaign.totalAmountRaised.toFixed(2)}
							</p>

							<p>
								<strong>Goal:</strong> ${campaign.fundraiserGoalAmount.toFixed(2)}
							</p>

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

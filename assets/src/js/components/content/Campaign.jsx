/* local component imports */
import Skeleton from '../layout/Skeleton';

const Campaign = (props) => {
	let { campaign, utils } = props;
	const campaignUrl = `${campaign.url}/${campaign.slug}`;
	const campaignSize = utils.size(campaign);

	return (
		<section className='detail detail-campaign'>
			<h3 className='detail-title'>Current campaign</h3>

			<div className={`detail-row${campaignSize ? ' detail-row-loaded' : ''} flex-wrap`}>
				<Skeleton columns={1} paragraphs={4} />

				{campaignSize ? (
					<div className='detail-column detail-column-whole'>
						<div className='detail-column-inner'>
							<p>
								<strong>Name:</strong> {campaign.name}
							</p>
							<p>
								<strong>Total Raised:</strong> ${campaign.totalAmountRaised.toFixed(2)}
							</p>
							<p>
								<strong>Current Goal:</strong> ${campaign.fundraiserGoalAmount.toFixed(2)}
							</p>
							<p>
								<strong>About:</strong> {campaign.description}
							</p>
							<p>
								<a href={campaignUrl} target='_blank'>
									{campaignUrl.replace('https://', '')}
								</a>
							</p>
						</div>
					</div>
				) : null}
			</div>
		</section>
	);
};

export default Campaign;

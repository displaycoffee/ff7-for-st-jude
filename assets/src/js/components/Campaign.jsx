/* local component imports */
import Skeleton from './Skeleton';

const Campaign = (props) => {
	let { campaign, utils } = props;
	const campaignUrl = `${campaign.url}/${campaign.slug}`;
	const campaignSize = utils.size(campaign);

	return (
		<section className="detail detail-campaign">	
			<h3 className="detail-title">About this campaign</h3>
			
			<div className={`detail-row${campaignSize ? ' detail-row-loaded' : ''} flex-wrap`}>
				<Skeleton columns={1} paragraphs={3} />

				{campaignSize ? (
					<div className="detail-column">
						<div className="detail-column-inner">
							<p><strong>Total Raised:</strong> ${campaign.totalAmountRaised}</p>
							<p><strong>About:</strong> {campaign.description}</p>
							<p><a href={campaignUrl} target="_blank">{campaignUrl.replace('https://', '')}</a></p>
						</div>
					</div>
				) : (null)}
			</div>
		</section>
	);
};

export default Campaign;

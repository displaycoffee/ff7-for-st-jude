/* local component imports */
import Skeleton from '../elements/Skeleton';
import UserLink from '../elements/UserLink';

const Previous = (props) => {
	let { previous } = props;
	const previousSize = previous.length;

	return (
		<section id="detail-challenges" className="detail detail-challenges">
			<h3 className="detail-title">Previous campaigns</h3>

			<div className={`detail-row${previousSize ? ' detail-row-loaded' : ''} flex-wrap`}>
				<Skeleton columns={2} perRow={'half'} paragraphs={4} />

				{previousSize
					? previous.map((campaign, index) => {
							return (
								<div className={`detail-column detail-column-half detail-column-${index}`} key={campaign.id}>
									<div className="detail-column-inner">
										<p>
											<strong>Campaign:</strong> {campaign.name}
										</p>

										<p>
											<strong>Date:</strong> {campaign.date}
										</p>

										<p>
											<strong>Raised:</strong> ${campaign.totalAmountRaised}
										</p>

										<div className="detail-links">
											<UserLink wrapper={true} campaign={campaign} label={'See campaign'} />
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

export default Previous;

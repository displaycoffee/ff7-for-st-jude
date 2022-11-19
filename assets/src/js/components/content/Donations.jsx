/* local component imports */
import Skeleton from '../elements/Skeleton';
import UserLink from '../elements/UserLink';

const Donations = (props) => {
	let { supporting, donations, utils } = props;
	const donationsSize = utils.size(donations);

	// flatten, merge, and re-sort donations
	const donationsFlattened = utils.flatten(donations);
	const donationsMerged = utils.merge(donationsFlattened);
	utils.values.sort(donationsMerged, 'integer', 'completedAt', 'desc');

	return (
		<section id="detail-donations" className="detail detail-donations">
			<h3 className="detail-title">Donations</h3>

			<div className={`detail-row${donationsSize ? ' detail-row-loaded' : ''} flex-wrap`}>
				<Skeleton columns={12} perRow={'third'} paragraphs={2} />

				{donationsSize
					? donationsMerged.map((donation, index) => {
							return (
								<div className={`detail-column detail-column-third detail-column-${index}`} key={donation.id}>
									<div className="detail-column-inner">
										<p>
											<strong>Donation:</strong> ${donation.amount.toFixed(2)} from {donation.name} to&nbsp;
											<UserLink wrapper={false} campaign={supporting[donation.campaignId]} />
										</p>

										{donation.comment && (
											<p>
												<strong>Comment:</strong> {donation.comment}
											</p>
										)}
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

export default Donations;
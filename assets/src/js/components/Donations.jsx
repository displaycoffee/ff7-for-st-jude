const Donations = (props) => {
	let { donations, utils } = props;

	// flatten, merge, and re-sort donations
	const donationsFlattened = utils.flatten(donations);
	const donationsMerged = utils.merge(donationsFlattened);
	utils.values.sort(donationsMerged, 'integer', 'updatedAt', 'desc');

	return (
		(donationsMerged && donationsMerged.length > 0) && (
			<>
				<h3>Donations</h3>

				{donationsMerged.map((donation) => {
					return (
						<div key={donation.id}>
							<strong>Amount:</strong> ${donation.amount}<br />
							<strong>From:</strong> {donation.name}<br />
							{donation.comment && (
								<><strong>Comment:</strong> {donation.comment}<br /></>
							)}
							<strong>Campaign:</strong> {donation.user.url}/{donation.slug}<br />
							<strong>Runner:</strong> {donation.user.username} -- {donation.user.url}<br /><br />
						</div>
					)
				})}
			</>
		)
	);
};

export default Donations;

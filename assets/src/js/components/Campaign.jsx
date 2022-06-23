const Campaign = (props) => {
	let { campaign } = props;

	return (
		(campaign) && (
			<>	
				<h3>Campaign Details</h3>
				
				<div>
					<strong>Total Raised:</strong> ${campaign.totalAmountRaised}<br />
					<strong>About:</strong> {campaign.description}<br />
					<strong>Campaign:</strong> {campaign.url}/{campaign.slug}<br /><br />
				</div>
			</>
		)
	);
};

export default Campaign;

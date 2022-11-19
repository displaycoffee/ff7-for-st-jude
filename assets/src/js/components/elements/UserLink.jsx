const UserLink = (props) => {
	let { wrapper, campaign, label } = props;

	const link = (
		<a href={campaign.campaign} target="_blank">
			{label ? `${label} ` : ``}
			{campaign.username}
		</a>
	);

	return wrapper ? <p>{link}</p> : <>{link}</>;
};

export default UserLink;

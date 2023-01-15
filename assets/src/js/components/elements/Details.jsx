/* local component imports */
import { Skeleton } from '../elements/Skeleton';

export const Details = (props) => {
	let { settings, details, utils } = props;
	const { id, content, sort, layout, skeleton } = settings;
	const hasDetails = details ? true : false;

	// default details conditions
	let detailsSize = 0;
	let detailsFlattened = [];
	let detailsMerged = [];

	if (hasDetails) {
		detailsSize = utils.size(details);

		// flatten, merge, and re-sort details
		detailsFlattened = utils.flatten(details);
		detailsMerged = utils.merge(detailsFlattened);

		// if on supporting campaign list, do not return base campaign
		if (id == 'supporting') {
			detailsMerged = detailsMerged.filter((detail) => {
				return !detail.isBase;
			});
		}

		// then sort values
		if (sort) {
			utils.values.sort(detailsMerged, 'integer', sort.field, sort.direction);
		}
	}

	return (
		<section id={`detail-${id}`} className={`detail detail-${id}`}>
			<h3 className="detail-title">{content.header}</h3>

			<div className={`detail-row${hasDetails && detailsSize ? ' detail-row-loaded' : ''} flex-wrap`}>
				<Skeleton columns={skeleton.columns} perRow={layout.columns} paragraphs={skeleton.paragraphs} />

				{hasDetails && detailsSize
					? detailsMerged.map((detail, index) => {
							// add extra details to avoid adding more props
							detail.calcTime = detail.endsAt ? utils.values.getTime(detail.endsAt) : false;
							detail.contentName = content.name;
							detail.checks = {
								fundraiserGoalAmount: detail.fundraiserGoalAmount || detail.fundraiserGoalAmount === 0,
								totalAmountRaised: detail.totalAmountRaised || detail.totalAmountRaised === 0,
								amount: detail.amount || detail.amount === 0,
								links: detail.links && detail.links.length !== 0,
							};

							return (
								<div className={`detail-column detail-column-${layout.columns} detail-column-${index}`} key={detail.id}>
									<div className="detail-column-inner">
										{{
											campaign: <DetailsCampaign detail={detail} />,
											supporting: <DetailsSupporting detail={detail} />,
											donations: <DetailsDonation detail={detail} />,
										}[id] || <DetailsDefault detail={detail} />}
									</div>
								</div>
							);
					  })
					: null}
			</div>

			{layout.top && (
				<a onClick={(e) => utils.scrollTo(e, 'top')} className="to-top pointer">
					^ Back to top
				</a>
			)}
		</section>
	);
};

const DetailsCampaign = (props) => {
	let { detail } = props;

	return (
		<>
			{detail.name && (
				<p>
					<strong>{detail.contentName}:</strong> {detail.name}
				</p>
			)}

			{detail.date && (
				<p>
					<strong>Date:</strong> {detail.date}
				</p>
			)}

			{detail.checks.totalAmountRaised && detail.checks.fundraiserGoalAmount && (
				<div className="p">
					<strong>Raised:</strong>
					{` `}
					<div className="level-bar">
						<div className="level-bar-label">
							${detail.totalAmountRaised.toFixed(2)} out of ${detail.fundraiserGoalAmount.toFixed(2)}
						</div>

						<div className="level-bar-outof">
							<div
								className="level-bar-progress"
								style={{
									width: `${(detail.totalAmountRaised / detail.fundraiserGoalAmount) * 100}%`,
								}}
							></div>

							<div className="level-bar-shadow"></div>
						</div>
					</div>
				</div>
			)}

			{detail.description && (
				<p>
					<strong>About:</strong> {detail.description}
				</p>
			)}

			{detail.checks.links && (
				<div className="detail-links">
					{detail.links.map((link) => (
						<p key={link.url}>
							<a href={link.url} target="_blank">
								{link.label}
							</a>
						</p>
					))}
				</div>
			)}
		</>
	);
};

const DetailsSupporting = (props) => {
	let { detail } = props;

	return (
		<>
			{detail.name && (
				<p>
					<strong>{detail.contentName}:</strong> {detail.name}
				</p>
			)}

			{detail.checks.totalAmountRaised && (
				<p>
					<strong>Raised:</strong> ${detail.totalAmountRaised.toFixed(2)}
				</p>
			)}

			{detail.checks.links && (
				<div className="detail-links">
					{detail.links.map((link) => (
						<p key={link.url}>
							<a href={link.url} target="_blank">
								{link.label}
							</a>
						</p>
					))}
				</div>
			)}
		</>
	);
};

const DetailsDonation = (props) => {
	let { detail } = props;

	return (
		<>
			{detail.checks.amount && (
				<p>
					<strong>{detail.contentName}:</strong> ${detail.amount.toFixed(2)} from {detail.name} to&nbsp;
					{detail.checks.links &&
						detail.links.map((link) => (
							<a key={link.url} href={link.url} target="_blank">
								{link.label}
							</a>
						))}
				</p>
			)}

			{detail.comment && (
				<p>
					<strong>Comment:</strong> {detail.comment}
				</p>
			)}
		</>
	);
};

const DetailsDefault = (props) => {
	let { detail } = props;

	return (
		<>
			{detail.name && (
				<p>
					<strong>{detail.contentName}:</strong> {detail.name}
				</p>
			)}

			{detail.date && (
				<p>
					<strong>Date:</strong> {detail.date}
				</p>
			)}

			{detail.description && (
				<p>
					<strong>Description:</strong> {detail.description}
				</p>
			)}

			{detail.checks.totalAmountRaised ? (
				<p>
					<strong>Raised:</strong>{' '}
					{detail.checks.amount ? (
						<>
							${detail.totalAmountRaised.toFixed(2)} out of ${detail.amount.toFixed(2)}
						</>
					) : (
						<>${detail.totalAmountRaised.toFixed(2)}</>
					)}
				</p>
			) : (
				detail.checks.amount && (
					<p>
						<strong>Cost:</strong> ${detail.amount.toFixed(2)}
					</p>
				)
			)}

			{detail.calcTime && (
				<p>
					<strong>Ends:</strong> {detail.calcTime}
				</p>
			)}

			{detail.checks.links && (
				<div className="detail-links">
					{detail.links.map((link) => (
						<p key={link.url}>
							<a href={link.url} target="_blank">
								{link.label}
							</a>
						</p>
					))}
				</div>
			)}
		</>
	);
};

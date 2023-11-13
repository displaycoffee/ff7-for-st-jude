/* local component imports */
import { Skeleton } from '../elements/Skeleton';

export const Details = (props) => {
	let { details, settings, utils } = props;
	const { id, content, sort, layout, skeleton } = settings;
	const hasDetails = details ? true : false;

	// default details conditions
	let detailsSize = 0;
	let detailsFlattened = [];
	let detailsMerged = [];

	if (hasDetails) {
		detailsSize = Object.keys(details).length;

		// flatten, merge, and re-sort details
		detailsFlattened = utils.flatten(details);
		detailsMerged = utils.merge(detailsFlattened);

		// then sort values
		if (sort) {
			utils.sort(detailsMerged, 'integer', sort.field, sort.direction);
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
							detail.contentName = content.name;
							detail.hasLinks = detail?.links && detail.links.length !== 0;

							return (
								<div className={`detail-column detail-column-${layout.columns} detail-column-${index}`} key={detail.id}>
									<div className="detail-column-inner">
										{{
											donations: <DetailsDonation detail={detail} />,
											campaign: <DetailsCampaign detail={detail} />,
											supporting: <DetailsSupporting detail={detail} />,
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

const DetailsDonation = (props) => {
	let { detail } = props;
	const { amount } = detail.amounts;

	return (
		<>
			{detail.amount ? (
				<p>
					<strong>{detail.contentName}:</strong> ${amount.toFixed(2)} from {detail.donor_name} to&nbsp;
					{detail.hasLinks &&
						detail.links.map((link) => (
							<a key={link.url} href={link.url} target="_blank">
								{link.label}
							</a>
						))}
				</p>
			) : null}

			{detail.donor_comment && (
				<p>
					<strong>Comment:</strong> {detail.donor_comment}
				</p>
			)}
		</>
	);
};

const DetailsDefault = (props) => {
	let { detail } = props;
	const { amount, amount_raised } = detail.amounts;

	return (
		<>
			{detail.name && (
				<p>
					<strong>{detail.contentName}:</strong> {detail.name}
				</p>
			)}

			{detail.description && (
				<p>
					<strong>Description:</strong> {detail.description}
				</p>
			)}

			{detail.amount_raised ? (
				<p>
					<strong>Raised:</strong>{' '}
					{detail.amount ? (
						<>
							${amount_raised.toFixed(2)} out of ${amount.toFixed(2)}
						</>
					) : (
						<>${amount_raised.toFixed(2)}</>
					)}
				</p>
			) : detail.amount ? (
				<p>
					<strong>Cost:</strong> ${amount.toFixed(2)}
				</p>
			) : null}

			{detail.date && !detail.date.includes('September 30, 2023') && (
				<p>
					<strong>Ends:</strong> {detail.date}
				</p>
			)}

			{detail.hasLinks && (
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

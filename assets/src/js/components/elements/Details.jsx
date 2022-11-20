/* local component imports */
import Skeleton from '../elements/Skeleton';
import UserLink from '../elements/UserLink';

const Details = (props) => {
	let { details, supporting, utils } = props;
	const { content, sort, layout, skeleton } = details;
	const detailsSize = utils.size(content.details);

	// set detail type
	const detailType = content.name.toLowerCase();

	console.log('details', content.details);

	// flatten, merge, and re-sort details
	const detailsFlattened = utils.flatten(content.details);
	const detailsMerged = utils.merge(detailsFlattened);
	if (sort) {
		utils.values.sort(detailsMerged, 'integer', sort.field, sort.direction);
	}

	return (
		content.details && (
			<section id="detail-details" className="detail detail-details">
				<h3 className="detail-title">{content.header}</h3>

				<div className={`detail-row${detailsSize ? ' detail-row-loaded' : ''} flex-wrap`}>
					<Skeleton columns={skeleton.columns} perRow={layout.columns} paragraphs={skeleton.paragraphs} />

					{detailsSize
						? detailsMerged.map((detail, index) => {
								const campaignUrl = content.name == 'Campaign' ? `${detail.url}/${detail.slug}` : false;

								return (
									<div className={`detail-column detail-column-${layout.columns} detail-column-${index}`} key={detail.id}>
										<div className="detail-column-inner">
											{{
												foo: <></>,
												bar: <></>,
											}[detailType] || <>default</>}

											{content.name == 'Donation' && (
												<>
													{detail.amount && detail.name && (
														<p>
															<strong>{content.name}:</strong> ${detail.amount.toFixed(2)} from {detail.name} to&nbsp;
															<UserLink wrapper={false} campaign={supporting[detail.campaignId]} />
														</p>
													)}

													{detail.comment && (
														<p>
															<strong>Comment:</strong> {detail.comment}
														</p>
													)}
												</>
											)}

											{content.name != 'Donation' && (
												<>
													{detail.name && (
														<p>
															<strong>{content.name}:</strong> {detail.name}
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
												</>
											)}

											{content.name == 'Campaign' && (
												<>
													<div className="p">
														<strong>Raised:</strong>
														{` `}
														<div className="level-bar">
															<div className="level-bar-label">
																${detail.totalAmountRaised.toFixed(2)} out of $
																{detail.fundraiserGoalAmount.toFixed(2)}
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

													<div className="detail-links">
														<p>
															<a href={campaignUrl} target="_blank">
																{campaignUrl.replace('https://', '')}
															</a>
														</p>
													</div>
												</>
											)}

											{content.name != 'Donation' && content.name != 'Campaign' && (
												<>
													{(detail.totalAmountRaised || detail.totalAmountRaised === 0) && detail.amount ? (
														<p>
															<strong>Raised:</strong> ${detail.totalAmountRaised.toFixed(2)} out of $
															{detail.amount.toFixed(2)}
														</p>
													) : (
														detail.amount && (
															<p>
																<strong>Cost:</strong> ${detail.amount.toFixed(2)}
															</p>
														)
													)}

													{detail.endsAt && (
														<p>
															<strong>Ends:</strong> {utils.values.getTime(detail.endsAt)}
														</p>
													)}

													{supporting[detail.campaignId] && (
														<div className="detail-links">
															<UserLink
																wrapper={true}
																campaign={supporting[detail.campaignId]}
																label={content.linkLabel}
															/>
														</div>
													)}
												</>
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
		)
	);
};

export default Details;

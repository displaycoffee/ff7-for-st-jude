const Skeleton = (props) => {
	let { columns, paragraphs } = props;

	// function to build details in skeleton
	const buildSkeleton = (length) => {
		let skeleton = [];
		for (var i = 0; i < length; i++) {
			skeleton.push(i);
		}
		return skeleton;
	};

	// create list of skeletons
	const skeletonColumns = buildSkeleton(columns);
	const skeletonParagraphs = buildSkeleton(paragraphs);

	return skeletonColumns.map((c, index) => (
		<div className={`detail-column${columns == 1 ? ' detail-column-whole' : ''} detail-column-skeleton`} key={c + index}>
			<div className='detail-column-inner'>
				{skeletonParagraphs.map((p, index) => {
					return <p key={p + index}>&nbsp;</p>;
				})}
			</div>
		</div>
	));
};

export default Skeleton;

/* Local styles */
import './styles/skeleton.scss';

export const Skeleton = (props) => {
	let { columns, perRow, paragraphs } = props;

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
		<div className={`column column-width-${Math.floor(100 / perRow)} column-skeleton`} key={c + index}>
			<div className="blue-section">
				{skeletonParagraphs.map((p, index) => {
					return <p key={p + index}>&nbsp;</p>;
				})}
			</div>
		</div>
	));
};

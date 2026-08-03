/* Styles */
import './styles/skeleton.scss';

/* Scripts */
import { SkeletonProps } from './scripts/skeleton-types';

export const Skeleton = (props: SkeletonProps) => {
	const { columns, paragraphs, perRow } = props;

	// Function to build details in skeleton
	const buildSkeleton = (length: number) => {
		const skeleton = [];
		for (let i = 0; i < length; i++) {
			skeleton.push(i);
		}
		return skeleton;
	};

	// Create list of skeletons
	const skeletonColumns = buildSkeleton(columns);
	const skeletonParagraphs = buildSkeleton(paragraphs);

	return skeletonColumns.map((c, index) => (
		<div className={`column column-width-${Math.floor(100 / perRow)} column-skeleton`} key={c + index} aria-hidden="true">
			<div className="gradient-section">
				{skeletonParagraphs.map((p, index) => {
					return <p key={p + index}>&nbsp;</p>;
				})}
			</div>
		</div>
	));
};

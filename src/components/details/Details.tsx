/* Styles */
import './styles/details.scss';

/* Packages */
import { Fragment } from 'react';

/* Scripts */
import { useFormattedId } from '../../_config/scripts/hooks';
import { useAppContext } from '../../context/scripts/context-hooks';
import { DetailsProps, DetailsLinksProps, DetailsNotFoundProps, DetailsParagraphProps } from './scripts/details-types';

export const Details = (props: DetailsProps) => {
	const { hasRow, header, scrollLink } = props;
	const { utils } = useAppContext();
	const fallbackId = useFormattedId();
	const detailsId = header ? utils.handleize(header) : fallbackId;

	return (
		<section id={`details-${detailsId}`} className={`details details-${detailsId}`} tabIndex={-1}>
			{header && <h2 className="details-title">{header}</h2>}

			{props?.children && <div className={`details-content${hasRow ? '' : ' margin-trim gradient-section'}`}>{props.children}</div>}

			{scrollLink && (
				<button
					className="details-to-top pointer unstyled a"
					type="button"
					aria-label="Back to Top Button"
					onClick={(e) => utils.scrollTo(e)}
				>
					^ Back to top
				</button>
			)}
		</section>
	);
};

export const DetailsParagraph = (props: DetailsParagraphProps) => {
	const { content, label } = props;

	return content ? (
		<p>
			<strong>{label}:</strong> {content}
		</p>
	) : null;
};

export const DetailsLinks = (props: DetailsLinksProps) => {
	const { links, wrapper } = props;
	const hasWrapper = !wrapper && wrapper !== false;

	// Create loop for links
	const linksLoop = links.map((link, index) => (
		<Fragment key={link.url}>
			<a href={link.url} target="_blank" rel="noreferrer">
				{link.label}
			</a>

			{index != links.length - 1 && <br />}
		</Fragment>
	));

	return links && links.length != 0 ? hasWrapper ? <div className="details-links">{linksLoop}</div> : linksLoop : null;
};

export const DetailsNotFound = (props: DetailsNotFoundProps) => {
	const { type } = props;

	return (
		<div className="column column-width-100">
			<div className="gradient-section">
				<p role="status">No {type} found.</p>
			</div>
		</div>
	);
};

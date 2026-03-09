/* React */
import { Fragment, useId, useContext } from 'react';

/* Local styles */
import './styles/details.scss';

/* Local scripts */
import { DetailsProps, DetailsLinksProps, DetailsNotFoundProps, DetailsParagraphProps } from './scripts/details-types';

/* Local components */
import { Context } from '../../context/Context';

export const Details = (props: DetailsProps) => {
	const { hasRow, header, scrollLink } = props;
	const context = useContext(Context);
	const utils = context.utils;
	const fallbackId = context.utils.setId(useId());
	const detailsId = header ? utils.handleize(header) : fallbackId;

	return (
		<section id={`details-${detailsId}`} className={`details details-${detailsId}`}>
			{header && <h3 className="details-title">{header}</h3>}

			{props?.children && <div className={`details-content${hasRow ? '' : ' spacing-reset gradient-section'}`}>{props.children}</div>}

			{scrollLink && (
				<button className="details-to-top pointer unstyled a" type="button" onClick={(e) => utils.scrollTo(e)}>
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
	const hasWrapper = !wrapper && wrapper !== false ? true : false;

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
				<p>No {type} found.</p>
			</div>
		</div>
	);
};

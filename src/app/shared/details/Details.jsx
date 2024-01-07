/* React */
import React from 'react';
import { useId, useContext } from 'react';

/* Local styles */
import './styles/details.scss';

/* Local components */
import { Context } from '../../entry/context/Context';

export const Details = (props) => {
	const { header, scrollLink, hasRow } = props;
	const context = useContext(Context);
	const utils = context.utils;
	const fallbackId = useId().replace(/:/g, '');
	const detailsId = header ? utils.handleize(header) : fallbackId;

	return (
		<section id={`details-${detailsId}`} className={`details details-${detailsId}`}>
			{header && <h3 className="details-title">{header}</h3>}

			{props?.children && <div className={`details-content${hasRow ? '' : ' spacing-reset blue-section'}`}>{props.children}</div>}

			{scrollLink && (
				<button className="details-to-top pointer unstyled a" type="button" onClick={(e) => utils.scrollTo(e)}>
					^ Back to top
				</button>
			)}
		</section>
	);
};

export const DetailsParagraph = (props) => {
	const { label, content } = props;

	return content ? (
		<p>
			<strong>{label}:</strong> {content}
		</p>
	) : null;
};

export const DetailsLinks = (props) => {
	const { links, wrapper } = props;
	const hasWrapper = !wrapper && wrapper !== false ? true : false;

	// Create loop for links
	const linksLoop = links.map((link, index) => (
		<React.Fragment key={link.url}>
			<a href={link.url} target="_blank" rel="noreferrer">
				{link.label}
			</a>

			{index != links.length - 1 && <br />}
		</React.Fragment>
	));

	return links && links.length != 0 ? hasWrapper ? <div className="details-links">{linksLoop}</div> : linksLoop : null;
};

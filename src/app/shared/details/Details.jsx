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

	// scroll to top function
	const scrollTo = (e) => {
		e.preventDefault();
		document.body.scrollIntoView({
			behavior: 'smooth',
		});
	};

	return (
		<section id={`details-${detailsId}`} className={`details details-${detailsId}`}>
			{header && <h3 className="details-title">{header}</h3>}

			{props?.children && <div className={`details-content${hasRow ? '' : ' spacing-reset blue-section'}`}>{props.children}</div>}

			{scrollLink && (
				<button className="details-to-top pointer unstyled a" type="button" onClick={(e) => scrollTo(e)}>
					^ Back to top
				</button>
			)}
		</section>
	);
};

export const DetailsLinks = (props) => {
	const { links } = props;

	return links && links.length != 0 ? (
		<div className="details-links">
			{links.map((link, index) => (
				<React.Fragment key={link.url}>
					<a href={link.url} target="_blank" rel="noreferrer">
						{link.label}
					</a>

					{index != links.length - 1 && <br />}
				</React.Fragment>
			))}
		</div>
	) : null;
};

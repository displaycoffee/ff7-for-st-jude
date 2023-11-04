/* React */
import { useId } from 'react';

/* Local styles */
import './styles/details.scss';

/* Local scripts */
import { utils } from '../../_config/scripts/utils';

export const Details = (props) => {
	const { header, scrollLink, hasRow } = props;
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

			{props?.children && <div className={`details-content${hasRow ? '' : ' spacing-reset blue-bg'}`}>{props.children}</div>}

			{scrollLink && (
				<button className="details-to-top pointer unstyled a" type="button" onClick={(e) => scrollTo(e)}>
					^ Back to top
				</button>
			)}
		</section>
	);
};

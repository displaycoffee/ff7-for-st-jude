/* react imports */
import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = (props) => {
	const { links } = props;

	return links.length !== 0 ? (
		<nav className="navigation">
			{links.map((link, index) => (
				<React.Fragment key={index}>
					{link.attributes.to ? <Link {...link.attributes}>{link.label}</Link> : <a {...link.attributes}>{link.label}</a>}

					{index != links.length - 1 && <span key={link.id} className="navigation-separator"></span>}
				</React.Fragment>
			))}
		</nav>
	) : null;
};

export default Navigation;

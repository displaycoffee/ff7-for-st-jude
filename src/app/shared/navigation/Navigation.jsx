/* React */
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

/* Local styles */
import './styles/navigation.scss';

/* Local scripts */
import { navigation } from './scripts/navigation';

/* Local components */
import { Index as IndexContent } from '../../content/index/Index';
import { PageOne } from '../../content/page-one/PageOne';
import { PageTwo } from '../../content/page-two/PageTwo';

export const Navigation = () => {
	return navigation && navigation.length != 0 ? (
		<nav className="navigation">
			<ul className="navigation-list unstyled">
				{navigation.map(
					(nav, index) =>
						nav.showInNav && (
							<React.Fragment key={nav.id}>
								<li className="navigation-list-item">
									<Link to={nav.url} alt={nav.alt || nav.label} title={nav.alt || nav.label}>
										{nav.label}
									</Link>
								</li>

								{index != navigation.length - 1 && <li className="navigation-list-item navigation-list-item-separator">-</li>}
							</React.Fragment>
						),
				)}
			</ul>
		</nav>
	) : null;
};

export const NavigationRoutes = () => {
	return navigation && navigation.length != 0 ? (
		<Routes>
			{navigation.map((nav) => (
				<React.Fragment key={nav.id}>
					{{
						'page two': <Route path={nav.url} element={<PageTwo />} />,
						'page one': <Route path={nav.url} element={<PageOne />} />,
					}[nav.label.toLowerCase()] || <Route path={nav.url} element={<IndexContent />} />}
				</React.Fragment>
			))}
		</Routes>
	) : null;
};

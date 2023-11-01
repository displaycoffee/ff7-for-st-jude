/* React */
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

/* Local styles */
import './styles/navigation.scss';

/* Local scripts */
import { navigation } from './scripts/navigation';

/* Local components */
import { Index as IndexContent } from '../../content/index/Index';
import { ParticipantGuide } from '../../content/participant-guide/ParticipantGuide';

export const Navigation = () => {
	return navigation && navigation.length != 0 ? (
		<nav className="navigation">
			<ul className="navigation-list unstyled">
				{navigation.map((nav, index) => {
					const navAlt = nav.alt || nav.label;

					return (
						nav.showInNav && (
							<React.Fragment key={nav.id}>
								<li className="navigation-list-item">
									{nav.isRoute ? (
										<Link to={nav.url} alt={navAlt} title={navAlt}>
											{nav.label}
										</Link>
									) : (
										<a href={nav.url} alt={navAlt} title={navAlt} target="_blank" rel="noreferrer">
											{nav.label}
										</a>
									)}
								</li>

								{index != navigation.length - 1 && <li className="navigation-list-item navigation-list-item-separator">-</li>}
							</React.Fragment>
						)
					);
				})}
			</ul>
		</nav>
	) : null;
};

export const NavigationRoutes = () => {
	return navigation && navigation.length != 0 ? (
		<Routes>
			{navigation.map(
				(nav) =>
					nav.isRoute && (
						<React.Fragment key={nav.id}>
							{{
								'participant guide': <Route path={nav.url} element={<ParticipantGuide />} />,
							}[nav.label.toLowerCase()] || <Route path={nav.url} element={<IndexContent />} />}
						</React.Fragment>
					),
			)}
		</Routes>
	) : null;
};

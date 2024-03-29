/* React */
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useEffect } from 'react';

/* Local styles */
import './styles/navigation.scss';

/* Local scripts */
import { navigation } from './scripts/navigation';
import { sticky } from './scripts/sticky';

/* Local components */
import { Home } from '../../pages/home/Home';
import { Dashboard } from '../../pages/dashboard/Dashboard';
import { Donations } from '../../pages/donations/Donations';
import { ParticipantGuide } from '../../pages/participant-guide/ParticipantGuide';

export const Navigation = (props) => {
	const { location } = props;

	useEffect(() => {
		if (location == 'header') {
			sticky();
		}
	}, []);

	return navigation && navigation.length != 0 ? (
		<nav className={`navigation navigation-${location}`}>
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
								dashboard: <Route path={nav.url} element={<Dashboard />} />,
								donations: <Route path={nav.url} element={<Donations />} />,
							}[nav.label.toLowerCase()] || <Route path={nav.url} element={<Home />} />}
						</React.Fragment>
					),
			)}
		</Routes>
	) : null;
};

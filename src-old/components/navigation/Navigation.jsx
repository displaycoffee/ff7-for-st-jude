/* React */
import React, { useEffect, createRef, useContext } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';

/* Local styles */
import './styles/navigation.scss';

/* Local scripts */
import { navigation, createNavigationList } from './scripts/navigation';

/* Local components */
import { Context } from '../../context/Context';

export const Navigation = (props) => {
	const { location } = props;
	const { pathname } = useLocation();
	const context = useContext(Context);
	const utils = context.utils;
	const navigationList = createNavigationList(navigation, false);
	const navigationRef = createRef();
	const windowPath = window.location.pathname;

	// Scroll to top when navigation link is clicked on
	useEffect(() => {
		utils.scrollTo();
	}, [pathname]);

	// Make header sticky
	useEffect(() => {
		if (location == 'header') {
			utils.isSticky(navigationRef?.current, 'is-sticky');
		}
	}, []);

	return navigationList && navigationList.length != 0 ? (
		<nav className={`navigation navigation-${location}`} ref={navigationRef}>
			<div className="navigation-fixed">
				<ul className="navigation-list unstyled">
					{navigationList.map((nav, index) => {
						const isIndex = nav.url == '/' ? true : false;
						const isIndexWindow = windowPath == '/' ? true : false;

						// Determine active navigation link
						let isActive = isIndex && isIndexWindow ? true : false;
						if (!isIndex && !isIndexWindow) {
							const windowSlash = `${windowPath}/`;
							const navSlash = `${nav.url}/`;
							isActive = windowSlash.includes(navSlash) ? true : false;
						}

						// Get alt label
						const navAlt = nav.alt || nav.label;

						return (
							<React.Fragment key={nav.id}>
								<li className={`navigation-list-item${isActive ? ' active' : ''}`}>
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

								{index != navigationList.length - 1 && <li className="navigation-list-item navigation-list-item-separator">-</li>}
							</React.Fragment>
						);
					})}
				</ul>
			</div>
		</nav>
	) : null;
};

export const NavigationRoutes = () => {
	const navigationList = createNavigationList(navigation, true);

	return navigationList && navigationList.length != 0 ? (
		<Routes>
			{navigationList.map((nav) => {
				const path = nav.hasChildren ? `${nav.url}/*` : nav.url;
				const navProps = nav?.props ? nav.props : {};

				return <Route path={path} element={<nav.component {...navProps} />} key={nav.id} />;
			})}

			<Route path="*" element={<Navigate to="/" />} />
		</Routes>
	) : null;
};

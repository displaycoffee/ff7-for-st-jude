/* Styles */
import './styles/navigation.scss';

/* Packages */
import { createRef, Fragment, RefObject, Suspense, useEffect } from 'react';
import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';

/* Scripts */
import { useAppContext } from '../../context/scripts/context-hooks';
import { NavigationComponentProps, NavigationListItemProps, NavigationRoutesProps } from './scripts/navigation-types';
import { navigationUtils } from './scripts/navigation-utils';
import { navigationRoutes } from './scripts/navigation-routes';

/* Components */
import { Colors } from '../colors/Colors';
import { LinkExternal, List } from '../blocks/Blocks';

/* Get navigation menu */
const navigationList = navigationUtils.get.list();

export const Navigation = (props: NavigationComponentProps) => {
	const { label, location } = props;
	const { pathname } = useLocation();
	const { utils } = useAppContext();
	const navigationLinkClass = 'navigation-link';
	const navigationRef: RefObject<HTMLDivElement | null> = createRef();

	// Scroll to top when navigation link is clicked on
	useEffect(() => {
		utils.scrollTo();
	}, [pathname, utils]);

	// Make header sticky
	useEffect(() => {
		if (location == 'header') {
			utils.isSticky(navigationRef?.current, 'is-sticky');
		}
	}, [location, navigationRef, utils]);

	return navigationList.length != 0 ? (
		<nav className={`navigation navigation-${location}`} aria-label={label} ref={navigationRef}>
			<div className="navigation-fixed">
				<List className="navigation-list" variant={'ul-unstyled'}>
					{navigationList.map((nav, index) => {
						return (
							<Fragment key={nav.id}>
								<NavigationListItem navigationLinkClass={navigationLinkClass} nav={nav} />

								{index != navigationList.length - 1 && <li className="navigation-list-item navigation-list-item-separator">-</li>}
							</Fragment>
						);
					})}

					<li className="navigation-list-item navigation-list-item-separator">-</li>

					<li className="navigation-list-item">
						<Colors showButton={true} />
					</li>
				</List>
			</div>
		</nav>
	) : null;
};

export const NavigationListItem = (props: NavigationListItemProps) => {
	const { nav, navigationLinkClass } = props;
	const navigationActiveClass = `${navigationLinkClass} ${navigationLinkClass}-active`;

	return (
		<li className="navigation-list-item">
			{nav.isRoute ? (
				<NavLink to={nav.url} className={({ isActive }) => (isActive ? navigationActiveClass : navigationLinkClass)}>
					{nav.label}
				</NavLink>
			) : (
				<LinkExternal href={nav.url}>{nav.label}</LinkExternal>
			)}
		</li>
	);
};

export const NavigationRoutes = () => {
	return navigationRoutes.length != 0 ? (
		<Suspense fallback={null}>
			<Routes>
				{navigationRoutes.map((nav: NavigationRoutesProps) => {
					const navProps = nav?.props ?? {};

					return (
						<Fragment key={nav.id}>
							<Route path={nav.path} element={<nav.element {...navProps} />} />
						</Fragment>
					);
				})}

				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		</Suspense>
	) : null;
};

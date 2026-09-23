/* Styles */
import './styles/navigation.scss';

/* Packages */
import { Fragment, useEffect, useRef } from 'react';
import { Link, useLocation } from '@tanstack/react-router';

/* Scripts */
import type { NavigationComponentProps, NavigationItemComponentProps } from './scripts/navigation-types';
import { navigationUtils } from './scripts/navigation-utils';
import { useViewTransition } from '../../_core/scripts/hooks';
import { useAppContext } from '../../context/scripts/context-hooks';

/* Components */
import { Colors } from '../colors/Colors';
import { LinkExternal, List } from '../blocks/Blocks';

export const Navigation = (props: NavigationComponentProps) => {
	const { data, disableTransition, label, location } = props;
	const { pathname } = useLocation();
	const { utils } = useAppContext();
	const navigationList = navigationUtils.get.list(data);
	const navigationLinkClass = 'navigation-link';
	const navigationRef = useRef<HTMLDivElement | null>(null);

	// Scroll to top when navigation link is clicked on
	useEffect(() => {
		utils.scrollTo();
	}, [pathname, utils]);

	// Make header sticky
	useEffect(() => {
		if (location == 'header') return utils.isSticky(navigationRef.current, 'is-sticky');
	}, [location, utils]);

	return navigationList.length != 0 ? (
		<nav className={`navigation navigation-${location}`} aria-label={label} ref={navigationRef}>
			<div className="navigation-fixed">
				<List className={'navigation-list'} variant={'ul-unstyled'}>
					{navigationList.map((nav, index) => {
						return (
							<Fragment key={nav.id}>
								<NavigationListItem
									disableTransition={disableTransition ?? false}
									navigationLinkClass={navigationLinkClass}
									nav={nav}
								/>

								{index != navigationList.length - 1 && (
									<li className="navigation-list-item navigation-list-item-separator" aria-hidden="true">
										-
									</li>
								)}
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

export const NavigationListItem = (props: NavigationItemComponentProps) => {
	const { children, disableTransition, nav, navigationLinkClass } = props;
	const handleTransition = useViewTransition();

	return (
		<li className="navigation-list-item">
			{nav.isRoute ? (
				<Link
					to={nav.url}
					onClick={disableTransition ? undefined : (e) => handleTransition(e, nav.url)}
					className={navigationLinkClass}
					activeProps={{ className: `${navigationLinkClass}-active` }}
				>
					{nav.label}
				</Link>
			) : (
				<LinkExternal href={nav.url}>{nav.label}</LinkExternal>
			)}
			{children}
		</li>
	);
};

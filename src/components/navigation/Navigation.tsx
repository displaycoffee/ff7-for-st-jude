/* Styles */
import './styles/navigation.scss';

/* Packages */
import { Fragment, useEffect } from 'react';
import { Link, useLocation } from '@tanstack/react-router';

/* Scripts */
import type { NavigationComponentProps, NavigationItemComponentProps } from './scripts/navigation-types';
import { navigationUtils } from './scripts/navigation-utils';
import { useViewTransition } from '../../_core/scripts/hooks';
import { useAppContext } from '../../context/scripts/context-hooks';

/* Components */
import { LinkExternal, List } from '../blocks/Blocks';
import { Dropdown } from '../dropdown/Dropdown';

export const Navigation = (props: NavigationComponentProps) => {
	const { data, disableTransition, label } = props;
	const { pathname } = useLocation();
	const { utils } = useAppContext();
	const navigationList = navigationUtils.get.list(data);
	const navigationLinkClass = 'navigation-link';

	// Scroll to top when navigation link is clicked on
	useEffect(() => {
		utils.scrollTo();
	}, [pathname, utils]);

	return navigationList.length != 0 ? (
		<nav className="navigation" aria-label={label}>
			<List className={'navigation-list'} variant={'ul-unstyled'}>
				{navigationList.map((nav) => {
					return (
						<Fragment key={nav.id}>
							{nav?.children && nav.children.length !== 0 ? (
								<NavigationListItem
									disableTransition={disableTransition ?? false}
									navigationLinkClass={navigationLinkClass}
									nav={nav}
								>
									<Dropdown buttonLabel={`${nav.label} Menu`} closeOnClick={true} hideLabel={true}>
										<List className={'navigation-list-submenu'} variant={'ul-unstyled'}>
											{nav.children.map((child) => {
												return (
													<NavigationListItem
														disableTransition={disableTransition ?? false}
														nav={child}
														navigationLinkClass={navigationLinkClass}
														key={child.id}
													/>
												);
											})}
										</List>
									</Dropdown>
								</NavigationListItem>
							) : (
								<NavigationListItem
									disableTransition={disableTransition ?? false}
									navigationLinkClass={navigationLinkClass}
									nav={nav}
								/>
							)}
						</Fragment>
					);
				})}
			</List>
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

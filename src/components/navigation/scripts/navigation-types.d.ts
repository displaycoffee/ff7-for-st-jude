/* Packages */
import type { ReactNode } from 'react';

/* Type definitions */
type NavigationComponent = {
	data: NavigationMap;
	disableTransition?: boolean;
	label: string;
};

type NavigationItemComponent = {
	children?: ReactNode;
	disableTransition: boolean;
	nav: NavigationFlatItem;
	navigationLinkClass: string;
};

type NavigationFlatItem = {
	children?: NavigationFlatItem[];
	id: string;
	includeInSiteMap: boolean;
	isRoute: boolean;
	label: string;
	showInNav: boolean;
	url: string;
};

type NavigationMapItem = {
	children?: NavigationMap;
	id: string;
	includeInSiteMap: boolean;
	isRoute: boolean;
	label: string;
	showInNav: boolean;
	url: string;
};

type NavigationMap = {
	[key: string]: NavigationMapItem;
};

type NavigationMapItemOptions = {
	children?: NavigationMap;
	includeInSiteMap?: boolean;
	isRoute?: boolean;
	key: string;
	label: string;
	showInNav?: boolean;
	url?: string;
};

/* Export types */
export type NavigationFlatItemType = NavigationFlatItem;

export type NavigationMapItemType = NavigationMapItem;

export type NavigationMapType = NavigationMap;

export type NavigationMapItemOptionsType = NavigationMapItemOptions;

/* Export prop types */
export type NavigationComponentProps = NavigationComponent;

export type NavigationItemComponentProps = NavigationItemComponent;

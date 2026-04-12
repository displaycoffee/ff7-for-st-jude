/* Type definitions */
type Navigation = {
	alt?: string;
	children?: Navigation[];
	element?: JSX.Element;
	id: number;
	isRoute?: boolean;
	label: string;
	props?: ObjectPrimitiveType;
	showInNav?: boolean;
	url: string;
};

type NavigationListItem = {
	children?: ReactNode;
	nav: Navigation;
	navigationLinkClass: string;
	parent?: string;
};

type NavigationLocation = {
	location?: ReactNode;
};

type NavigationRoutes = {
	children?: NavigationRoutes[];
	element: JSX.Element;
	id: number;
	path: string;
	props?: ObjectPrimitiveType;
};

/* Export types */
export type NavigationRoutesType = NavigationRoutes;

export type NavigationType = Navigation;

/* Export prop types */
export type NavigationListItemProps = NavigationListItem;

export type NavigationLocationProps = NavigationLocation;

export type NavigationRoutesProps = NavigationRoutes;

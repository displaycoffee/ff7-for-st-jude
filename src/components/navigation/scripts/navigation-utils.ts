/* Scripts */
import type { NavigationFlatItemType, NavigationMapType, NavigationMapItemType, NavigationMapItemOptionsType } from './navigation-types';

export const navigationUtils = {
	create: (data: NavigationMapItemOptionsType) => {
		const { children, key, label, includeInSiteMap = true, isRoute = true, showInNav = true, url } = data;

		// Build initial navigation item data
		const navigationItem: NavigationMapItemType = {
			id: key,
			includeInSiteMap: includeInSiteMap,
			isRoute: isRoute,
			label: label,
			showInNav: showInNav,
			url: url ? url : `/${key}`,
		};

		// Add children if available
		if (children && Object.keys(children).length !== 0) {
			const childrenKeys = Object.keys(children);
			const modified: NavigationMapType = {};

			// Loop through children to apprent parent id, unless a custom url was already given
			childrenKeys.forEach((child) => {
				const current = children[child];
				const isDefaultUrl = current.url === `/${current.id}`;

				modified[child] = {
					...current,
					url: isDefaultUrl ? `${navigationItem.url}/${current.id}` : current.url,
				};
			});

			// Set updated children
			navigationItem.children = modified;
		}

		return { [key]: navigationItem };
	},
	get: {
		list: (data: NavigationMapType): NavigationFlatItemType[] => {
			return Object.keys(data).map((dataKey) => {
				const { children, ...rest } = data[dataKey];

				// Create modified object
				const modified: NavigationFlatItemType = { ...rest };

				// If children, add array of children
				if (children && Object.keys(children).length !== 0) modified.children = navigationUtils.get.list(children);

				return modified;
			});
		},
		listItem: (data: NavigationMapType, key: string): NavigationFlatItemType | undefined => {
			return navigationUtils.get.list(data).find((item) => item.id === key);
		},
	},
};

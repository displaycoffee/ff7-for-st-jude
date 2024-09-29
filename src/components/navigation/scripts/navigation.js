export const navigation = [
	{
		id: 5,
		label: 'Commentary Stream',
		alt: 'Commentary Stream',
		url: '//twitch.tv/MonetaryDragon',
		showInNav: false,
		isRoute: false,
	},
	{
		id: 4,
		label: 'Donations',
		alt: 'Donations',
		url: '/donations',
		showInNav: true,
		isRoute: true,
	},
	{
		id: 3,
		label: 'Dashboard',
		alt: 'Dashboard',
		url: '/dashboard',
		showInNav: true,
		isRoute: true,
	},
	{
		id: 2,
		label: 'Signup Sheet',
		alt: 'Signup Sheet',
		url: '//docs.google.com/spreadsheets/d/1ebdDFWFl4UzS20Htymp_S3Wzc905N5aeawNysLPUsHg/edit',
		showInNav: false,
		isRoute: false,
	},
	{
		id: 1,
		label: 'Participant Guide',
		alt: 'Participant Guide',
		url: '/participant-guide',
		showInNav: false,
		isRoute: true,
	},
	{
		id: 0,
		label: 'Home',
		alt: 'Home',
		url: '/',
		showInNav: true,
		isRoute: true,
	},
].sort((a, b) => {
	// Sort navigation by id
	return a.id - b.id;
});

/* Function to filter out navigation links */
export const createNavigationList = (navigation, isRoute) => {
	// Determine initial navigaton check
	let hasNavigation = navigation && navigation.length !== 0 ? true : false;

	// Filter out navigation links
	navigation = navigation.filter((nav) => {
		const hasNavLink = (isRoute && nav.isRoute) || (!isRoute && nav.showInNav) ? true : false;
		return hasNavLink;
	});

	// Check navigation again
	hasNavigation = navigation && navigation.length !== 0 ? true : false;

	// Return final navigation
	return hasNavigation ? navigation : [];
};

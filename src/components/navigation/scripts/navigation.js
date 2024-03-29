export const navigation = [
	{
		id: 5,
		label: 'Commentary Stream',
		alt: 'Commentary Stream',
		url: '//twitch.tv/MonetaryDragon',
		showInNav: true,
		isRoute: false,
	},
	{
		id: 4,
		label: 'Donations',
		alt: 'Donations',
		url: '/donations',
		showInNav: false,
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
		url: '//docs.google.com/spreadsheets/d/1L1xFc2R_GRRFRPdSqoZLHWP5SWoxM8drlZhaBd6XZsM/edit#gid=0',
		showInNav: false,
		isRoute: false,
	},
	{
		id: 1,
		label: 'Participant Guide',
		alt: 'Participant Guide',
		url: '/participant-guide',
		showInNav: true,
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

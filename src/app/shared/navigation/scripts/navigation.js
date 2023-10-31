export const navigation = [
	{
		id: 2,
		label: 'Page Two',
		alt: 'Page Two',
		url: '/page-two',
		showInNav: true,
	},
	{
		id: 1,
		label: 'Page One',
		alt: 'Page One',
		url: '/page-one',
		showInNav: true,
	},
	{
		id: 0,
		label: 'Index',
		alt: 'Index',
		url: '/',
		showInNav: true,
	},
].sort((a, b) => {
	// Sort navigation by id
	return a.id - b.id;
});

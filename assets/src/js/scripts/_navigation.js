/* navigation links used throughout app */
export const navigation = {
	index: [
		{
			label: 'NEW GAME',
			attributes: {
				to: '/',
			},
		},
		{
			label: 'Continue?',
			attributes: {
				to: '/continue',
			},
		},
	],
	continue: [
		{
			label: 'Donations',
			attributes: {
				onClick: (e) => utils.scrollTo(e, 'detail-donations'),
				className: 'pointer',
			},
		},
		{
			label: 'Rewards',
			attributes: {
				onClick: (e) => utils.scrollTo(e, 'detail-rewards'),
				className: 'pointer',
			},
		},
		{
			label: 'Targets',
			attributes: {
				onClick: (e) => utils.scrollTo(e, 'detail-targets'),
				className: 'pointer',
			},
		},
	],
	newGame: [
		{
			label: 'Participant Guide',
			attributes: {
				href: 'https://docs.google.com/document/d/1ggjNslCvkzGdsjmWvkJriRNMgvVjSfbsCG-FTPUpBuw',
				target: '_blank',
			},
		},
		{
			label: 'Signup Sheet',
			attributes: {
				href: 'https://docs.google.com/spreadsheets/d/12MUW_ndfxjgkfapai0HXCGlJkZDzZohT04AltKWzzss',
				target: '_blank',
			},
		},
		{
			label: 'Commentary Stream',
			attributes: {
				href: 'https://twitch.tv/MonetaryDragon',
				target: '_blank',
			},
		},
	],
};
